/* exported song */
var song = {
  title: 'Example',
  author: 'James',
  comment: 'blah blah',
  composition: [{name: 'intro', loop: true}],//,"break 1",{name: 'main groove',loop:true}],
  timeSignature: [4,4],
  tempo: 120,
  sections: {
    intro: {
      timeSignature: [4,4],
      tempo: 120,
      length: 4, // 4 bars
      tracks: [
        // {
        //   instrument: 'snare', // times could maybe just be arrays
        //   notes:[{note: 'x', time:[1]},{note: 'x', time:[1,4]},{note: 'x', time:[2,3]},{note: 'x', time:[4,1]}]
        // },
        {
          instrument: 'snare',
          notes:[{note: 'x', time:[1,3]},{note: 'x', time:[2,3]},{note: 'x', time:[3,3]},{note: 'x', time:[4,3]}]
        },
        {
          instrument: 'kick',
          notes:[{note: 'k', time:[1]},{note: 'k', time:[2]},{note: 'k', time:[3]},{note: 'k', time:[4]}]
        },
        {
          instrument: 'hihat',
          notes:[
            {note: 'c', time:[1]},{note: 'c', time:[1,2]},{note: 'c', time:[1,3]},{note: 'c', time:[1,4]},
            {note: 'c', time:[2]},{note: 'c', time:[2,2]},{note: 'c', time:[2,3]},{note: 'c', time:[2,4]},
            {note: 'c', time:[3]},{note: 'c', time:[3,2]},{note: 'c', time:[3,3]},{note: 'c', time:[3,4]},
            {note: 'c', time:[4]},{note: 'c', time:[4,2]},{note: 'c', time:[4,3]},{note: 'c', time:[4,4]},
          ]
        }
      ]
    }
  }
};
