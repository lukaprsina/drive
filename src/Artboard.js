import React, { useState, useEffect, useRef } from "react";

function lenDeg(d, angle) {
  const deg = (angle * Math.PI) / 180;
  const x = d * Math.cos(deg);
  const y = d * Math.sin(deg);
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
}

function sumVector(a, b) {
  const x = a.x + b.x;
  const y = a.y + b.y;
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
}

export default function Artboard() {
  let roads = {
    debug: {
      elements: { forward: [], backward: [] },
      strings: { forward: [], backward: [] },
    },
    asphalt: {
      elements: { forward: [], backward: [] },
      strings: { forward: [], backward: [] },
    },
  };

  const roadInfo = [
    {
      numberOfForward: 3,
      numberOfBackward: 2,
      angle: 0,
      forward: [],
      backward: [],
    },
    {
      numberOfForward: 1,
      numberOfBackward: 4,
      angle: 110,
      forward: [],
      backward: [],
    },
    {
      numberOfForward: 8,
      numberOfBackward: 2,
      angle: 180,
      forward: [],
      backward: [],
    },
    {
      numberOfForward: 1,
      numberOfBackward: 1,
      angle: 270,
      forward: [],
      backward: [],
    },
  ];

  /* svg ref */
  const artboardRef = useRef();

  /* rerender on every window change */
  const [coordInfo, setCoordInfo] = useState({});

  function changeCoordInfo() {
    /* get coordinates of the svg element */
    const newCoord = getCoordinateInfo(artboardRef, roadInfo);
    /* sets state */
    setCoordInfo(newCoord);
  }
  /* call getCoordinateInfo on the first render */
  useEffect(() => {
    changeCoordInfo();
  }, []);

  useEffect(() => {
    /* call getCoordinateInfo on every window change */
    window.addEventListener("resize", changeCoordInfo);

    return () => {
      window.removeEventListener("resize", changeCoordInfo);
    };
  });

  /* get a list of all the road points */
  const points = calculatePoints(roadInfo, coordInfo);

  /* create elements based on road points */
  buildRoad(points, roads, coordInfo);

  return (
    <svg id="artboard" ref={artboardRef}>
      {roads.asphalt.elements.forward}
      {roads.asphalt.elements.backward}
      {roads.debug.elements.forward}
      {roads.debug.elements.backward}
      {roads.center}
    </svg>
  );
}

function getCoordinateInfo(element, roadInfo) {
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
  const roadWidth = windowBox / (maxRoadWidth * 3);

  return { x, y, roadLength, roadWidth, maxRoadWidth };
}

function calculatePoints(roadInfo, coordInfo) {
  /* coordinfo { x, y, roadLength, roadWidth, maxRoadWidth }; */
  if (!coordInfo.roadLength && !coordInfo.roadWidth) {
    return null;
  }

  for (const road of roadInfo) {
    /* maxDistance = pixli od sredine do skrajnega cestišča */
    const maxDistance =
      ((road.numberOfForward + road.numberOfBackward - 1) *
        coordInfo.roadWidth) /
      2;

    for (let i = 0; i < road.numberOfForward + road.numberOfBackward; i++) {
      let firstPoint = sumVector(
        /* sum vector pointing east to get left or right */
        lenDeg(maxDistance - i * coordInfo.roadWidth, road.angle - 90),
        /* and the vector, responsible for making the center */
        lenDeg(coordInfo.maxRoadWidth * coordInfo.roadWidth, road.angle)
      );

      let lastPoint = sumVector(
        firstPoint,
        lenDeg(coordInfo.roadLength, road.angle)
      );

      if (i >= road.numberOfBackward) {
        road.forward.push({ first: firstPoint, last: lastPoint });
      } else {
        road.backward.push({ first: firstPoint, last: lastPoint });
      }
    }
  }
  return roadInfo;
}

function buildLanes(road, roads, side, layer, coordInfo) {
  switch (layer) {
    case "asphalt":
      for (const lane of road[side]) {
        let lanes = "";

        const offset = sumVector(coordInfo, lane.first);

        const firstPoint = sumVector(
          lenDeg(coordInfo.roadWidth / 2, road.angle - 90),
          offset
        );

        const lastPoint = sumVector(
          sumVector(coordInfo, lane.last),
          lenDeg(coordInfo.roadWidth / 2, road.angle - 90)
        );

        const across = sumVector(
          lenDeg(coordInfo.roadWidth, road.angle + 90),
          lastPoint
        );

        const back = sumVector(
          lenDeg(coordInfo.roadWidth / 2, road.angle + 90),
          offset
        );

        lanes += "M " + offset.x + " " + offset.y + " ";
        lanes += "L " + firstPoint.x + " " + firstPoint.y + " ";
        lanes += "L " + lastPoint.x + " " + lastPoint.y + " ";
        lanes += "L " + across.x + " " + across.y + " ";
        lanes += "L " + back.x + " " + back.y + " ";
        lanes += "Z";

        roads[layer].strings[side].push(lanes);
      }

      roads[layer].elements[side] = roads[layer].strings[
        side
      ].map((lane, index) => (
        <path d={lane} key={index} className={side + "-" + layer} />
      ));
      break;

    case "debug":
      for (const lane of road[side]) {
        let coords = {
          x1: coordInfo.x + lane.first.x,
          y1: coordInfo.y + lane.first.y,
          x2: coordInfo.x + lane.last.x,
          y2: coordInfo.y + lane.last.y,
        };
        roads[layer].strings[side].push(coords);
      }

      roads[layer].elements[side] = roads[layer].strings[
        side
      ].map((coords, index) => (
        <line
          x1={coords.x1}
          y1={coords.y1}
          x2={coords.x2}
          y2={coords.y2}
          key={index}
          className={side + "-" + layer}
        />
      ));
      break;

    default:
      console.error("Wrong road layer");
  }
}

function buildRoad(points, roads, coordInfo) {
  if (!points) {
    return null;
  }

  let centerPoints = "";

  for (const [index, road] of points.entries()) {
    buildLanes(road, roads, "forward", "debug", coordInfo);
    buildLanes(road, roads, "backward", "debug", coordInfo);
    buildLanes(road, roads, "forward", "asphalt", coordInfo);
    buildLanes(road, roads, "backward", "asphalt", coordInfo);

    if (index === 0) {
      //coordInfo.roadWidth
      centerPoints +=
      "M " +
      (road.backward[0].first.x + coordInfo.x) +
      " " +
      (road.backward[0].first.y + coordInfo.y) +
      " ";
    }

    centerPoints +=
      "L " +
      (road.backward[0].first.x + coordInfo.x) +
      " " +
      (road.backward[0].first.y + coordInfo.y) +
      " ";

    const lastPoint = road.forward.length - 1;

    centerPoints +=
      "L " +
      (road.forward[lastPoint].first.x + coordInfo.x) +
      " " +
      (road.forward[lastPoint].first.y + coordInfo.y) +
      " ";
  }
  centerPoints += "Z";

  roads.center = <path d={centerPoints} className="forward-asphalt" />;
}
