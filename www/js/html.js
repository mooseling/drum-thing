// htmlFuncs contains functions for writing all the repeated html elements
var htmlFuncs = {
  // An instrument track is added to the main editor area for each instrument in the song
  instrumentTrack: function(track = {}, instrument = library.instruments[track.instrument]) {
    return `
      <div class=instrument-track>
        ${htmlFuncs.trackHeader(track, instrument)}
        ${htmlFuncs.notesTrack(track.notes)}
      </div>
    `;
  },
  // Every track in the editor needs a header
  // This includes the name of the instrument
  // And maybe other stuff later
  trackHeader: function(track = {}, instrument = library.instruments[track.instrument]) {
    var instrumentName;
    // First let's figure out the name to display
    // This could be condensed
    if (instrument && instrument.displayName)
      instrumentName = instrument.displayName;
    else if (track.instrument)
      instrumentName = track.instrument;
    else
      instrumentName = 'Unknown drum';

    // Then just plonk the name into some html
    return `
      <div class=track-header>
        <div class=instrument-name>${instrumentName}</div>
      </div>
    `;
  },
  // The time-track for an instrument, showing notes in the right places
  // It's a bit nebulous to me at the moment how this is going to work
  notesTrack: function(notes) {
    return `
      <div class=notes-track></div>
    `;
  }
};
