import React, { useState, useRef } from 'react';
import {
  View,
  PanResponder,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.0.103:3000');

const App = () => {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const joystickRadius = 75;
  const cursorRadius = 25;
  const maxOffset = joystickRadius - cursorRadius;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        let { dx, dy } = gestureState;

        // Constrain the cursor within the joystick container
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxOffset) {
          const angle = Math.atan2(dy, dx);
          dx = maxOffset * Math.cos(angle);
          dy = maxOffset * Math.sin(angle);
        }

        setJoystickPosition({ x: dx, y: dy });
        socket.emit('mousemove', { dx, dy });
      },
      onPanResponderRelease: () => {
        setJoystickPosition({ x: 0, y: 0 });
        setIsDragging(false);
      },
    })
  ).current;

  const handleLeftClick = () => {
    socket.emit('click', 'left');
  };

  const handleRightClick = () => {
    socket.emit('click', 'right');
  };

  const handleScrollUp = () => {
    socket.emit('scroll', { key: 'up', hold: true });
  };

  const handleScrollDown = () => {
    socket.emit('scroll', { key: 'down', hold: true });
  };

  const handleScrollRelease = () => {
    socket.emit('scroll', { key: '', hold: false });
  };

  const monitor1Select = () => {
    socket.emit('monitor1');
  };
  const monitor2Select = () => {
    socket.emit('monitor2');
  };
  const monitor3Select = () => {
    socket.emit('monitor3');
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.mouseButton} onPress={handleLeftClick}>
          <Text style={styles.buttonText}>Left Click</Text>
        </TouchableOpacity>
        <View style={styles.joystickContainer} {...panResponder.panHandlers}>
          <View
            style={[
              styles.cursor,
              {
                transform: [
                  { translateX: joystickPosition.x },
                  { translateY: joystickPosition.y },
                ],
              },
            ]}
          />
        </View>
        <TouchableOpacity style={styles.mouseButton} onPress={handleRightClick}>
          <Text style={styles.buttonText}>Right Click</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.scrollButton}
          onPressIn={handleScrollUp}
          onPressOut={handleScrollRelease}
        >
          <Text style={styles.buttonText}>Scroll Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.scrollButton}
          onPressIn={handleScrollDown}
          onPressOut={handleScrollRelease}
        >
          <Text style={styles.buttonText}>Scroll Down</Text>
        </TouchableOpacity>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursor: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 25,
    position: 'absolute',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  mouseButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
  scrollButton: {
    backgroundColor: '#ddd',
    padding: 40,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default App;
