const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

const readData = async () => {
  try {
    const dataString = await readFile("data.in", "utf8");
    const [number, N] = dataString.split(" ");
    return { number, N };
  } catch (error) {
    console.log("Error while reading data: ", error);
  }
};

const getPowersOfNumber = N =>
  [...Array(20).keys()]
    .slice(1)
    .map(exp => Number(Math.pow(N, exp)).toString(2));

const getMinDivide = (string, powers) => {
  let solution = 0;

  const findSub = powers.forEach(power => {
    while (string.indexOf(power) !== -1) {
      solution = solution += 1;
      string = string.replace(power, "");
    }
  });

  return solution || -1;
};

const main = async () => {
  const { number, N } = await readData();
  const powers = getPowersOfNumber(+N);
  const solution = getMinDivide(number, powers);
  console.log(solution);
};

main();
