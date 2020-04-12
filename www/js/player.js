/* exported player */
var player = {
  // Function to start playback
  play: function(){
    state.next = 0;
    state.loopCount = 0;
    state.startTime = Date.now();
    player.mainLoop();
    $(document).one('keypress', player.stop); // should be replaced by a return
  },
  // Function to stop playback
  stop: function(){
    clearTimeout(state.loopTimeout);
    $(document).one('keypress', player.play); // should be replaced by a return
  },
  // Internal function which loops at a certain framerate and plays notes when it hits them
  mainLoop: function() {
    var progress = Date.now() - state.startTime;
    while(progress > state.step*state.next) {
      if(Array.isArray(state.playArray[state.next]))
        state.playArray[state.next].forEach(howl => howl.play());
      state.next++;
    }
    state.loopTimeout = setTimeout(player.mainLoop, 5);
  },
  loadSong: function(song) {
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
  loadSection: function(section = player.getFirstSection() || editor.blankSection()) {
    state.currentSection = section;
    state.step = player.calcStepLength(section);
    state.playArray = state.playableSections[section.name]; // fudge for now - won't work if song has no sections
  },
  // Get the first section of the current song
  getFirstSection: function(song = state.loadedSong) {
    if (!song || !song.sections || $.isEmptyObject(song.sections))
      return false;
    if (Array.isArray(song.composition) && song.composition[0] && song.sections[song.composition[0]])
      return song.sections[song.composition[0]];
    return song.sections[Object.keys(song.sections)[0]];
  },
  // convert the human-readable section into a playable array
  createPlayableSection: function(section) {
    var playableSection = state.playableSections[section.name] = [];
    section.tracks.forEach(track => {
      var instrument = library.instruments[track.instrument];
      track.notes.forEach(note => {
        var time = 0;
        note.time.forEach((count, level) => time += (count - 1)*(16/(4**level))); // 1,0, 4,1
        if (playableSection[time])
          playableSection[time].push(instrument.notes[note.note].howl);
        else
          playableSection[time] = [instrument.notes[note.note].howl];
      });
    });
    return playableSection;
  },
  // Calculate the time interval between the smallest notes (16ths for 4/4 time... I think)
  // Any object with a tempo and timeSignature can be passed in (songs, sections)
  calcStepLength: function({tempo = player.tempo(), timeSignature = player.timeSignature()} = {}) {
    return 30000/(tempo * timeSignature[1]);
    // return 60000/(tempo * timeSignature[1]);
  },
  // This will have to be replaces by section
  loadStateFromSection: function({tempo, timeSignature, length}) {
    state.tempo = tempo;
    state.timeSignature = timeSignature;
    state.sectionLength = length;
  },
  // Get or set the current tempo
  // precondition: state is defined. But it should always be defined.
  // In the future, share some code with player.timeSignature below
  tempo: function(tempo) {
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
  timeSignature: function(timeSignature) {
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
  sectionLength: function(sectionLength) {
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
