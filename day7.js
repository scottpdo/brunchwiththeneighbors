const test1 = parse(require("./data/day7test1"));
const test2 = parse(require("./data/day7test2"));
const test3 = parse(require("./data/day7test3"));
const test4 = parse(require("./data/day7test4"));
const test5 = parse(require("./data/day7test5"));
const program = parse(require("./data/day7"));

function parse(program) {
  return program.split(",").map(n => +n);
}

function getParameter(program, i, mode) {
  return program[mode === 0 ? program[i] : i];
}

function unblock() {
  return new Promise(setImmediate);
}

async function exec(program, inputs, outputs, phaseSettings) {
  let pointer = 0;

  while (true) {
    const value = program[pointer];

    // parse instruction code and parameter modes
    const instruction = value % 100;
    if (instruction === 99) break;

    const param1mode = ((value / 100) | 0) % 10;
    const param2mode = ((value / 1000) | 0) % 10;

    // set the parameters
    const a = getParameter(program, pointer + 1, param1mode);
    const b = getParameter(program, pointer + 2, param2mode);
    const index = program[pointer + 3];

    if (instruction === 1) {
      program[index] = a + b;
      pointer += 4;
    } else if (instruction === 2) {
      program[index] = a * b;
      pointer += 4;
    } else if (instruction === 3) {
      if (phaseSettings.length > 0) {
        program[program[pointer + 1]] = phaseSettings.shift();
        pointer += 2;
      } else if (inputs.length > 0) {
        program[program[pointer + 1]] = inputs.shift();
        pointer += 2;
      } else {
        console.log("unblocking");
        await unblock();
      }
    } else if (instruction === 4) {
      outputs.push(a);
      pointer += 2;
    } else if (instruction === 5) {
      pointer = a !== 0 ? b : pointer + 3;
    } else if (instruction === 6) {
      pointer = a === 0 ? b : pointer + 3;
    } else if (instruction === 7) {
      program[index] = a < b ? 1 : 0;
      pointer += index === pointer ? 0 : 4;
    } else if (instruction === 8) {
      program[index] = a === b ? 1 : 0;
      pointer += index === pointer ? 0 : 4;
    }
  }

  console.log("returning", outputs);
  return outputs;
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

async function testCode(code, program) {
  const clonedProgram = Array.from(program);
  const out1 = [];
  const out2 = [];
  const out3 = [];
  const out4 = [];
  const out5 = [];
  await Promise.all([
    exec(clonedProgram, [0], out1, [+code[0]]),
    exec(clonedProgram, out1, out2, [+code[1]]),
    exec(clonedProgram, out2, out3, [+code[2]]),
    exec(clonedProgram, out3, out4, [+code[3]]),
    exec(clonedProgram, out4, out5, [+code[4]])
  ]);
  return out5.pop();
}

async function testFeedbackCode(code, program) {
  const clonedProgram = Array.from(program);
  const out1 = [];
  const out2 = [];
  const out3 = [];
  const out4 = [];
  const out5 = [0];
  await Promise.all([
    exec(clonedProgram, out5, out1, [+code[0]]),
    exec(clonedProgram, out1, out2, [+code[1]]),
    exec(clonedProgram, out2, out3, [+code[2]]),
    exec(clonedProgram, out3, out4, [+code[3]]),
    exec(clonedProgram, out4, out5, [+code[4]])
  ]);
  return out5.pop();
}

async function test() {
  const one = await testCode("43210", test1);
  console.assert(one === 43210, "one", one);
  const two = await testCode("01234", test2);
  console.assert(two === 54321, "two", two);
  const three = await testCode("10432", test3);
  console.assert(three === 65210, "three", three);
  const four = await testFeedbackCode("98765", test4);
  console.assert(four === 139629729, "four", four);
  // const five = testFeedbackCode("97856", test5);
  // console.assert(five === 18216, "five", five);
}

test();

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

// testPossibleCodes();

console.log("done!");
