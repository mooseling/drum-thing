/* exported state */ /* global song */
// 120 bpm => 2 bps, 500 ms between each
// song[0] = ["kick","hihat"];
// song[500] = ["hihat"];
// song[1000] = ["hihat","snare"];
// song[1500] = ["hihat"];
// song.loopEnd = 2000;
//
// song.times = [0,500,1000,1500];

// E.g., current song, play position, tempo, etc
// Used to be a property of player, not sure where it should be
var state = {};

function runPage() {
  library.load();
  player.loadSong(song); // Currently we have an example song loaded in. Later this won't be the case.
  ui.loadSong(song);
  document.removeEventListener('keydown', runPage);
  document.addEventListener('keydown', player.play);
}

document.addEventListener('keydown', runPage);
