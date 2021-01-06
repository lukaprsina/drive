import React from "react";
import { useDrop } from "react-dnd";
import { sumVector, lenDeg, pointsToString } from "./Artboard";

export function makeAsphalt({
  points,
  coordInfo,
  handleSignDrop,
  handleCarDrop,
  vectors,
  disabled = false,
}) {
  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  const elements = { forward: [], backward: [] };

  for (const [indexRoad, road] of points.entries()) {
    let strings = { forward: [], backward: [] };

    for (const side of ["backward", "forward"]) {
      for (const lane of road[side]) {
        strings[side].push(
          pointsToString([
            { letter: "M", coords: [vectors.offsetBottom(lane, coordInfo)] },
            {
              letter: "L",
              coords: [
                vectors.laneBottomLeft(lane, road, coordInfo),
                vectors.laneTopLeft(lane, road, coordInfo),
                vectors.laneTopRight(lane, road, coordInfo),
                vectors.laneBottomRight(lane, road, coordInfo),
              ],
            },
            { letter: "Z" },
          ])
        );
      }
    }

    for (const side of ["backward", "forward"]) {
      elements[side].push(
        <SvgGroup
          key={indexRoad}
          indexRoad={indexRoad}
          accept={["sign"]}
          side={side}
          onDrop={(item) => handleSignDrop(item, indexRoad)}
        >
          {strings[side].map((string, index) => (
            <Asphalt
              string={string}
              indexLane={index}
              indexRoad={indexRoad}
              accept={["car"]}
              side={side}
              onDrop={(item) => handleCarDrop(item, indexRoad, index)}
              key={index}
            />
          ))}
        </SvgGroup>
      );
    }
  }
  return elements;
}

function SvgGroup({ accept, onDrop, indexRoad, children, side }) {
  const [, dropBind] = useDrop({
    accept,
    drop: side === "forward" ? (item) => onDrop(item, indexRoad) : null,
  });

  return <g ref={dropBind}>{children}</g>;
}

function Asphalt({ string, indexLane, indexRoad, accept, onDrop, side }) {
  const [, dropBind] = useDrop({
    accept,
    drop:
      side === "forward" ? (item) => onDrop(item, indexRoad, indexLane) : null,
  });

  return <path ref={dropBind} d={string} key={indexLane} className="asphalt" />;
}

export function Debug({ points, coordInfo, disabled = false, vectors }) {
  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  const debug = {
    strings: { forward: [], backward: [] },
    elements: {},
  };

  for (const side of ["backward", "forward"]) {
    for (const road of points) {
      for (const lane of road[side]) {
        debug.strings[side].push([
          vectors.offsetBottom(lane, coordInfo),
          vectors.offsetTop(lane, coordInfo),
        ]);
      }
    }

    debug.elements[side] = debug.strings[side].map((coords, index) => (
      <line
        x1={coords[0].x}
        y1={coords[0].y}
        x2={coords[1].x}
        y2={coords[1].y}
        key={index}
        className={side + "-debug"}
      />
    ));
  }

  return (
    <g>
      {debug.elements.forward}
      {debug.elements.backward}
    </g>
  );
}

export function Line({ points, coordInfo, disabled = false, vectors }) {
  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  const line = {
    elements: {},
    strings: { continous: [], striped: [] },
  };

  for (const side of ["backward", "forward"]) {
    for (const road of points) {
      for (const [indexLane, lane] of road[side].entries()) {
        if (indexLane !== road[side].length - 1 || side === "forward") {
          if (indexLane === road[side].length - 1 && side === "forward") {
            line.strings.continous.push([
              vectors.laneBottomRight(lane, road, coordInfo),
              vectors.laneTopRight(lane, road, coordInfo),
            ]);
          } else {
            line.strings.striped.push([
              vectors.laneBottomRight(lane, road, coordInfo),
              vectors.laneTopRight(lane, road, coordInfo),
            ]);
          }
        }
      }
    }
  }

  line.elements.continous = line.strings.continous.map((coords, index) => (
    <line
      x1={coords[0].x}
      y1={coords[0].y}
      x2={coords[1].x}
      y2={coords[1].y}
      key={index}
      className="line"
    />
  ));

  line.elements.striped = line.strings.striped.map((coords, index) => (
    <line
      x1={coords[0].x}
      y1={coords[0].y}
      x2={coords[1].x}
      y2={coords[1].y}
      key={index}
      className="line"
      strokeDasharray="30, 60"
    />
  ));

  return (
    <g>
      {line.elements.continous}
      {line.elements.striped}
    </g>
  );
}

export function LaneConnect({ points, coordInfo, disabled = false, vectors }) {
  const curves = {
    strings: [],
  };

  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  for (const [indexFirst, roadFirst] of points.entries()) {
    for (const laneForward of roadFirst.forward) {
      for (const [indexSecond, roadSecond] of points.entries()) {
        if (indexFirst !== indexSecond) {
          for (const laneBackward of roadSecond.backward) {
            curves.strings.push(
              pointsToString([
                {
                  letter: "M",
                  coords: [vectors.offsetBottom(laneForward, coordInfo)],
                },
                {
                  letter: "Q",
                  coords: [coordInfo, sumVector(laneBackward.first, coordInfo)],
                },
              ])
            );
          }
        }
      }
    }
  }

  curves.elements = curves.strings.map((coords, index) => (
    <path d={coords} key={index} className="curve" />
  ));
  return <g>{curves.elements}</g>;
}

