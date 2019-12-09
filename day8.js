const input = require("./data/day8");

function parseInput(input, width, height) {
  const layers = [];
  for (let i = 0; i < input.length; i++) {
    const layer = Math.floor(i / (width * height));
    if (layer >= layers.length) layers.push("");
    layers[layer] += input[i];
  }
  return layers;
}

function countChars(layer, char) {
  return layer.split("").filter(c => c === char).length;
}

function getLayerWithLeast(layers, char) {
  let count = Infinity;
  let index = 0;
  layers.forEach((layer, i) => {
    const countOnThisLayer = countChars(layer, char);
    if (countOnThisLayer < count) {
      count = countOnThisLayer;
      index = i;
    }
  });
  return index;
}

const layers = parseInput(input, 25, 6);
const leastZeroesLayerIndex = getLayerWithLeast(layers, "0");
console.log(
  "ones times twos",
  countChars(layers[leastZeroesLayerIndex], "1") *
    countChars(layers[leastZeroesLayerIndex], "2")
);
