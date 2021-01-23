import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-use-gesture";
import {
  makeAsphalt,
  Debug,
  Line,
  RotateControl,
  LaneControl,
  Center,
  Curb,
  LaneConnect,
} from "./buildRoad";
import Cars from "./Cars";

const _ = require("lodash");

export default function Artboard() {
  /* svg ref */
  const artboardRef = useRef();

  const [coordInfo, setCoordInfo] = useState({});

  const [roadInfo, setRoadInfo] = useState([
    {
      numberOfBackward: 1,
      numberOfForward: 2,
      angle: 0,
      order: 0,
    },
    {
      numberOfBackward: 1,
      numberOfForward: 1,
      angle: 110,
      order: 1,
    },
    {
      numberOfBackward: 2,
      numberOfForward: 3,
      angle: 170,
      order: 2,
    },
    {
      numberOfBackward: 1,
      numberOfForward: 1,
      angle: 300,
      order: 3,
    },
  ]);

  const vectors = {
    offsetBottom: (lane, coordInfo) => sumVector(coordInfo, lane.first),

    offsetTop: (lane, coordInfo) => sumVector(coordInfo, lane.last),

    halfRoadLeft: (road, coordInfo) =>
      lenDeg(coordInfo.roadWidth / 2, road.angle - 90),

    halfRoadRight: (road, coordInfo) =>
      lenDeg(coordInfo.roadWidth / 2, road.angle + 90),

    laneBottomLeft: (lane, road, coordInfo) =>
      sumVector(
        vectors.halfRoadLeft(road, coordInfo),
        vectors.offsetBottom(lane, coordInfo)
      ),

    laneTopLeft: (lane, road, coordInfo) =>
      sumVector(
        vectors.halfRoadLeft(road, coordInfo),
        vectors.offsetTop(lane, coordInfo)
      ),

    laneBottomRight: (lane, road, coordInfo) =>
      sumVector(
        vectors.halfRoadRight(road, coordInfo),
        vectors.offsetBottom(lane, coordInfo)
      ),

    laneTopRight: (lane, road, coordInfo) =>
      sumVector(
        vectors.halfRoadRight(road, coordInfo),
        vectors.offsetTop(lane, coordInfo)
      ),

    roadBottomLeft: (road, coordInfo) =>
      sumVector(
        sumVector(road.forward[0].first, coordInfo),
        vectors.halfRoadLeft(road, coordInfo)
      ),

    roadBottomRight: (road, coordInfo) =>
      sumVector(
        sumVector(road.backward[road.backward.length - 1].first, coordInfo),
        vectors.halfRoadRight(road, coordInfo)
      ),
    roadTopLeft: (road, coordInfo) =>
      sumVector(
        sumVector(road.forward[0].last, coordInfo),
        vectors.halfRoadLeft(road, coordInfo)
      ),

    roadTopRight: (road, coordInfo) =>
      sumVector(
        sumVector(road.backward[road.backward.length - 1].last, coordInfo),
        vectors.halfRoadRight(road, coordInfo)
      ),

    roadTopMiddle: (road, coordInfo) =>
      sumVector(
        lenDeg(coordInfo.roadLength, road.angle),
        sumVector(
          lenDeg(
            ((road.numberOfForward + road.numberOfBackward) *
              coordInfo.roadWidth) /
              2,
            road.angle + 90
          ),
          vectors.roadBottomLeft(road, coordInfo)
        )
      ),
  };

  const rotateBind = useDrag(({ event, args: [order] }) => {
    if (event.x && event.y) {
      const newPoint = sumVector(event, multVector(coordInfo, -1));
      const newAngle = Math.atan2(newPoint.y, newPoint.x);

      let deg = newAngle * (180 / Math.PI);
      deg %= 360;
      if (deg < 0) {
        deg += 360;
      }

      const newRoadInfo = _.cloneDeep(roadInfo);
      newRoadInfo.sort((a, b) => a.angle - b.angle);

      for (let i = 0; i < newRoadInfo.length; i++) {
        if (order === newRoadInfo[i].order) {
          newRoadInfo[i].angle = deg;
        }
      }

      setRoadInfo(newRoadInfo);
    }
  });

  function addLanes(index, side, add) {
    const newRoadInfo = _.cloneDeep(roadInfo);

    const numberOfLanes = newRoadInfo[index]["numberOf" + side];

    if (numberOfLanes > 1 || add > 0) {
      newRoadInfo[index]["numberOf" + side] += add;
    }

    setRoadInfo(newRoadInfo);
  }

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

  const [objectInfo, setObjectInfo] = useState([
    { cars: [], signs: [] },
    { cars: [], signs: [] },
    { cars: [], signs: [] },
    { cars: [], signs: [] },
  ]);

  class Car {
    getOffset() {
      return {x:0, y:0}
    }
  }

  function handleCarDrop(item, indexRoad, indexLane) {
    const newObjectInfo = _.cloneDeep(objectInfo);

    if (!newObjectInfo[indexRoad].cars[indexLane]) {
      newObjectInfo[indexRoad].cars[indexLane] = [];
    }

    newObjectInfo[indexRoad].cars[indexLane].push(new Car());
    setObjectInfo(newObjectInfo);
  }

  function handleSignDrop(item, indexRoad) {
    const newObjectInfo = _.cloneDeep(objectInfo);

    if (!newObjectInfo[indexRoad].signs) {
      newObjectInfo[indexRoad].signs = [];
    }

    newObjectInfo[indexRoad].signs.push(item);
    setObjectInfo(newObjectInfo);
  }

  const asphalt = makeAsphalt({
    points,
    coordInfo,
    handleSignDrop,
    handleCarDrop,
    vectors,
  });

  return (
    // touch-action ensures that chrome doesnt stop the drag after a few frames,
    // but it doesn't work on svg elements, so I wraped it in a div,
    // https://stackoverflow.com/questions/45678190/dynamically-disabling-touch-action-overscroll-for-svg-elements

    <div style={{ touchAction: "none" }}>
      <svg className="artboard" ref={artboardRef}>
        <g>
          {asphalt?.backward}
          {asphalt?.forward}
        </g>
        <Center points={points} coordInfo={coordInfo} vectors={vectors} />
        <Curb points={points} coordInfo={coordInfo} vectors={vectors} />
        <Line points={points} coordInfo={coordInfo} vectors={vectors} />
        <LaneConnect
          points={points}
          coordInfo={coordInfo}
          vectors={vectors}
          disabled
        />
        <Debug
          points={points}
          coordInfo={coordInfo}
          disabled
          vectors={vectors}
        />
        <RotateControl
          points={points}
          coordInfo={coordInfo}
          rotateBind={rotateBind}
          vectors={vectors}
        />
        <LaneControl
          points={points}
          coordInfo={coordInfo}
          addLanes={addLanes}
          vectors={vectors}
        />
        <Cars
          objectInfo={objectInfo}
          coordInfo={coordInfo}
          points={points}
        />
      </svg>
    </div>
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
      order: road.order,
      numberOfForward: road.numberOfForward,
      numberOfBackward: road.numberOfBackward,
    };

    const allLanes = road.numberOfForward + road.numberOfBackward;
    const test =
      ((road.numberOfForward + road.numberOfBackward) * coordInfo.roadWidth) /
      5;

    for (let j = 0; j < allLanes; j++) {
      let firstPoint = sumVector(
        /* sum vector pointing east to get left or right */
        lenDeg(maxDistance - j * coordInfo.roadWidth, road.angle - 90),
        /* and the vector, responsible for making the center area */
        sumVector(
          lenDeg(coordInfo.maxRoadWidth * coordInfo.roadWidth, road.angle),
          lenDeg(test, road.angle - 180)
        )
      );

      let lastPoint = sumVector(
        firstPoint,
        lenDeg(coordInfo.roadLength, road.angle)
      );

      if (j < road.numberOfForward) {
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

export function multVector(a, k) {
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
  const roadWidth = (windowBox / maxRoadWidth) * 0.5;

  return { x, y, roadLength, roadWidth, maxRoadWidth };
}

export function pointsToString(pointsArray) {
  if (!(pointsArray && pointsArray.length)) {
    return null;
  }

  let pathD = "";

  for (const order of pointsArray) {
    pathD += order.letter + " ";

    if (order.coords) {
      for (const coords of order.coords) {
        pathD += coords.x + " " + coords.y + " ";
      }
    }
  }
  return pathD;
}
