import React from "react";
import { sumVector, lenDeg } from "./Artboard";

export default function Cars({ objectInfo, points, coordInfo }) {
  const cars = { strings: [], numbers: [] };
  let carPosition = {};

  for (const [indexRoad, road] of objectInfo.entries()) {
    if (road.cars.length !== 0) {
      for (const [indexLane, lane] of road.cars.entries()) {
        if (lane) {
          if (lane.length > 5) {
            cars.numbers.push({
              coords: sumVector(
                sumVector(
                  points[indexRoad].forward[indexLane].first,
                  coordInfo
                ),
                lenDeg(coordInfo.roadWidth * 4.5, points[indexRoad].angle)
              ),
              number: lane.length,
            });
          }

          // draw number
          for (const [indexCar, car] of lane.entries()) {
            if (indexCar < 5) {
              carPosition = sumVector(
                sumVector(
                  points[indexRoad].forward[indexLane].first,
                  coordInfo
                ),
                sumVector(lenDeg(
                  coordInfo.roadWidth * (indexCar + 0.5),
                  points[indexRoad].angle
                ), car.getOffset())
              );
            }

            cars.strings.push(carPosition);
          }
        }
      }
    }
  }

  cars.elements = cars.strings.map((coords, index) => (
    <circle cx={coords.x} cy={coords.y} r="10" key={index} className="car" />
  ));

  cars.extra = cars.numbers.map((coords, index) => (
    <text
      x={coords.coords.x}
      y={coords.coords.y}
      key={index}
      className="car-number"
    >
      {coords.number - 4}
    </text>
  ));

  return (
    <g>
      {cars.elements}
      {cars.extra}
    </g>
  );
}
