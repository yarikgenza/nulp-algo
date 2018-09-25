const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

Array.prototype.chunk = function(n) {
  if (!this.length) return [];
  return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

class Hamster {
  constructor(dayRate, avariceLevel) {
    this.dayRate = dayRate;
    this.avariceLevel = avariceLevel;
  }
}

class Main {
  constructor() {
    this.hamsters = [];
    this.hamsterCount = 0;
    this.foodCount = 0;
  }

  async readAndInitData() {
    try {
      const dataArr = await readFile("hamster.in", "utf8");
      let lines = dataArr.toString().split('\n')
      this.foodCount = lines[0];
      this.hamsterCount = lines[1];
      const hamsters = lines.splice(2, lines.length);
      this.hamsters = hamsters.map(hamster => new Hamster(hamster[0], hamster[2]));
      console.log(this.hamsters);
    } catch (error) {
      console.log("Error while reading data: ", error);
    }
  }
}

const init = async () => {
  const main = new Main();
  await main.readAndInitData();
}


init();
