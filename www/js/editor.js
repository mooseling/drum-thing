/* exported editor */
var editor = {
  blankSection: function({tempo = player.tempo(), timeSignature = player.timeSignature(), length = player.sectionLength()} = {}) {
    return {tempo, timeSignature, length, tracks: []};
  }
};
