const test1 = require("./data/day6test1");
const test2 = require("./data/day6test2");
const input = require("./data/day6");

function makeOrbitsMap(input) {
  input = input.split("\n");
  const orbits = {};

  input.forEach((row, i) => {
    const [center, object] = row.split(")");
    if (!orbits[center]) orbits[center] = null;
    orbits[object] = center;
  });
  return orbits;
}

function totalOrbits(input) {
  const orbits = makeOrbitsMap(input);

  const totalOrbits = Object.keys(orbits).reduce((acc, orbit) => {
    return acc + traceBack(orbits, orbit, "COM");
  }, 0);

  return totalOrbits;
}

function traceBack(orbits, outer, inner) {
  if (outer === inner) return 0;
  let depth = 1;
  let center = orbits[outer];
  while (center !== inner && center !== null) {
    depth++;
    center = orbits[center];
  }
  return depth;
}

function youToSan(input) {
  const orbits = makeOrbitsMap(input);
  const trace = [];
  let center = orbits.YOU;
  let closest = null;
  while (center !== null) {
    trace.push(center);
    center = orbits[center];
  }
  center = orbits.SAN;
  while (center !== null) {
    if (trace.includes(center)) {
      closest = center;
      break;
    }
    center = orbits[center];
  }
  const depthFromYouToClosest = traceBack(orbits, "YOU", closest);
  const depthFromSanToClosest = traceBack(orbits, "SAN", closest);
  return depthFromYouToClosest + depthFromSanToClosest - 2;
}

console.assert(totalOrbits(test1) === 42);
const test2value = youToSan(test2);
console.assert(test2value === 4, test2value);

console.log("total orbits", totalOrbits(input));
console.log("you to san", youToSan(input));
