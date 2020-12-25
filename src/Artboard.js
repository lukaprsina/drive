import React, { useState, useEffect, useRef } from "react";
import { useGesture } from "react-use-gesture";
import { buildRoad } from "./buildRoad";

export default function Artboard(props) {
  /* svg ref */
  const artboardRef = useRef();

  const [coordInfo, setCoordInfo] = useState({});

  const [roadInfo, setRoadInfo] = useState([
    {
      numberOfBackward: 1,
      numberOfForward: 2,
      angle: 0,
    },
    {
      numberOfBackward: 1,
      numberOfForward: 1,
      angle: 110,
    },
    {
      numberOfBackward: 2,
      numberOfForward: 3,
      angle: 170,
    },
    {
      numberOfBackward: 1,
      numberOfForward: 1,
      angle: 300,
    },
  ]);

  const rotate = useGesture({
    onMove: ({ event, args: [index], last }) => {
      console.log(last)
      if (event.x && event.y) {
        const newPoint = sumVector(event, multVector(coordInfo, -1));
        const newAngle = Math.atan2(newPoint.y, newPoint.x);
        const deg = newAngle * (180 / Math.PI);

        // shallow copy
        const newRoadInfo = roadInfo.map((a) => ({ ...a }));
        newRoadInfo[index].angle = deg;

        setRoadInfo(newRoadInfo);
      }
    },
  });

  useEffect(() => {
    function changeCoordInfo() {
      /* get coordinates of the svg element */
      const newCoord = getCoordinateInfo(artboardRef, roadInfo);
      /* sets state */
      setCoordInfo(newCoord);
    }

    changeCoordInfo();
    /* call getCoordinateInfo on every window change */
    window.addEventListener("resize", changeCoordInfo);

    return () => {
      window.removeEventListener("resize", changeCoordInfo);
    };
  }, [artboardRef, roadInfo]);

  /* get a list of all the road points */
  const points = calculatePoints(roadInfo, coordInfo);

  /* create elements based on road points */
  const roads = buildRoad(points, coordInfo, rotate);

  return (
    <svg id="artboard" ref={artboardRef}>
      {roads ? roads.asphalt.elements.forward : null}
      {roads ? roads.asphalt.elements.backward : null}
      {/* {roads ? roads.debug.elements.forward : null}
      {roads ? roads.debug.elements.backward : null} */}
      {roads ? roads.center.element : null}
      {roads ? roads.curb.element : null}
      {roads ? roads.line.elements.continous : null}
      {roads ? roads.line.elements.striped : null}
      {roads ? roads.rotate.elements : null}
      {roads ? roads.coordInfo : null}
      {!roads ? <text>Loading</text> : null}
    </svg>
  );
}

function calculatePoints(roadInfo, coordInfo) {
  const points = [];

  if (!(coordInfo && coordInfo.roadLength && coordInfo.roadWidth)) {
    return null;
  }

  for (let i = 0; i < roadInfo.length; i++) {
    const road = roadInfo[i];

    /* maxDistance = pixels from the center to the edge */
    const maxDistance =
      ((road.numberOfForward + road.numberOfBackward - 1) *
        coordInfo.roadWidth) /
      2;
    points[i] = {
      forward: [],
      backward: [],
      maxDistance,
      angle: road.angle,
      numberOfForward: road.numberOfForward,
      numberOfBackward: road.numberOfBackward,
    };

    const allLanes = road.numberOfForward + road.numberOfBackward;

    for (let j = 0; j < allLanes; j++) {
      let firstPoint = sumVector(
        /* sum vector pointing east to get left or right */
        lenDeg(maxDistance - j * coordInfo.roadWidth, road.angle - 90),
        /* and the vector, responsible for making the center area */
        lenDeg(coordInfo.maxRoadWidth * coordInfo.roadWidth * 0.8, road.angle)
      );

      let lastPoint = sumVector(
        firstPoint,
        lenDeg(coordInfo.roadLength, road.angle)
      );

      if (j >= road.numberOfForward) {
        points[i].forward.push({ first: firstPoint, last: lastPoint });
      } else {
        points[i].backward.push({ first: firstPoint, last: lastPoint });
      }
    }
  }
  return points;
}

export function lenDeg(d, angle) {
  const deg = (angle * Math.PI) / 180;
  const x = d * Math.cos(deg);
  const y = d * Math.sin(deg);
  return { x, y };
}

export function sumVector(a, b) {
  const x = a.x + b.x;
  const y = a.y + b.y;
  return { x, y };
}

function multVector(a, k) {
  const x = a.x * k;
  const y = a.y * k;
  return { x, y };
}

export function getCoordinateInfo(element, roadInfo) {
  if (!element.current) {
    return null;
  }

  const clientRect = element.current.getBoundingClientRect();
  const x = (clientRect.right - clientRect.left) / 2;
  const y = (clientRect.bottom - clientRect.top) / 2;

  const maxRoadWidth = Math.max.apply(
    Math,
    roadInfo.map((road) => {
      return road.numberOfForward + road.numberOfBackward;
    })
  );
  const windowBox = Math.min(x, y);
  const roadLength = windowBox / 2;
  const roadWidth = (windowBox / maxRoadWidth) * 0.4;

  return { x, y, roadLength, roadWidth, maxRoadWidth };
}
