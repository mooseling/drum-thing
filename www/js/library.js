var library = {
  instruments: {
    kick: { // each instrument has different kinds of notes
      k:['kick.mp3'] // k for kick
    },
    snare: {
      x:['snare.mp3'], // normal hit
      r:['roll.mp3'] // roll
    },
    hihat: {
      c:['hihat.mp3'] // closed
    }
  },
  load: function() {
    $.each(library.instruments, (i, instrument) => {
      $.each(instrument, (j, note) => {
        note.howl = new Howl({src: 'sounds/'+note});
        note.howl.on('load', function() {
          this.mute(true); // We need to play the sound muted once it loads
          var id = this.play(); // Otherwise the first play can lag a bit
          this.on('end', () => library.cleanHowl(this),id);
        });
      });
    });
  },
  cleanHowl: function(howl) {
    howl.off('end'); // Not necessary to remove these handlers
    howl.off('load'); // But it doesn't cost anything to streamline things for future playback
    howl.mute(false); // Definitely need to unmute though
  }
};
