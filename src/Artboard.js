import React, { useState, useEffect, useRef } from "react";

function lenDeg(d, angle) {
  const deg = (angle * Math.PI) / 180;
  const x = d * Math.cos(deg);
  const y = d * Math.sin(deg);
  return { x, y };
}

function sumVector(a, b) {
  const x = a.x + b.x;
  const y = a.y + b.y;
  return { x, y };
}

function multiplyVector(a, b) {
  const x = a.x * b;
  const y = a.y * b;
  return { x, y };
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
  const windowBox = Math.min(x, y)
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

      let lastPoint = lenDeg(coordInfo.roadLength, road.angle);

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
        const vectors = [
          lenDeg(coordInfo.roadWidth / 2, road.angle - 90),
          lenDeg(coordInfo.roadWidth, road.angle + 90),
          multiplyVector(lane.last, -1),
        ];

        lanes += "M " + coordInfo.x + " " + coordInfo.y + " ";
        lanes += "m " + lane.first.x + " " + lane.first.y + " ";
        lanes += "l " + vectors[0].x + " " + vectors[0].y + " ";
        lanes += "l " + lane.last.x + " " + lane.last.y + " ";
        lanes += "l " + vectors[1].x + " " + vectors[1].y + " ";
        lanes += "l " + vectors[2].x + " " + vectors[2].y + " ";
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
          x2: coordInfo.x + lane.first.x + lane.last.x,
          y2: coordInfo.y + lane.first.y + lane.last.y,
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

    case "center":
      break;

    default:
      console.error("Wrong road layer");
  }
}

function buildRoad(points, roads, coordInfo) {
  if (!points) {
    return null;
  }

  for (const road of points) {
    buildLanes(road, roads, "forward", "debug", coordInfo);
    buildLanes(road, roads, "backward", "debug", coordInfo);
    buildLanes(road, roads, "forward", "asphalt", coordInfo);
    buildLanes(road, roads, "backward", "asphalt", coordInfo);
    buildLanes(road, roads, "center", "center", coordInfo);
  }
}
