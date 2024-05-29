### This app - used with either an iPhone or Android device connects to an api hosted on a users machine. It is not published on any store so in my case i run it locally since its really just for a local machine
### ***[Expo Go](https://expo.dev/go) is required to run this locally, unless you plan on building the app yourself and ejecting.***

### I created this app because i read a lot of webtoons/manga/manwha/manhua on my computer and got sick of endlessly having to use my scroll wheel on my mouse.
### With this app i can control my mouse to an extend in a more confortable position in my chair and hold a button to scroll instead of swiping my mouse wheel. 

***Feel free to fork this and use it however you wan't, i use [robotjs](https://robotjs.io/), and [nutjs](https://nutjs.dev/) since both have some functionality i prefer over the other

### To use the app locally just pull it to a folder of your choosing or download the zip, and run npm install in the main folder, and again in the api folder to install packages.
### to run, npm start in both the main folder, and api folder. You will know if it's running correctly if it says a user is connected in the logs.

## in app.js - adjust the socket IP address to match your computers local ip address
in index.js - the socket runs on port 3000, there are no adjustments needed here unless you decide to change the monitor features.
```
const socket = io('http://192.168.0.103:3000');
```

For my setup at home
I have 3 monitors [2, 1, 3] - in this position.
so in app.js i have a view, and i just set the buttons to select which monitor i want to use from left to right [monitor 2, monitor 1, monitor 3]
these buttons force the mouse position to somewhat centered on the monitor i want, because for whatever reason the joystick i built doesn't move monitor to monitor. 

First we need to emit to the socket, so since i have 3 monitors i have 3 emits, you can add or remove depending on your setup.
```
  const monitor1Select = () => {
    socket.emit('monitor1');
  };
  const monitor2Select = () => {
    socket.emit('monitor2');
  };
  const monitor3Select = () => {
    socket.emit('monitor3');
  };
```
display the buttons
```
<View style={{ flexDirection: 'row' }}>
  <TouchableOpacity style={styles.button} onPress={monitor2Select}>
    <Text style={styles.buttonText}>monitor 2</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={monitor1Select}>
    <Text style={styles.buttonText}>monitor 1</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={monitor3Select}>
    <Text style={styles.buttonText}>monitor 3</Text>
  </TouchableOpacity>
</View>
```



in index.js i set the coordinates i want the mouse to be positioned at when i hit the monitor buttons.
to find the x,y coords i have a log on my left click which shows me my current mouse position, and i just set my coords accordingly.
```
  socket.on('click', (button) => {
    if (button === 'left') {
      mouse.leftClick();
      console.log(mousePosition); // shows x,y coords on left click
      console.log(current); // fallback
    } else if (button === 'right') {
      mouse.rightClick();
    }
  });
```

```
 // adjust x and y coords depending on your setup
socket.on('monitor1', async () => {
    await mouse.setPosition({ x: 932, y: 604 });
  });
  socket.on('monitor2', async () => {
    await mouse.setPosition({ x: -941, y: 591 });
  });
  socket.on('monitor3', async () => {
    await mouse.setPosition({ x: 2600, y: -100 });
  });
```

to adjust scroll speed, in index.js adjust the value in scrollUp, or scrollDown, this is steps and varies on screen size and os etc...
```
      const scrollFunction = () => {
        if (key === 'up') {
          mouse.scrollUp(75); // adjust this value
        } else if (key === 'down') {
          mouse.scrollDown(75); // adjust this value
        }
      };
```
