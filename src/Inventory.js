import React from "react";
import { IconButton } from "@material-ui/core";
import { useDrag } from 'react-dnd'

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
  const [collectedProps, drag] = useDrag({
    item: { id, type }
  })

  return (
    <IconButton className="drag" ref={drag}>
      <img src={props.src} className="sign" alt={props.src} draggable={false} />
    </IconButton>
  );
}
