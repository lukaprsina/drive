import React from "react";
import { sumVector, lenDeg } from "./Artboard";

export default function Cars({ objectInfo, points, coordInfo }) {
  const cars = { strings: [] };
  let carPosition = {};

  for (const [indexRoad, road] of objectInfo.entries()) {
    if (road.cars.length !== 0) {
      for (const [indexLane, lane] of road.cars.entries()) {
        if (lane) {
          for (const [indexCar, car] of lane.entries()) {
            carPosition = sumVector(
              sumVector(points[indexRoad].forward[indexLane].first, coordInfo),
              lenDeg(
                coordInfo.roadWidth * (indexCar + 0.5),
                points[indexRoad].angle
              )
            );
            cars.strings.push(carPosition);
          }
        }
      }
    }
  }

  cars.elements = cars.strings.map((coords, index) => (
    <circle cx={coords.x} cy={coords.y} r="10" key={index} className="car" />
  ));

  return cars.elements;
}
