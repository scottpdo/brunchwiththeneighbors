const test1 = parse(require("./data/day7test1"));
const test2 = parse(require("./data/day7test2"));
const test3 = parse(require("./data/day7test3"));
const program = parse(require("./data/day7"));

function parse(program) {
  return program.split(",").map(n => +n);
}

function getParameter(program, i, mode) {
  return mode === 0 ? program[i] : i;
}

function exec(i, program, inputs) {
  const value = program[i];

  // parse instruction code and parameter modes
  const instruction = value % 100;
  const param1mode = ((value / 100) | 0) % 10;
  const param2mode = ((value / 1000) | 0) % 10;
  const param3mode = ((value / 10000) | 0) % 10;

  // set the parameters
  const a = getParameter(program, i + 1, param1mode);
  const b = getParameter(program, i + 2, param2mode);
  const index = getParameter(program, i + 3, param3mode);

  if (instruction === 1) {
    program[index] = program[a] + program[b];
    return exec(i + 4, program, inputs);
  } else if (instruction === 2) {
    program[index] = program[a] * program[b];
    return exec(i + 4, program, inputs);
  } else if (instruction === 3) {
    program[a] = inputs.shift();
    return exec(i + 2, program, inputs, inputs);
  } else if (instruction === 4 && program[i + 2] === 99) {
    return program[a];
    // return exec(i + 2, program, inputs);
  } else if (instruction === 5) {
    if (program[a] !== 0) return exec(program[b], program, inputs);
    return exec(i + 3, program, inputs);
  } else if (instruction === 6) {
    if (program[a] === 0) return exec(program[b], program, inputs);
    return exec(i + 3, program, inputs);
  } else if (instruction === 7) {
    program[index] = program[a] < program[b] ? 1 : 0;
    if (index === i) return exec(i, program, inputs);
    return exec(i + 4, program, inputs);
  } else if (instruction === 8) {
    program[index] = program[a] === program[b] ? 1 : 0;
    if (index === i) return exec(i, program, inputs);
    return exec(i + 4, program, inputs);
  } else if (instruction === 99) {
    return program[0];
  }
}

function toBaseFiveString(n) {
  let output = "";
  for (let power = 4; power >= 0; power--) {
    const digit = (n / 5 ** power) | 0;
    output += digit.toString();
    n = n % 5 ** power;
  }
  return output;
}

function allCharsUnique(str) {
  for (let i = 0; i < str.length - 1; i++) {
    for (let j = i + 1; j < str.length; j++) {
      if (str[i] === str[j]) return false;
    }
  }
  return true;
}

function testCode(code, program) {
  console.log("testing code", code);
  const a = exec(0, program, [+code[0], 0]);
  const b = exec(0, program, [+code[1], a]);
  const c = exec(0, program, [+code[2], b]);
  const d = exec(0, program, [+code[3], c]);
  const e = exec(0, program, [+code[4], d]);
  return e;
}

console.assert(testCode("43210", test1) === 43210, testCode("43210", test1));
console.assert(testCode("01234", test2) === 54321, testCode("01234", test2));
console.assert(testCode("10432", test3) === 65210, testCode("10432", test3));

function testPossibleCodes() {
  let i = 0;
  let max = 0;
  while (toBaseFiveString(i).length < 6) {
    if (!allCharsUnique(toBaseFiveString(i))) {
      i++;
      continue;
    }
    const test = testCode(toBaseFiveString(i), program);
    if (test > max) max = test;
    i++;
  }
  console.log("max code", max);
}

testPossibleCodes();

console.log("done!");
