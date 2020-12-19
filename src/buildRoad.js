import React from "react";
import { sumVector, lenDeg } from "./Artboard";

export function buildRoad(points, coordInfo) {
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
    curb: { string: "" },
  };

  if (!(points && coordInfo)) {
    return null;
  }

  for (const [index, road] of points.entries()) {
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
  }

  for (const [index, road] of points.entries()) {
    let curbPoints = "";

    let testPoint = sumVector(
      sumVector(road.backward[0].first, coordInfo),
      lenDeg(coordInfo.roadWidth / 2, road.angle - 90)
    );
    let mestPoint = sumVector(
      sumVector(road.forward[road.forward.length - 1].first, coordInfo),
      lenDeg(coordInfo.roadWidth / 2, road.angle + 90)
    );

    if (index === 0) {
      curbPoints += "M " + testPoint.x + " " + testPoint.y + " ";
    }
    curbPoints += "L " + testPoint.x + " " + testPoint.y + " ";
    curbPoints += "M " + mestPoint.x + " " + mestPoint.y + " ";

    roads.curb.string += curbPoints;
  }
  for (const side of ["forward", "backward"]) {
    for (const road of points) {
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

      roads.asphalt.elements[side] = roads.asphalt.strings[side].map((lane, index) => (
        <path d={lane} key={index} className={side + "-asphalt"} />
      ));
    }
  }
  for (const side of ["forward", "backward"]) {
    for (const road of points) {
      for (const lane of road[side]) {
        const coords = {
          x1: coordInfo.x + lane.first.x,
          y1: coordInfo.y + lane.first.y,
          x2: coordInfo.x + lane.last.x,
          y2: coordInfo.y + lane.last.y,
        };
        roads.debug.strings[side].push(coords);
      }

      roads.debug.elements[side] = roads.debug.strings[side].map((coords, index) => (
        <line
          x1={coords.x1}
          y1={coords.y1}
          x2={coords.x2}
          y2={coords.y2}
          key={index}
          className={side + "-debug"} />
      ));
    }

    roads.center.element = (
      <path d={roads.center.string} className="forward-asphalt" />
    );
    roads.curb.element = (
      <path d={roads.curb.string} className="forward-debug" />
    );
    return roads;
  }
}
