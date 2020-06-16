// ui functions for changing what's displayed and whatnot
// Might also include handlers later
var ui = {
  loadSong(song) {
    ui.clearSong();
    if (song.composition && song.composition[0]) {
      let sectionName = song.composition[0].name;
      if (song.sections && song.sections[sectionName])
        ui.loadSection(song.sections[sectionName]);
    }
  },
  // Function to clear out the ui of whatever song is there currently
  clearSong() {
    // Later when the ui is more filled out, there will be more here

    // call clearTracks to... clear the tracks
    ui.clearTracks();
  },
  // Clear the html in the tracks area of the ui
  clearTracks() {
    var tracks = document.getElementById('tracks');
    if (tracks)
      tracks.innerHTML = '';
  },
  // Load a section into the editor
  loadSection(section) {
    var tracks = document.getElementById('tracks');
    tracks.innerHTML = '';
    section.tracks.forEach(track => tracks.appendChild(htmlFuncs.instrumentTrack(section, track)));
  },
  // Fill the notes into a track element
  // You don't know exactly what's being passed as track, so do some searching
  // It could be the notes-track, or the instrument-track
  insertNotes(track, notes) {
    if (!track.classList.contains('notes-track'))
      track = track.getElementByClassName('notes-track');
    notes.forEach(note => {
      // something with findNote
    });

  },
  // pass in a time in the format of a saved song
  // and find the correct 64th-triplet element in the track
  findNote(track, time, timeSignature = player.timeSignature) {
    // First we find the correct bar. This is easy.
    var noteElem = track.querySelector(`.bar[index=${time[0]}]`);
    var topDivision = timeSignature[1];
    var noteShorthand = htmlFuncs.getNoteShorthand(topDivision); // w, h, q, e, s, t, st
    var level = 1;
    while (time[level] !== undefined) {
      let count = time[level];
      if (count.contains('T')) {
        // do something to find triplets...
      } else {
        noteElem = noteElem.querySelector(`.note[note=${noteShorthand}][index=${count}]`);
      }
      // Now we go down one level
      level++;
      // Find the short hand for this level
      noteShorthand = htmlFuncs.getNoteShorthand(topDivision * (2**level));
    }
    noteElem = ui.findFirstSixtyForthTriplet(noteElem);
  },
  // finding the first 64th triplet is recursive
  findFirstSixtyForthTriplet(noteElem) {
    // Use attribute to find out which level we're at
    var level = noteElem.getAttribute('note');

    // Then see if we can go down further
    var nextLevel = htmlFuncs.getNextLevel(level);

    // If there's another level down, get the first one at that level
    if (nextLevel)
      return ui.findFirstSixtyForthTriplet(noteElem.querySelector(`.note[note=${nextLevel}][index=1]`));

    // If not, just return this element
    return noteElem;
  }
};
