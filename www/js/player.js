var player = { // no error lookout for undefined properties
  play: function(){
    player.next = 0;
    player.loopCount = 0;
    player.startTime = Date.now();
    player.mainLoop();
    $(document).one('keypress', player.stop);
  },
  stop: function(){
    clearTimeout(player.loopTimeout);
    $(document).one('keypress', player.play);
  },
  mainLoop: function() {
    var progress = Date.now() - player.startTime;
    while(progress > player.step*player.next) {
      if(Array.isArray(player.song[player.next]))
        player.song[player.next].forEach(howl => howl.play());
      player.next++;
    }
    player.loopTimeout = setTimeout(player.mainLoop,5);
  },
  loadSong: function(song) {
    player.song = []; // 64 elements for now
    song.composition.forEach(section => { // First we fill up the song array
      song.sections[section.name].tracks.forEach(track => {
        var instrument = library.instruments[track.instrument];
        track.notes.forEach(note => {
          var time = 0;
          note.time.forEach((count,level) => { // 1,0, 4,1
            time += (count - 1)*(16/(4**level));
          });
          if (player.song[time])
            player.song[time].push(instrument.notes[note.note].howl);
          else
            player.song[time] = [instrument.notes[note.note].howl];
        });
      });
    });
    // Now we figure out the time interval between 16th notes
    player.step = 60000/(song.bpm * song.timeSignature[1]);
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
