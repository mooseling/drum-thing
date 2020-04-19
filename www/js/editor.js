/* exported editor */
// All functions for changing a song are here
// They should all have inverse functions so we can have an undo function
var editor = {
  blankSection: function({tempo = player.tempo(), timeSignature = player.timeSignature(), length = player.sectionLength()} = {}) {
    return {tempo, timeSignature, length, tracks: []};
  }
};
