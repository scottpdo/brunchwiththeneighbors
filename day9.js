// thx to https://github.com/mariotacke/advent-of-code-2019/blob/master/day-09-sensor-boost/intcode.js

const program = parse(require("./data/day9"));

const INSTRUCTIONS = {
  ADD: 1,
  MULTIPLY: 2,
  INPUT: 3,
  OUTPUT: 4,
  JUMP_IF_TRUE: 5,
  JUMP_IF_FALSE: 6,
  LT: 7,
  EQ: 8,
  RELATIVE_BASE: 9,
  END: 99
};

const getInstructionName = n => {
  for (let i in INSTRUCTIONS) if (INSTRUCTIONS[i] === n) return i;
  return null;
};

function parse(program) {
  return {
    extraMemory: {},
    program: program.split(",").map(n => +n)
  };
}

function getValue(program, i, mode, relativeBase) {
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

function getAddress(program, i, mode, relativeBase) {
  let address = i;
  if (mode === 0) {
    address = read(program, i);
  } else if (mode === 2) {
    address = read(program, i) + relativeBase;
  }
  return address;
}

function unblock() {
  return new Promise(setImmediate);
}

function write(program, index, value) {
  if (index >= program.program.length) {
    program.extraMemory[index] = value;
  } else {
    program.program[index] = value;
  }
}

function read(program, index) {
  console.assert(index >= 0, index);
  if (index >= program.program.length) return program.extraMemory[index] || 0;
  return program.program[index];
}

async function exec(program, inputs, outputs) {
  let pointer = 0;
  let relativeBase = 0;

  let i = 0;
  while (true) {
    const value = read(program, pointer);

    // parse instruction code and parameter modes
    const instruction = value % 100;
    if (instruction === INSTRUCTIONS.END) break;

    const param1mode = ((value / 100) | 0) % 10;
    const param2mode = ((value / 1000) | 0) % 10;
    const param3mode = ((value / 10000) | 0) % 10;

    if (instruction === INSTRUCTIONS.ADD) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
      const b = getValue(program, pointer + 2, param2mode, relativeBase);
      const index = getAddress(program, pointer + 3, param3mode, relativeBase);
      write(program, index, a + b);
      pointer += 4;
    } else if (instruction === INSTRUCTIONS.MULTIPLY) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
      const b = getValue(program, pointer + 2, param2mode, relativeBase);
      const index = getAddress(program, pointer + 3, param3mode, relativeBase);
      write(program, index, a * b);
      pointer += 4;
    } else if (instruction === INSTRUCTIONS.INPUT) {
      const a = getAddress(program, pointer + 1, param1mode, relativeBase);
      if (inputs.length > 0) {

        const input = inputs.shift();
        write(program, a, input);

        pointer += 2;
      } else {
        await unblock();
      }
    } else if (instruction === INSTRUCTIONS.OUTPUT) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
      outputs.push(a);
      pointer += 2;
    } else if (instruction === INSTRUCTIONS.JUMP_IF_TRUE) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
      const b = getValue(program, pointer + 2, param2mode, relativeBase);
      pointer = a !== 0 ? b : pointer + 3;
    } else if (instruction === INSTRUCTIONS.JUMP_IF_FALSE) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
      const b = getValue(program, pointer + 2, param2mode, relativeBase);
      pointer = a === 0 ? b : pointer + 3;
    } else if (instruction === INSTRUCTIONS.LT) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
      const b = getValue(program, pointer + 2, param2mode, relativeBase);
      const index = getAddress(program, pointer + 3, param3mode, relativeBase);
      write(program, index, a < b ? 1 : 0);
      pointer += index === pointer ? 0 : 4;
    } else if (instruction === INSTRUCTIONS.EQ) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
      const b = getValue(program, pointer + 2, param2mode, relativeBase);
      const index = getAddress(program, pointer + 3, param3mode, relativeBase);
      write(program, index, a === b ? 1 : 0);
      pointer += index === pointer ? 0 : 4;
    } else if (instruction === INSTRUCTIONS.RELATIVE_BASE) {
      const a = getValue(program, pointer + 1, param1mode, relativeBase);
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

// test();

async function testProgram() {
  const output = await exec(program, [2], []
}

testProgram();
