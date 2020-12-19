import { Typography } from "@material-ui/core";
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

export default function Artboard(props) {
  /* svg ref */
  const artboardRef = useRef();

  const roadInfo = props.roadInfo;

  const [coordInfo, setCoordInfo] = useState({});

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
  const roads = buildRoad(points, coordInfo);

  return (
    <svg id="artboard" ref={artboardRef}>
      {roads ? roads.asphalt.elements.forward : null}
      {roads ? roads.asphalt.elements.backward : null}
      {roads ? roads.debug.elements.forward : null}
      {roads ? roads.debug.elements.backward : null}
      {roads ? roads.center.element : null}
      {roads ? roads.curb.element : null}
      {!roads ? <Typography>Loading</Typography> : null}
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
  const roadWidth = (windowBox / maxRoadWidth) * 0.5;

  return { x, y, roadLength, roadWidth, maxRoadWidth };
}

function calculatePoints(roadInfo, coordInfo) {
  const points = [];
  /* coordinfo { x, y, roadLength, roadWidth, maxRoadWidth }; */
  if (!(coordInfo && coordInfo.roadLength && coordInfo.roadWidth)) {
    return null;
  }

  for (let i = 0; i < roadInfo.length; i++) {
    const road = roadInfo[i];

    points[i] = { forward: [], backward: [], angle: road.angle };

    /* maxDistance = pixels from the center to the edge */
    const maxDistance =
      ((road.numberOfForward + road.numberOfBackward - 1) *
        coordInfo.roadWidth) /
      2;

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

      if (j >= road.numberOfBackward) {
        points[i].forward.push({ first: firstPoint, last: lastPoint });
      } else {
        points[i].backward.push({ first: firstPoint, last: lastPoint });
      }
    }
  }
  return points;
}

function buildRoad(points, coordInfo) {
  const roads = {
    debug: {
      elements: { forward: [], backward: [] },
      strings: { forward: [], backward: [] },
    },
    asphalt: {
      elements: { forward: [], backward: [] },
      strings: { forward: [], backward: [] },
    },
    center: { string: "" },
    curb: { string: "M 0 0 " },
  };

  if (!(points && coordInfo)) {
    return null;
  }

  for (const [index, road] of points.entries()) {
    buildLanes(road, roads, "forward", "debug", coordInfo);
    buildLanes(road, roads, "backward", "debug", coordInfo);
    buildLanes(road, roads, "forward", "asphalt", coordInfo);
    buildLanes(road, roads, "backward", "asphalt", coordInfo);
    buildSpecial(road, roads, "center", index, coordInfo);
    buildSpecial(road, roads, "curb", index, coordInfo);
  }
  roads.center.element = (
    <path d={roads.center.string} className="forward-asphalt" />
  );
  roads.curb.element = (
    <path d={roads.curb.string} className="forward-debug" />
  );
  return roads;
}

function buildSpecial(road, roads, side, index, coordInfo) {
  switch (side) {
    case "center":
      let centerPoints = "";

      let leftPoint = sumVector(
        sumVector(road.backward[0].first, coordInfo),
        lenDeg(coordInfo.roadWidth / 2, road.angle - 90)
      );
      let rightPoint = sumVector(
        sumVector(road.forward[road.forward.length - 1].first, coordInfo),
        lenDeg(coordInfo.roadWidth / 2, road.angle + 90)
      );

      if (index === 0) {
        centerPoints += "M " + leftPoint.x + " " + leftPoint.y + " ";
      }
      centerPoints += "L " + leftPoint.x + " " + leftPoint.y + " ";
      centerPoints += "L " + rightPoint.x + " " + rightPoint.y + " ";

      roads.center.string += centerPoints;
      break;

    case "curb":
      let curbPoints = "";

      let firstPoint = sumVector(
        sumVector(road.backward[0].first, coordInfo),
        lenDeg(coordInfo.roadWidth / 2, road.angle - 90)
      );
      let lastPoint = sumVector(
        sumVector(road.forward[road.forward.length - 1].first, coordInfo),
        lenDeg(coordInfo.roadWidth / 2, road.angle + 90)
      );

      if (index === 0) {
        curbPoints += "M " + firstPoint.x + " " + firstPoint.y + " ";
      }
      curbPoints += "L " + firstPoint.x + " " + firstPoint.y + " ";
      curbPoints += "L " + lastPoint.x + " " + lastPoint.y + " ";

      roads.curb.string += curbPoints;
      break

    default:
      console.error("Wrong road layer");
      break;
  }
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

        roads.asphalt.strings[side].push(lanes);
      }

      roads.asphalt.elements[side] = roads.asphalt.strings[
        side
      ].map((lane, index) => (
        <path d={lane} key={index} className={side + "-" + layer} />
      ));
      break;

    case "debug":
      for (const lane of road[side]) {
        const coords = {
          x1: coordInfo.x + lane.first.x,
          y1: coordInfo.y + lane.first.y,
          x2: coordInfo.x + lane.last.x,
          y2: coordInfo.y + lane.last.y,
        };
        roads.debug.strings[side].push(coords);
      }

      roads.debug.elements[side] = roads.debug.strings[
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