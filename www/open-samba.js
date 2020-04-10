var startTime, player, next, loopCount;//array of milliseconds
// 120 bpm => 2 bps, 500 ms between each
// song[0] = ["kick","hihat"];
// song[500] = ["hihat"];
// song[1000] = ["hihat","snare"];
// song[1500] = ["hihat"];
// song.loopEnd = 2000;
//
// song.times = [0,500,1000,1500];

$(document).one("keypress", e => {
  library.load();
  player.loadSong(song);
  $(document).one("keypress",player.play);
});
