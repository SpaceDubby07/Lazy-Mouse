const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const robot = require('robotjs');
const { mouse } = require('@nut-tree-fork/nut-js');
let mousePosition = robot.getMousePos();
let current = mouse.getPosition();
let scrollInterval = null;
const totalScreenWidth = 1920 + 1920; // Two horizontal monitors
const totalScreenHeight = 1080; // Height of the vertically oriented monitor

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('mousemove', ({ dx, dy }) => {
    const screenSize = robot.getScreenSize();
    robot.setMouseDelay(0);
    mousePosition.x = Math.min(
      Math.max(mousePosition.x + dx, -1920),
      totalScreenWidth - 1
    );
    mousePosition.y = Math.min(
      Math.max(mousePosition.y + dy, 0),
      totalScreenHeight - 1
    );
    robot.moveMouse(mousePosition.x, mousePosition.y);
  });

  socket.on('click', (button) => {
    if (button === 'left') {
      mouse.leftClick();
      console.log(mousePosition);
      console.log(current);
    } else if (button === 'right') {
      mouse.rightClick();
    }
  });

  socket.on('monitor1', async () => {
    await mouse.setPosition({ x: 932, y: 604 });
  });
  socket.on('monitor2', async () => {
    await mouse.setPosition({ x: -941, y: 591 });
  });
  socket.on('monitor3', async () => {
    await mouse.setPosition({ x: 2600, y: -100 });
  });

  socket.on('scroll', ({ key, hold }) => {
    if (hold) {
      if (scrollInterval) clearInterval(scrollInterval);

      const scrollFunction = () => {
        if (key === 'up') {
          mouse.scrollUp(75);
        } else if (key === 'down') {
          mouse.scrollDown(75);
        }
      };

      scrollFunction();
      scrollInterval = setInterval(scrollFunction, 100); // Adjust the interval as needed
    } else {
      if (scrollInterval) clearInterval(scrollInterval);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});
