const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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
      this.foodCount = +lines[0];
      this.hamsterCount = +lines[1];
      const hamsters = lines.splice(2, lines.length);
      this.hamsters = hamsters.map(hamster => new Hamster(+hamster[0], +hamster[2]));
    } catch (error) {
      console.log("Error while reading data: ", error);
    }
  }

  async writeResultData(result) {
    try {
      await writeFile('hamster.out', result.toString());
      console.log('Result saved to the hamster.out file');
    } catch (error) {
      console.log('Cannot write result: ', error);
    }
  }

  quickSortByAvariceLevel(arr) {
    if (arr.length <= 1) return arr;

    let left = [];
    let right = [];

    const [first, ...rest] = arr;

    left = rest.filter(i => i.avariceLevel < first.avariceLevel);
    right = rest.filter(i => i.avariceLevel > first.avariceLevel);

    return this.quickSortByAvariceLevel(left).concat(first, this.quickSortByAvariceLevel(right));
  };

  getHamsterMaxCount() {
    const hamsters = [0, ...this.quickSortByAvariceLevel(this.hamsters)]; // 0 here is an initial accumulator value;

    let loopIndex = 0;

    const sum = hamsters.reduce((accumulator, hamster) => {
      const currentHamsterEat = hamster.dayRate + (hamster.avariceLevel * loopIndex);

      if ((accumulator + currentHamsterEat) <= this.foodCount) {
        loopIndex = loopIndex + 1;
        return accumulator + currentHamsterEat;
      } else {
        return accumulator;
      }
    });

    return loopIndex;
  }
}

const init = async () => {
  const main = new Main();
  await main.readAndInitData();
  const canGetMaxHasters = main.getHamsterMaxCount();
  console.log(canGetMaxHasters);
  await main.writeResultData(canGetMaxHasters);
}

init();
