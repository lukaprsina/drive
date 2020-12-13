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

  const artboardRef = useRef();

  const [coordInfo, setCoordInfo] = useState({});

  function changeCoordInfo() {
    const newCoord = getCoordinateInfo(artboardRef.current);
    setCoordInfo(newCoord);
  }

  useEffect(() => {
    changeCoordInfo();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", changeCoordInfo);

    return () => {
      window.removeEventListener("resize", changeCoordInfo);
    };
  });

  const points = calculatePoints(coordInfo.roadLength, coordInfo.roadWidth);

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

function getCoordinateInfo(element) {
  if (!element) {
    return null;
  }
  const clientRect = element.getBoundingClientRect();
  const x = (clientRect.right - clientRect.left) / 2;
  const y = (clientRect.bottom - clientRect.top) / 2;
  const roadLength = x / 2;
  const roadWidth = 40;

  return { x, y, roadLength, roadWidth };
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

function calculatePoints(roadLength, roadWidth) {
  if (!roadLength && !roadWidth) {
    return null;
  }

  const roads = [
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

  const maxRoadWidth = Math.max.apply(
    Math,
    roads.map((road) => {
      return road.numberOfForward + road.numberOfBackward;
    })
  );

  for (const road of roads) {
    const maxDistance =
      ((road.numberOfForward + road.numberOfBackward - 1) * roadWidth) / 2;

    for (let i = 0; i < road.numberOfForward + road.numberOfBackward; i++) {
      let firstPoint = sumVector(
        lenDeg(maxRoadWidth * roadWidth, road.angle),
        lenDeg(maxDistance - i * roadWidth, road.angle - 90)
      );

      let lastPoint = lenDeg(roadLength, road.angle);

      if (i >= road.numberOfBackward) {
        road.forward.push({ first: firstPoint, last: lastPoint });
      } else {
        road.backward.push({ first: firstPoint, last: lastPoint });
      }
    }
  }
  return roads;
}
