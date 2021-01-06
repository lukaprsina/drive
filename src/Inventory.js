import React from "react";
import { IconButton } from "@material-ui/core";
import { useDrag } from "react-dnd";

import forward from "./img/forward.svg";
import give_way from "./img/give way.svg";
import left from "./img/left.svg";
import right from "./img/right.svg";
import stop from "./img/stop.svg";
import priority from "./img/priority.svg";

export function Inventory() {
  const images = [forward, give_way, left, right, stop, priority];
  const Signs = images.map((image, index) => (
    <Sign src={image} key={index} index={index} />
  ));

  return <div className="inventory">{Signs}<Car /></div>;
}

function Car() {
  const [, drag] = useDrag({
    item: { id: "car", type: "car" },
  });

  return (
    <div className="drag" ref={drag}>
      <div className="item car-item" draggable={false} ></div>
    </div>
  );
}

function Sign({src, index}) {
  const [, drag] = useDrag({
    item: { id: index, type: "sign" },
    /* end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      console.log(item, dropResult, "from item")
    } */
  });

  return (
    <IconButton className="drag" ref={drag}>
      <img src={src} className="item sign" alt={src} draggable={false} />
    </IconButton>
  );
}
