const program = parse(require("./data/day9"));

const INSTRUCTIONS = {
  1: "add",
  2: "multiply",
  3: "input",
  4: "output",
  5: "jump if zero",
  6: "jump if not zero",
  7: "less than",
  8: "equal to",
  9: "relative base",
  99: "end"
};

function parse(program) {
  return program.split(",").map(n => +n);
}

function getParameter(program, i, mode, relativeBase) {
  // mode 0 = POSITION
  // mode 1 = IMMEDIATE
  // mode 2 = RELATIVE
  let index = i; // default to immediate
  if (mode === 0) {
    // position mode gets the index at program[i]
    index = read(program, i);
  } else if (mode === 2) {
    index = read(program, i) + relativeBase;
  }
  return read(program, index);
}

function unblock() {
  return new Promise(setImmediate);
}

function write(program, index, value) {
  while (program.length < index + 1) program.push(0);
  program[index] = value;
}

function read(program, index) {
  console.assert(index >= 0, index);
  if (index >= program.length) write(program, index, 0);
  return program[index];
}

async function exec(program, inputs, outputs) {
  let pointer = 0;
  let relativeBase = 0;

  const innerProgram = Array.from(program);

  let i = 0;
  while (true) {
    const value = innerProgram[pointer];

    // parse instruction code and parameter modes
    const instruction = value % 100;
    if (instruction === 99) break;

    const param1mode = ((value / 100) | 0) % 10;
    const param2mode = ((value / 1000) | 0) % 10;

    // set the parameters
    const a = getParameter(innerProgram, pointer + 1, param1mode, relativeBase);
    const b = getParameter(innerProgram, pointer + 2, param2mode, relativeBase);
    const index = innerProgram[pointer + 3];

    if (instruction === 1) {
      write(innerProgram, index, a + b);
      pointer += 4;
    } else if (instruction === 2) {
      write(innerProgram, index, a * b);
      pointer += 4;
    } else if (instruction === 3) {
      if (inputs.length > 0) {
        write(innerProgram, innerProgram[pointer + 1], inputs.shift());
        pointer += 2;
      } else {
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
      write(innerProgram, index, a < b ? 1 : 0);
      pointer += index === pointer ? 0 : 4;
    } else if (instruction === 8) {
      write(innerProgram, index, a === b ? 1 : 0);
      pointer += index === pointer ? 0 : 4;
    } else if (instruction === 9) {
      relativeBase += a;
      pointer += 2;
    }

    i++;
  }

  return outputs;
}

async function test() {
  const oneInput = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99";
  const one = (await exec(parse(oneInput), [], [])).join(",");
  console.assert(one === oneInput, one);
  const two = (
    await exec(parse("1102,34915192,34915192,7,4,7,99,0"), [], [])
  ).pop();
  console.assert(two === 34915192 ** 2, two);
  const three = (await exec(parse("104,1125899906842624,99"), [], [])).pop();
  console.assert(three === 1125899906842624, three);
}

test();

async function testProgram() {
  const output = await exec(program, [1], []);
  console.log(output);
}

testProgram();
