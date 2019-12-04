const originalProgram = `
    1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,10,19,23,1,23,9,27,1,5,27,31,2,31,13,35,1,35,5,39,1,39,5,43,2,13,43,47,2,47,10,51,1,51,6,55,2,55,9,59,1,59,5,63,1,63,13,67,2,67,6,71,1,71,5,75,1,75,5,79,1,79,9,83,1,10,83,87,1,87,10,91,1,91,9,95,1,10,95,99,1,10,99,103,2,103,10,107,1,107,9,111,2,6,111,115,1,5,115,119,2,119,13,123,1,6,123,127,2,9,127,131,1,131,5,135,1,135,13,139,1,139,10,143,1,2,143,147,1,147,10,0,99,2,0,14,0`
  .split(",")
  .map(x => +x);

function exec(i, program) {
  const value = program[i];
  if (value === 1) {
    const a = program[i + 1];
    const b = program[i + 2];
    const index = program[i + 3];
    program[index] = program[a] + program[b];
  } else if (value === 2) {
    const a = program[i + 1];
    const b = program[i + 2];
    const index = program[i + 3];
    program[index] = program[a] * program[b];
  } else if (value === 99) {
    return program[0];
  }

  return exec(i + 4, program);
}

for (let noun = 0; noun < 99; noun++) {
  for (let verb = 0; verb < 99; verb++) {
    const clonedProgram = Array.from(originalProgram);
    clonedProgram[1] = noun;
    clonedProgram[2] = verb;
    if (exec(0, clonedProgram) === 19690720) {
      console.log("found it!", noun, verb);
    }
  }
}
