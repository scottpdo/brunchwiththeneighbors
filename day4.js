const MIN = 152085;
const MAX = 670283;

function getDigitAtIndex(n, i) {
  if (i < 0) return null;
  if (i > Math.log(n) / Math.log(10)) return null;
  return ((n / 10 ** i) | 0) % 10;
}

function isValid(n) {
  if (n < 100000 || n > 999999) return false;
  let hasExactDouble = false;
  let isAscending = true;

  let power = 0;
  let digit = getDigitAtIndex(n, power);
  while (power < Math.log(n) / Math.log(10)) {
    const nextDigit = getDigitAtIndex(n, power + 1);
    if (!hasExactDouble && digit === nextDigit) {
      const prevDigit = getDigitAtIndex(n, power - 1);
      const nextNextDigit = getDigitAtIndex(n, power + 2);
      if (prevDigit === null) {
        hasExactDouble = nextNextDigit !== nextDigit;
      } else if (nextNextDigit === null) {
        hasExactDouble = prevDigit !== digit;
      } else {
        hasExactDouble = nextNextDigit !== nextDigit && prevDigit !== digit;
      }
    }
    if (digit < nextDigit) isAscending = false;
    digit = nextDigit;
    power++;
  }

  return hasExactDouble && isAscending;
}

console.assert(!isValid(111111), 111111);
console.assert(isValid(112233), 112233);
console.assert(!isValid(123444), 123444);
console.assert(isValid(111122), 111122);
console.assert(!isValid(223450), 223450);
console.assert(!isValid(123789), 123789);

let valid = 0;
for (let i = MIN; i < MAX; i++) {
  if (isValid(i)) valid++;
}

console.log(`there are ${valid} valid passwords in the range`);

console.log("done!");
