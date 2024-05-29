This app - used with either an iPhone or Android device connects to an api hosted on a users machine. 

I created this app because i read a lot of webtoons/manga/manwha/manhua on my computer and got sick of endlessly having to use my scroll wheel on my mouse.

With this app i can control my mouse to an extend in a more confortable position in my chair and hold a button to scroll instead of swiping my mouse wheel. 

To use the app locally, as this has only been tested locally. 
in app.js - adjust the socket IP address to match your computers ip, you can find this in a terminal < ipconfig and just set it to whatever your local devices ip is.
in index.js - the socket runs on port 3000, there are no adjustments needed here unless you decide to change the monitor features.

I have 3 monitors [2, 1, 3] - in this position.
so in app.js i have a view, and i just set the buttons to select which monitor i want to use from left to right [monitor 2, monitor 1, monitor 3]

these buttons force the mouse position to somewhat centered on the monitor i want, because for whatever reason the joystick i built doesn't move monitor to monitor. 

in index.js i set the coordinates i want the mouse to be positioned at when i hit the monitor buttons.
to find the x,y coords i have a log on my left click which shows me my current mouse position, and i just set my coords accordingly.
  
  socket.on('monitor1', async () => {
    await mouse.setPosition({ x: 932, y: 604 }); // x and y here, are the position i choose to set my mouse too for each monitor, adjust according to your use case
  });
  socket.on('monitor2', async () => {
    await mouse.setPosition({ x: -941, y: 591 });
  });
  socket.on('monitor3', async () => {
    await mouse.setPosition({ x: 2600, y: -100 });
  });
