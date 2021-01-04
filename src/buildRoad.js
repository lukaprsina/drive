import React from "react";
import { useDrop } from "react-dnd";
import { sumVector, lenDeg } from "./Artboard";

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
      sumVector(road.backward[0].first, coordInfo),
      vectors.halfRoadLeft(road, coordInfo)
    ),

  roadBottomRight: (road, coordInfo) =>
    sumVector(
      sumVector(road.forward[road.forward.length - 1].first, coordInfo),
      vectors.halfRoadRight(road, coordInfo)
    ),
  roadTopLeft: (road, coordInfo) =>
    sumVector(
      sumVector(road.backward[0].last, coordInfo),
      vectors.halfRoadLeft(road, coordInfo)
    ),

  roadTopRight: (road, coordInfo) =>
    sumVector(
      sumVector(road.forward[road.forward.length - 1].last, coordInfo),
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

export function makeAsphalt({ points, coordInfo }) {
  if (!(points && coordInfo)) {
    return null;
  }

  const strings = { forward: [], backward: [] };

  for (const side of ["forward", "backward"]) {
    for (const road of points) {
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
  }
  return strings;
}

export function Asphalt({ string, side, index, accept, onDrop }) {
  const [, dropBind] = useDrop({
    accept,
    drop: (item, monitor) => onDrop(item, monitor),
  });

  return (
    <path ref={dropBind} d={string} key={index} className={side + "-asphalt"} />
  );
}

/* export function Asphalt({ points, coordInfo, accept, onDrop }) {
  const [,dropBind] = useDrop({
    accept,
    drop: onDrop,
  });

  if (!(points && coordInfo)) {
    return null;
  }

  const asphalt = {
    strings: { forward: [], backward: [] },
    elements: {},
  };

  for (const side of ["forward", "backward"]) {
    for (const road of points) {
      for (const lane of road[side]) {
        asphalt.strings[side].push(
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

    asphalt.elements[side] = asphalt.strings[side].map((lane, index) => (
      <path ref={dropBind} d={lane} key={index} className={side + "-asphalt"} />
    ));
  }

  return (
    <g>
      {asphalt.elements.forward}
      {asphalt.elements.backward}
    </g>
  );
} */

export function Debug({ points, coordInfo, disabled = false }) {
  if (!(points && coordInfo && !disabled)) {
    return null;
  }

  const debug = {
    strings: { forward: [], backward: [] },
    elements: {},
  };

  for (const side of ["forward", "backward"]) {
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

export function Line({ points, coordInfo }) {
  if (!(points && coordInfo)) {
    return null;
  }

  const line = {
    elements: {},
    strings: { continous: [], striped: [] },
  };

  for (const side of ["forward", "backward"]) {
    for (const road of points) {
      for (const [indexLane, lane] of road[side].entries()) {
        if (indexLane !== road[side].length - 1 || side === "backward") {
          if (indexLane === road[side].length - 1 && side === "backward") {
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
      strokeDasharray="30, 60"
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
    />
  ));

  return (
    <g>
      {line.elements.continous}
      {line.elements.striped}
    </g>
  );
}

export function RotateControl({ points, coordInfo, rotateBind }) {
  if (!(points && coordInfo && rotateBind)) {
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

export function LaneControl({ points, coordInfo, addLanes }) {
  if (!(points && coordInfo)) {
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

export function Center({ points, coordInfo }) {
  if (!(points && coordInfo)) {
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

export function Curb({ points, coordInfo }) {
  if (!(points && coordInfo)) {
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
