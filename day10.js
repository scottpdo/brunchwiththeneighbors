const map = require("./data/day10");
const test1 = require("./data/day10test1");
const test2 = require("./data/day10test2");
const test3 = require("./data/day10test3");
const test4 = require("./data/day10test4");

function slope(dx, dy) {
  // find greatest common factor and reduce if necessary
  if (dx === 0) return [0, Math.sign(dy)];
  if (dy === 0) return [Math.sign(dx), 0];
  let GCF = Math.abs(dx > dy ? dy : dx);
  while (GCF >= 1) {
    if (dx % GCF === 0 && dy % GCF === 0) {
      dx /= GCF;
      dy /= GCF;
    }
    GCF--;
  }
  return [dx, dy];
}

class Asteroid {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function parseMap(map) {
  const output = {};
  map.split("\n").forEach((row, y) => {
    row.split("").forEach((v, x) => {
      if (v === "#") output[x + "," + y] = new Asteroid(x, y);
    });
  });
  return output;
}

let [x1, y1] = slope(2, 4);
console.assert(x1 === 1 && y1 === 2, x1, y1);
let [x2, y2] = slope(3, 4);
console.assert(x2 === 3 && y2 === 4, x2, y2);
let [x3, y3] = slope(4, -4);
console.assert(x3 === 1 && y3 === -1, x3, y3);
let [x4, y4] = slope(-66, 99);
console.assert(x4 === -2 && y4 === 3, x4, y4);

function inBounds(tx, ty, x1, y1, x2, y2) {
  const minX = x1 > x2 ? x2 : x1;
  const minY = y1 > y2 ? y2 : y1;
  const maxX = x1 > x2 ? x1 : x2;
  const maxY = y1 > y2 ? y1 : y2;
  if (tx < minX || tx > maxX || ty < minY || ty > maxY) return false;
  return true;
}

function areMutuallyVisible(a1, a2, map) {
  if (a1 === a2) return false;
  const [dx, dy] = slope(a2.x - a1.x, a2.y - a1.y);
  let { x, y } = a1;
  let visible = true;
  while (inBounds(x + dx, y + dy, a1.x, a1.y, a2.x, a2.y)) {
    const test = map[`${x + dx},${y + dy}`];
    if (test && test !== a2) {
      visible = false;
      break;
    }
    x += dx;
    y += dy;
  }
  return visible;
}

function findAsteroidWithHighestVisibility(map) {
  let asteroidWithHighestVisibility = null;
  let highestVisibility = 0;
  Object.values(map).forEach(asteroid => {
    let visibility = 0;
    Object.values(map).forEach(other => {
      if (asteroid === other) return;
      if (areMutuallyVisible(asteroid, other, map)) visibility++;
      if (visibility > highestVisibility) {
        asteroidWithHighestVisibility = asteroid;
        highestVisibility = visibility;
      }
    });
  });
  return [asteroidWithHighestVisibility, highestVisibility];
}

function angle(a1, a2) {
  return Math.atan2(-(a2.x - a1.x), a2.y - a1.y) + Math.PI;
}

function test() {
  const map1 = parseMap(test1);
  console.log(findAsteroidWithHighestVisibility(map1));
  const map2 = parseMap(test2);
  console.log(findAsteroidWithHighestVisibility(map2));
  const map3 = parseMap(test3);
  console.log(findAsteroidWithHighestVisibility(map3));
  const map4 = parseMap(test4);
  console.log(findAsteroidWithHighestVisibility(map4));
}

// test();

const parsedMap = parseMap(map);
const [asteroid, visibility] = findAsteroidWithHighestVisibility(parsedMap);
console.log(asteroid, visibility);

// console.log("angle", angle({ x: 0, y: 0 }, { x: 0, y: -1 }));
// console.log("angle", angle({ x: 0, y: 0 }, { x: 1, y: -1 }));
// console.log("angle", angle({ x: 0, y: 0 }, { x: 1, y: 0 }));
// console.log("angle", angle({ x: 0, y: 0 }, { x: 1, y: 1 }));
// console.log("angle", angle({ x: 0, y: 0 }, { x: 0, y: 1 }));
// console.log("angle", angle({ x: 0, y: 0 }, { x: -1, y: 1 }));
// console.log("angle", angle({ x: 0, y: 0 }, { x: -1, y: 0 }));
// console.log("angle", angle({ x: 0, y: 0 }, { x: -1, y: -1 }));

function vaporize(asteroid, map) {
  let asteroids = Object.values(map).filter(a => a !== asteroid);
  asteroids.sort((a, b) => (angle(asteroid, a) > angle(asteroid, b) ? 1 : -1));
  console.log("before vaporizing", asteroids.length);
  let i = 0;
  do {
    let toVaporize = [];
    asteroids = asteroids.filter(a => {
      if (areMutuallyVisible(asteroid, a, parsedMap)) {
        i++;
        console.log(i, a);
        toVaporize.push(a);
        return false;
      } else {
        return true;
      }
    });
    toVaporize.forEach(({ x, y }) => {
      delete parsedMap[x + "," + y];
    });
  } while (asteroids.length > 0);
}

vaporize(asteroid, parsedMap);