export function RotateControl({
  points,
  coordInfo,
  rotateBind,
  disabled = false, vectors
}) {
  if (!(points && coordInfo && rotateBind && !disabled)) {
    return null;
  }

  const rotate = {
    strings: [],
  };

  for (const road of points) {
    rotate.strings.push({
      vectors: vectors.roadTopMiddle(road, coordInfo),
      order: road.order,
    });
  }

  rotate.elements = rotate.strings.map((coords, index) => (
    <circle
      cx={coords.vectors.x}
      cy={coords.vectors.y}
      r="10"
      className="rotate"
      key={index}
      {...rotateBind(coords.order)}
    />
  ));

  return <g>{rotate.elements}</g>;
}

export function LaneControl({ points, coordInfo, addLanes, disabled = false, vectors }) {
  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  const lane = {
    strings: {
      forward: { remove: [], add: [] },
      backward: { remove: [], add: [] },
    },
    elements: {
      forward: { remove: [], add: [] },
      backward: { remove: [], add: [] },
    },
  };

  for (const road of points) {
    lane.strings.forward.remove.push(
      sumVector(
        vectors.roadBottomLeft(road, coordInfo),
        lenDeg(coordInfo.roadLength / 3, road.angle)
      )
    );

    lane.strings.forward.add.push(
      sumVector(
        vectors.roadBottomLeft(road, coordInfo),
        lenDeg((coordInfo.roadLength * 2) / 3, road.angle)
      )
    );

    lane.strings.backward.remove.push(
      sumVector(
        vectors.roadBottomRight(road, coordInfo),
        lenDeg(coordInfo.roadLength / 3, road.angle)
      )
    );

    lane.strings.backward.add.push(
      sumVector(
        vectors.roadBottomRight(road, coordInfo),
        lenDeg((coordInfo.roadLength * 2) / 3, road.angle)
      )
    );
  }

  lane.elements.forward.remove = lane.strings.forward.remove.map(
    (coords, index) => (
      <circle
        cx={coords.x}
        cy={coords.y}
        r="10"
        className="add-lane"
        key={index}
        onClick={() => addLanes(index, "Forward", -1)}
      />
    )
  );

  lane.elements.forward.add = lane.strings.forward.add.map((coords, index) => (
    <circle
      cx={coords.x}
      cy={coords.y}
      r="10"
      className="add-lane"
      key={index}
      onClick={() => addLanes(index, "Forward", 1)}
    />
  ));

  lane.elements.backward.remove = lane.strings.backward.remove.map(
    (coords, index) => (
      <circle
        cx={coords.x}
        cy={coords.y}
        r="10"
        className="add-lane"
        key={index}
        onClick={() => addLanes(index, "Backward", -1)}
      />
    )
  );

  lane.elements.backward.add = lane.strings.backward.add.map(
    (coords, index) => (
      <circle
        cx={coords.x}
        cy={coords.y}
        r="10"
        className="add-lane"
        key={index}
        onClick={() => addLanes(index, "Backward", 1)}
      />
    )
  );

  return (
    <g>
      {lane.elements.forward.remove}
      {lane.elements.forward.add}
      {lane.elements.backward.remove}
      {lane.elements.backward.add}
    </g>
  );
}

export function Center({ points, coordInfo, disabled = false, vectors }) {
  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  const center = {};

  center.string = pointsToString([
    {
      letter: "M",
      coords: [vectors.roadBottomLeft(points[0], coordInfo)],
    },
  ]);

  for (const road of points) {
    center.string += pointsToString([
      {
        letter: "L",
        coords: [
          vectors.roadBottomLeft(road, coordInfo),
          vectors.roadBottomRight(road, coordInfo),
        ],
      },
    ]);
  }

  center.element = <path d={center.string} className="center" />;

  return center.element;
}

export function Curb({ points, coordInfo, disabled = false, vectors }) {
  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  const curb = {};

  curb.string = pointsToString([
    {
      letter: "M",
      coords: [vectors.roadBottomLeft(points[0], coordInfo)],
    },
  ]);

  for (const [indexRoad, road] of points.entries()) {
    curb.string += pointsToString([
      {
        letter: "L",
        coords: [
          vectors.roadBottomLeft(road, coordInfo),
          vectors.roadTopLeft(road, coordInfo),
        ],
      },
      {
        letter: "M",
        coords: [vectors.roadTopRight(road, coordInfo)],
      },
      {
        letter: "L",
        coords: [vectors.roadBottomRight(road, coordInfo)],
      },
    ]);
    if (indexRoad === points.length - 1) {
      curb.string += pointsToString([
        {
          letter: "L",
          coords: [vectors.roadBottomLeft(points[0], coordInfo)],
        },
      ]);
    }
  }

  curb.element = <path d={curb.string} className="curb" />;

  return curb.element;
}
