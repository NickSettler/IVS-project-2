const fs = require('fs');

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generate = (count, min, max) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(randomInt(min, max));
  }
  return result;
};

const min = 10;
const max = 3000;
const count = 1000;

fs.writeFileSync(
  `data-${count}-<${min}, ${max}>.txt`,
  generate(count, min, max).join(',')
);
