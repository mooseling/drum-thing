// ui functions for changing what's displayed and whatnot
// Might also include handlers later
var ui = {
  loadSong: function(song) {
    ui.clearSong();
    if (song.composition && song.composition[0]) {
      let sectionName = song.composition[0].name;
      if (song.sections && song.sections[sectionName])
        ui.loadSection(song.sections[sectionName]);
    }
  },
  // Function to clear out the ui of whatever song is there currently
  clearSong: function() {
    // Later when the ui is more filled out, there will be more here

    // call clearTracks to... clear the tracks
    ui.clearTracks();
  },
  // Clear the html in the tracks area of the ui
  clearTracks: function() {
    $('#tracks').html('');
  },
  // Load a section into the editor
  loadSection: function(section) {
    var html = '';
    section.tracks.forEach(track => html += htmlFuncs.instrumentTrack(track));
    $('#tracks').html(html);
  }
};
