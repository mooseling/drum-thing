/* exported player */

var player = {
  // Function to start playback
  play(event) {
    if (event.code !== 'Space')
      return;
    state.next = 0;
    state.loopCount = 0;
    state.startTime = Date.now();
    setTimeout(player.mainLoop, 0);
    document.removeEventListener('keydown', player.play);
    player.listener = document.addEventListener('keydown', player.stop);
  },

  // Function to stop playback
  stop(event) {
    if (event.code !== 'Space')
      return;
    clearTimeout(state.loopTimeout);
    document.removeEventListener('keydown', player.stop);
    player.listener = document.addEventListener('keydown', player.play);
  },
  // Internal function which loops at a certain framerate and plays notes when it hits them
  mainLoop() {
    var progress = Date.now() - state.startTime;
    while(progress > state.step*state.next) {
      if(Array.isArray(state.playArray[state.next]))
        state.playArray[state.next].forEach(howl => howl.play());
      state.next++;
    }
    state.loopTimeout = setTimeout(player.mainLoop, 5);
  },

  loadSong(song) {
    state.loadedSong = song;

    // Then we create playable arrays from each section of the song
    var playableSections = state.playableSections = {};
    // For each section in the song, we create an array that mainLoop can play
    // Using for..in  to see if we can move away from jquery
    for (let sectionName in song.sections)
      playableSections[sectionName] = player.createPlayableSection(song.sections[sectionName]);

    // Now that the song is loaded in, load the first section
    // player.loadSection defaults to the first section
    player.loadSection();
  },

  loadSection(section = player.getFirstSection() || editor.blankSection()) {
    state.currentSection = section;
    state.step = player.calcStepLength(section);
    state.playArray = state.playableSections[section.name]; // fudge for now - won't work if song has no sections
  },

  // Get the first section of the current song
  getFirstSection(song = state.loadedSong) {
    if (!player.songHadAnySections(song))
      return false;
    if (Array.isArray(song.composition) && song.composition[0] && song.sections[song.composition[0]])
      return song.sections[song.composition[0]];
    return song.sections[Object.keys(song.sections)[0]];
  },
  songHadAnySections(song = state.loadedSong) {
    if (song && song.sections) {
      for (let key in song.sections)
        if (song.sections[key])
          return true;
    }
    return false;
  },

  // convert the human-readable section into a playable array
  createPlayableSection(section) {
    var playableSection = state.playableSections[section.name] = [];
    section.tracks.forEach(track => {
      var instrument = library.instruments[track.instrument];
      track.notes.forEach(note => {
        var time = 0;
        // Starting to understand this next line. shortest time we'll ever need is about 30ms
        // At 120 bpm, that's the time between 32nd notes, which will only get played for crazy fast doubles
        // But we can have triplets at the 16th level
        // Which makes sense, because that leaves the quarter notes untouched
        // Which is typically where the pulse is
        // And therefore switching from 4 to 3 between the pulse is dank
        note.time.forEach((count, level) => time += player.convertNotationToSteps(count, level)); // 1,0, 4,1
        if (playableSection[time])
          playableSection[time].push(instrument.notes[note.note].howl);
        else
          playableSection[time] = [instrument.notes[note.note].howl];
      });
    });
    return playableSection;
  },

  // level is level of precision, the higher it goes, the smaller the time intervals in question
  // count is number of intervals at this level we need to add
  convertNotationToSteps(count, level, timeSignature = player.timeSignature()) {
    var beatUnit = timeSignature[1];
    if (level === 0) { // Top level is number of bars, and cares about the second half of the time signature
      let beatsPerBar = timeSignature[0];
      let stepsPerBeat = 96/beatUnit;
      return (count - 1) * beatsPerBar * stepsPerBeat;
    }
    // 24 steps per quarter-note, 12 per 8th, 6 per 16th, 3 per 32nd
    // So that's 96/beatUnit, but then we need to account for level
    // Each time we go down a level, the number of steps gets divided by 2
    // levelUnit is which level we're at in absolute terms (4ths, 8ths, 16ths, 32ths)
    let levelUnit = beatUnit*(4**(level-1));
    let stepsPerNote = 96/levelUnit;
    let steps = 0;
    if (typeof count === 'string' && count.includes('T')) { // This note includes extra triplets
      let triplets = count.includes('TT') ? 2 : 1;
      count = count.replace(/T/g, '');
      steps += triplets * stepsPerNote / 3; // this is the number of added 64th-triplets
    }
    steps += (count - 1)*stepsPerNote;
    return steps;
  },

  // Calculate the time interval between the smallest notes
  // These notes are techincally 64th-note triplets, there are 3 per 32nd-note
  // Caixa typically plays 16th notes hand to hand, 32nd-notes for doubles
  // They may play 16th-note triplets (6 hits per quarter-beat) for some super spice
  // Nothing is played at 64-note triplet intervals, but these are required to hit both 32nds and 16th triplets
  // Any object with a tempo and timeSignature can be passed in (songs, sections)
  calcStepLength({tempo = player.tempo(), timeSignature = player.timeSignature()} = {}) {
    // This is an assumption for now. Later beatUnit will be setable on its own
    // Tempo is beats per minute, but what counts as a beat is beatUnit
    // Typically this is the second number in the time signature
    // But it can also be defined separately. Eg, in 6/8, beat unit is usually 4ths, not 8ths
    var beatUnit = timeSignature[1];
    // Math time
    // steps are 64th-triplets, or 1/3 of a 32nd notes
    // => 96/beatUnit is 64th-triplets per beat
    // tempo is bpm => 60000/tempo = milliseconds per beat
    // => 60000/tempo * beatUnit/96 = milliseconds per milliseconds per 64th-triplet
    // => step = 625 * beatUnit / tempo
    return 625 * beatUnit / tempo;
    // return 60000/(tempo * timeSignature[1]);
  },

  // This will have to be replaces by section
  loadStateFromSection({tempo, timeSignature, length}) {
    state.tempo = tempo;
    state.timeSignature = timeSignature;
    state.sectionLength = length;
  },

  // Get or set the current tempo
  // precondition: state is defined. But it should always be defined.
  // In the future, share some code with player.timeSignature below
  tempo(tempo) {
    // First branch is for when no variable is passed in, in which case the caller wants the current tempo
    if (typeof tempo === 'undefined') {
      if (typeof state.tempo === 'number')
        return state.tempo;
      if (state.section && typeof state.section.tempo === 'number')
        return state.section.tempo;
      if (state.song && typeof state.song.tempo === 'number')
        return state.song.tempo;
      return 120;
    }
  },

  // Get or set the current timeSignature
  // precondition: state is defined. But it should always be defined.
  timeSignature(timeSignature) {
    // First branch is for when no variable is passed in, in which case the caller wants the current tempo
    if (typeof timeSignature === 'undefined') {
      if (typeof state.timeSignature === 'number')
        return state.timeSignature;
      if (state.section && typeof state.section.timeSignature === 'number')
        return state.section.timeSignature;
      if (state.song && typeof state.song.timeSignature === 'number')
        return state.song.timeSignature;
      return [4,4];
    }
  },

  // get or set the current section length
  // A lot of this probably conceptually wrong
  sectionLength(sectionLength) {
    // First branch is for when no variable is passed in, in which case the caller wants the current tempo
    if (typeof sectionLength === 'undefined') {
      if (typeof state.sectionLength === 'number')
        return state.sectionLength;
      if (state.section && typeof state.section.length === 'number')
        return state.section.length;
      if (state.song && typeof state.song.length === 'number')
        return state.song.length;
      return 4;
    }
  }
};




// old mainLoop:
// mainLoop: function() {
//   var progress = Date.now() - player.startTime;
//   if(progress - player.loopCount * player.song.loopEnd > player.song.loopEnd){
//     player.next = 0;
//     player.loopCount++;
//   }
//   if(progress - player.loopCount * player.song.loopEnd  > song.times[player.next]) {
//     player.song[song.times[player.next]].forEach(name => library.sounds[name].howl.play());
//     player.next++;
//   }
//   player.loopTimeout = setTimeout(player.mainLoop,5);
// },
