var library = {
  instruments: {
    kick: { // each instrument has different kinds of notes
      displayName: 'Kick',
      notes: { // notes are arrays of filenames in order of preference for Howler
        k:['kick.mp3'] // k for kick
      }
    },
    snare: {
      displayName: 'Snare',
      notes: {
        x:['snare.mp3'], // normal hit
        r:['roll.mp3'] // roll
      }
    },
    hihat: {
      displayName: 'Hi Hat',
      notes: {
        c:['hihat.mp3'] // closed
      }
    }
  },
  // Loading the library just means creating Howls for each sound
  // Also need to play each sound to initialise it for some reason
  load: function() {
    $.each(library.instruments, (i, instrument) => {
      if (instrument.notes) {
        $.each(instrument.notes, (j, note) => {
          note.howl = new Howl({src: 'sounds/'+note});
          note.howl.on('load', function() {
            this.mute(true); // We need to play the sound muted once it loads
            var id = this.play(); // Otherwise the first play can lag a bit
            this.on('end', () => library.cleanHowl(this), id);
          });
        });
      }
    });
  },
  // After we initialise the Howls, they have some junk attached to them that we don't want any more
  // So cleanHowl removes some handlers and changes whatever settings as needed
  cleanHowl: function(howl) {
    howl.off('end'); // Not necessary to remove these handlers
    howl.off('load'); // But it doesn't cost anything to streamline things for future playback
    howl.mute(false); // Definitely need to unmute though
  }
};
