const fs = require('fs');

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generate = (count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(randomInt(500000, 2500000));
  }
  return result;
};

fs.writeFileSync('data.txt', generate(1000).join(','));
