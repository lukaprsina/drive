import React from "react";
import { useSpring, animated } from "react-spring";
import { useGesture } from "react-use-gesture";
import { IconButton } from "@material-ui/core";

import forward from "./img/forward.svg";
import give_way from "./img/give way.svg";
import left from "./img/left.svg";
import right from "./img/right.svg";
import stop from "./img/stop.svg";
import priority from "./img/priority.svg";

export function Inventory() {
  const images = [forward, give_way, left, right, stop, priority];
  const Items = images.map((image, index) => <Item src={image} key={index} />);
  return <div className="inventory">{Items}</div>;
}

function Item(props) {
  const [{ x, y }, setSpring] = useSpring(() => ({
    x: 0,
    y: 0,
  }));

  const bind = useGesture(
    {
      onDrag: ({ down, movement: [mx, my] }) => {
        setSpring({ x: down ? mx : 0, y: down ? my : 0 });
      },

      onDragEnd: ({ tap }) => {
        console.log(tap);
      },
    },
    { filterTaps: true }
  );

  const AnimatedIcon = animated(IconButton);

  return (
    <AnimatedIcon className="drag" {...bind()} style={{ x, y }}>
      <img src={props.src} className="sign" alt={props.src} draggable={false} />
    </AnimatedIcon>
  );
}
