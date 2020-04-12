# drum-thing
Drum sequencer, built with samba composition in mind

Doesn't do much right now.
Press space to load the library, then space again to start playing. Because sound can be annoying and horrible for websites, browsers won't load the library unless in response to some user input.

Currently we use a library called Howler for some reason. It simplifies browser sound stuff.

Current structure
-----------------
There are 4 global javascript variables that handle everything.
* state: contains the current state of playback, including the loaded song, current section, tempo, time signature, etc.
* player: functions for playing, stopping, and loading a song.
* library: contains sounds for player to use, has functions for loading drum packs. In theory, different songs could be using different sets of drums, though at the moment we're just thinking about batteria drums. library has a function load that gets the sounds loaded into the browser and ready to play. Currently this needs to be called before doing anything else.
* ui: has functions for displaying the current state, adding html to the page and whatnot. It reads player and calls functions in htmlFuncs.
* htmlFuncs: contains functions for generating the html elements ui wants to display.
* editor: deals with creating and changing song data. Not much in here now.



To do
-----
* player has a bug. Tempo seems way out. Or is the example song just rubbish? Either way, find out.
* Player needs to keep track of current section, because ui needs to know the length in order to figure out how much html to generate. Also for looping. And for sanity.
* ui track generation
