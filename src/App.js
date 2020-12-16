import React from "react";
import "./App.css";
/* import { Typography } from "@material-ui/core";
import { useSpring, animated, config } from "react-spring";
import { useGesture } from "react-use-gesture"; */
import Artboard from "./Artboard.js";


export default function App() {
  const roadInfo = [
    {
      numberOfForward: 1,
      numberOfBackward: 1,
      angle: 10,
    },
    {
      numberOfForward: 1,
      numberOfBackward: 1,
      angle: 110,
    },
    {
      numberOfForward: 2,
      numberOfBackward: 2,
      angle: 180,
    },
    {
      numberOfForward: 1,
      numberOfBackward: 1,
      angle: 300,
    },
  ];
  return (
    <>
      <Artboard roadInfo={roadInfo}/>
      {/* <Solution />
      <Inventory /> */}
    </>
  );
}
/* function Solution() {
  return (
    <Typography variant="body1">
      Solution
      <br />
    </Typography>
  );
}

function Inventory() {
  return (
    <>
      <Item />
      <Item />
    </>
  );
}

function Item() {
  const [{ x, y }, setSpring] = useSpring(() => ({
    x: 0,
    y: 0,
    config: config.stiff,
  }));

  const [isClicking, setIsClicking] = useState(false);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my] }) => {
      setSpring({ x: down ? mx : 0, y: down ? my : 0 });
      setIsClicking(!mx && !my);
    },
    onDragEnd: ({ event }) => {
      if (isClicking) {
        console.log("Click");
      } else {
        console.log("Move", event.x, event.y);
      }
    },
  });

  return <animated.div className="drag" {...bind()} style={{ x, y }} />;
}
 */
