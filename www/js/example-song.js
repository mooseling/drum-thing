var song = {
  title:"Example",
  author:"James",
  comment:"blah blah",
  composition: [{name:"intro",loop:true}],//,"break 1",{name:"main groove",loop:true}],
  timeSignature:[4,4],
  bpm:120,
  parts: {
    intro: {
      timeSignature:[4,4],
      bpm:120,
      length:4, // 4 bars
      tracks: [
        {
          instrument:"snare", // times could maybe just be arrays
          notes:[{note:"x",time:[1]},{note:"x",time:[1,4]},{note:"x",time:[2,3]},{note:"x",time:[4,1]}]
        },
        {
          instrument:"snare",
          notes:[{note:"r",time:[1]},{note:"r",time:[2]},{note:"r",time:[3]},{note:"r",time:[4]}]
        },
        {
          instrument:"kick",
          notes:[{note:"k",time:[1]},{note:"k",time:[2]},{note:"k",time:[3]},{note:"k",time:[4]}]
        },
        {
          instrument:"hihat",
          notes:[{note:"c",time:[1]},{note:"c",time:[2]},{note:"c",time:[3]},{note:"c",time:[4]}]
        }
      ]
    }
  }
};
