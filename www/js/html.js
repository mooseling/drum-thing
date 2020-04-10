// htmlFuncs contains functions for writing all the repeated html elements
var htmlFuncs = {
  // An instrument track is added to the main editor area for each instrument in the song
  instrumentTrack: function(track = {}) {
    return `
      <div class=instrument-track>
        ${htmlFuncs.trackHeader(track)}
        ${ /* htmlFuncs.notesTrack(track.notes) */ }
      </div>
    `;
  },
  // Every track in the editor needs a header
  // This includes the name of the instrument
  // And maybe other stuff later
  trackHeader: function(track = {}) {
    return `
      <div class=track-header>
        <div class=instrument-name>${track.instrument}</div>
      </div>
    `;
  }
};
