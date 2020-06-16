// htmlFuncs contains functions for writing all the repeated html elements
var htmlFuncs = {
  // An instrument track is added to the main editor area for each instrument in the song
  instrumentTrack(section, track = {}, instrument = library.instruments[track.instrument]) {
    var div = document.createElement('div');
    div.classList.add('instrument-track');
    div.appendChild(htmlFuncs.trackHeader(track, instrument));
    div.appendChild(htmlFuncs.notesTrack(section, track.notes));
    return div;
  },
  // Every track in the editor needs a header
  // This includes the name of the instrument
  // And maybe other stuff later
  trackHeader(track = {}, instrument = library.instruments[track.instrument]) {
    var instrumentName, div;
    // First let's figure out the name to display
    // This could be condensed
    if (instrument && instrument.displayName)
      instrumentName = instrument.displayName;
    else if (track.instrument)
      instrumentName = track.instrument;
    else
      instrumentName = 'Unknown drum';

    div = document.createElement('div');
    div.classList.add('track-header');
    div.innerHTML = `<div class=instrument-name>${instrumentName}</div>`;
    return div;
  },
  // The time-track for an instrument, showing notes in the right places
  // It's a bit nebulous to me at the moment how this is going to work
  notesTrack(section, notes) {
    var blankTrack = htmlFuncs.blankNotesTrack(section);
    ui.insertNotes(blankTrack, notes); // Shouldn't have a dependency on ui, must restructure this later
    return blankTrack;
  },

  blankNotesTrack(section = {}, timeSignature = player.timeSignature()) {
    var length = section.length || 4, // number of bars, default to 4
      div = document.createElement('div'),
      html = '',
      // which kind of notes make up a bar is the lower half of the time signature
      noteShorthand = htmlFuncs.getNoteShorthand(timeSignature[1]), // w, h, q, e, s, t, st
      noteHtml = htmlFuncs.notes[noteShorthand], // get the right note function. Each note function will call all the smaller note functions
      notesPerBar = timeSignature[0];
    div.classList.add('notes-track');
    for (var bar = 1; bar <= length; bar++) {
      html += `<div class=bar index=${bar}>`;
      for (let note = 1; note <= notesPerBar; note++)
        html += noteHtml(note);
      html += '</div>';
    }
    div.innerHTML = html;
    return div;
  },
  // Notes have a shorthand to refer to them, eg. 16th -> 's', quarter -> 'q'
  // It's universal across functions and elements
  // But what should the name be? level? note? shorthand? noteLevel?
  getNoteShorthand(division) {
    switch (division) {
      case 1: return 'w';
      case 2: return 'h';
      case 4: return 'q';
      case 8: return 'e';
      case 16: return 's';
      case 32: return 't';
    }
  },
  // simple function to point down to the next level.
  // eg. half note -> quarter note, quarter note -> eighth note
  getNextLevel(shortHand) {
    switch(shortHand) {
      // whole note
      case 'w': return 'h';
      // half note
      case 'h': return 'q';
      // quarter note
      case 'q': return 'e';
      // 8th note
      case 'e': return 's';
      // 16th note
      case 's': return 't';
      // 32nd note
      case 't': return 'st'; // might never use this, it's an odd case
      // 64th triplet
      case 'st': return false; // Nothing below here
    }
  },
  // html wrappers for notes
  // We could maybe refactor into a single recursive thing that uses getNextLevel
  // But it would stop making sense at 32nds so maybe just don't bother
  notes: { // w, h, q, e, s, t, st
    // whole notes
    w: index => `<div note=w index=${index} class="note whole">${htmlFuncs.notes.h(1)}${htmlFuncs.notes.h(2)}</div>`,
    // half notes
    h: index => `<div note=h index=${index} class="note eighth">${htmlFuncs.notes.q(1)}${htmlFuncs.notes.q(2)}</div>`,
    // quarter notes
    q: index => `<div note=q index=${index} class="note eighth">${htmlFuncs.notes.e(1)}${htmlFuncs.notes.e(2)}</div>`,
    // 8th notes
    e: index => `<div note=e index=${index} class="note quarter">${htmlFuncs.notes.s(1)}${htmlFuncs.notes.s(2)}</div>`,
    // 16th notes
    s: index => `<div note=s index=${index} class="note sixteenth">${htmlFuncs.notes.t(1)}${htmlFuncs.notes.t(2)}</div>`,
    // 32nd notes
    t: index => `<div note=t index=${index} class="note thirty-second">${htmlFuncs.notes.st(1)}${htmlFuncs.notes.st(2)}${htmlFuncs.notes.st(3)}</div>`,
    // 64th-triplets
    st: index => `<div note=st index=${index} class="note sixty-forth-triplet"></div>`
  }
};
