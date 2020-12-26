import React from "react";
import { sumVector, lenDeg } from "./Artboard";

function pointsToString(pointsArray) {
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

export function buildRoad(points, coordInfo, rotate) {
  if (!(points && coordInfo)) {
    return null;
  }

  const roads = {
    debug: {
      elements: { forward: [], backward: [] },
      strings: { forward: [], backward: [] },
    },
    asphalt: {
      elements: { forward: [], backward: [] },
      strings: { forward: [], backward: [] },
    },
    line: {
      elements: { striped: [], continous: [] },
      strings: { striped: [], continous: [] },
    },
    center: {},
    curb: {},
    rotate: { elements: [], strings: [] },
  };

  const controls = {
    rotate: { strings: [] },
  };

  const dragLibrary = [];

  const vectors = {
    offsetBottom: (lane) => sumVector(coordInfo, lane.first),

    offsetTop: (lane) => sumVector(coordInfo, lane.last),

    halfRoadLeft: (road) => lenDeg(coordInfo.roadWidth / 2, road.angle - 90),

    halfRoadRight: (road) => lenDeg(coordInfo.roadWidth / 2, road.angle + 90),

    laneBottomLeft: (lane, road) =>
      sumVector(vectors.halfRoadLeft(road), vectors.offsetBottom(lane)),

    laneTopLeft: (lane, road) =>
      sumVector(vectors.halfRoadLeft(road), vectors.offsetTop(lane)),

    laneBottomRight: (lane, road) =>
      sumVector(vectors.halfRoadRight(road), vectors.offsetBottom(lane)),

    laneTopRight: (lane, road) =>
      sumVector(vectors.halfRoadRight(road), vectors.offsetTop(lane)),

    roadBottomLeft: (road) =>
      sumVector(
        sumVector(road.backward[0].first, coordInfo),
        vectors.halfRoadLeft(road)
      ),

    roadBottomRight: (road) =>
      sumVector(
        sumVector(road.forward[road.forward.length - 1].first, coordInfo),
        vectors.halfRoadRight(road)
      ),
    roadTopLeft: (road) =>
      sumVector(
        sumVector(road.backward[0].last, coordInfo),
        vectors.halfRoadLeft(road)
      ),

    roadTopRight: (road) =>
      sumVector(
        sumVector(road.forward[road.forward.length - 1].last, coordInfo),
        vectors.halfRoadRight(road)
      ),

    roadTopMiddle: (road) =>
      sumVector(
        lenDeg(coordInfo.roadLength, road.angle),
        sumVector(
          lenDeg(
            ((road.numberOfForward + road.numberOfBackward) *
              coordInfo.roadWidth) /
              2,
            road.angle + 90
          ),
          vectors.roadBottomLeft(road)
        )
      ),
  };
  for (const side of ["forward", "backward"]) {
    // fill both sides of the object
    for (const [indexRoad, road] of points.entries()) {
      // for every road

      for (const [indexLane, lane] of road[side].entries()) {
        // for every lane

        //----ASPHALT---- strings//
        roads.asphalt.strings[side].push(
          pointsToString([
            { letter: "M", coords: [vectors.offsetBottom(lane)] },
            {
              letter: "L",
              coords: [
                vectors.laneBottomLeft(lane, road),
                vectors.laneTopLeft(lane, road),
                vectors.laneTopRight(lane, road),
                vectors.laneBottomRight(lane, road),
              ],
            },
            { letter: "Z" },
          ])
        );

        //-----DEBUG----- strings//
        roads.debug.strings[side].push([
          vectors.offsetBottom(lane),
          vectors.offsetTop(lane),
        ]);

        //-----LINE------ strings//
        if (indexLane !== road[side].length - 1 || side === "backward") {
          if (indexLane === road[side].length - 1 && side === "backward") {
            roads.line.strings.continous.push([
              vectors.laneBottomRight(lane, road),
              vectors.laneTopRight(lane, road),
            ]);
          } else {
            roads.line.strings.striped.push([
              vectors.laneBottomRight(lane, road),
              vectors.laneTopRight(lane, road),
            ]);
          }
        }
      }

      //-----ROTATE---- strings//
      if (side === "backward") {
        dragLibrary.push(rotate);
        controls.rotate.strings.push(vectors.roadTopMiddle(road));
      }

      //-----CENTER---- strings//
      if (indexRoad === 0) {
        roads.center.string = pointsToString([
          {
            letter: "M",
            coords: [vectors.roadBottomLeft(road)],
          },
        ]);
      }
      roads.center.string += pointsToString([
        {
          letter: "L",
          coords: [vectors.roadBottomLeft(road), vectors.roadBottomRight(road)],
        },
      ]);

      roads.coordInfo = <circle cx={coordInfo.x} cy={coordInfo.y} r="5" />;

      //-----CURB----- strings//
      if (indexRoad === 0) {
        roads.curb.string = pointsToString([
          {
            letter: "M",
            coords: [vectors.roadBottomLeft(road)],
          },
        ]);
      }
      roads.curb.string += pointsToString([
        {
          letter: "L",
          coords: [vectors.roadBottomLeft(road), vectors.roadTopLeft(road)],
        },
        {
          letter: "M",
          coords: [vectors.roadTopRight(road)],
        },
        {
          letter: "L",
          coords: [vectors.roadBottomRight(road)],
        },
      ]);
      if (indexRoad === points.length - 1) {
        roads.curb.string += pointsToString([
          {
            letter: "L",
            coords: [vectors.roadBottomLeft(points[0])],
          },
        ]);
      }

      //----ASPHALT---- elements//
      roads.asphalt.elements[side] = roads.asphalt.strings[
        side
      ].map((lane, index) => (
        <path d={lane} key={index} className={side + "-asphalt"} />
      ));

      //-----DEBUG----- elements//
      roads.debug.elements[side] = roads.debug.strings[
        side
      ].map((coords, index) => (
        <line
          x1={coords[0].x}
          y1={coords[0].y}
          x2={coords[1].x}
          y2={coords[1].y}
          key={index}
          className={side + "-debug"}
        />
      ));

      //-----LINE------ elements//
      roads.line.elements.striped = roads.line.strings.striped.map(
        (coords, index) => (
          <line
            x1={coords[0].x}
            y1={coords[0].y}
            x2={coords[1].x}
            y2={coords[1].y}
            key={index}
            className={side + "-line"}
            strokeDasharray="30, 60"
          />
        )
      );
      roads.line.elements.continous = roads.line.strings.continous.map(
        (coords, index) => (
          <line
            x1={coords[0].x}
            y1={coords[0].y}
            x2={coords[1].x}
            y2={coords[1].y}
            key={index}
            className={side + "-line"}
          />
        )
      );
    }
  }

  //-----CENTER---- elements//
  roads.center.element = <path d={roads.center.string} className="center" />;

  //-----CURB----- elements//
  roads.curb.element = <path d={roads.curb.string} className="curb" />;
  /* console.log({roads, controls}) */

  //----ROTATE---- elements//
  controls.rotate.elements = controls.rotate.strings.map((coords, index) => (
    <div
      style={{ left: coords.x, top: coords.y - 30 }}
      className="rotate"
      key={index}
      {...dragLibrary[index](index)}
    ></div>

    /*     <circle
      cx={coords.x}
      cy={coords.y}
      r="10"
      className="rotate"
      key={index}
      {...rotate(index)}
    /> */
  ));

  return [roads, controls];
}
