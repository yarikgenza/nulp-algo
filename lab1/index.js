const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

class Farm {
  constructor(location, animalsCount, power) {
    this.location = location;
    this.animalsCount = animalsCount;
    this.power = power;
  }
}

class FarmManager {
  constructor() {
    this.farms = [];
  }

  async readAndInitData() {
    try {
      const data = await readFile("data.txt", "utf8");
      const farms = data.split(",");
      this.farms = [
        new Farm(farms[0], +farms[1], +farms[2]),
        new Farm(farms[3], +farms[4], +farms[5]),
        new Farm(farms[6], +farms[7], +farms[8]),
        new Farm(farms[9], +farms[10], +farms[11]),
        new Farm(farms[12], +farms[13], +farms[14])
      ];
    } catch (error) {
      console.log("Error while reading data: ", error);
    }
  }

  sortByAnimalsCount() {
    const farms = [...this.farms];

    const quickSort = arr => {
      if (arr.length <= 1) return arr;

      let left = [];
      let right = [];

      const [first, ...rest] = arr;

      left = rest.filter(i => i.animalsCount < first.animalsCount);
      right = rest.filter(i => i.animalsCount > first.animalsCount);

      return quickSort(left).concat(first, quickSort(right));
    };

    console.time("QuickSort");
    const sorted = quickSort(farms);
    console.timeEnd("QuickSort");
    console.log(sorted);
  }

  sortByPower() {
    const farms = [...this.farms];
    let comparisons = 0;
    let swaps = 0;

    console.time("Selection sort");

    for (let j = 0; j < farms.length - 1; j++) {
      let minIndex = j;
      let shouldSwap = false;
      for (let i = j; i < farms.length; i++) {
        comparisons++;
        if (farms[i].power < farms[minIndex].power) {
          minIndex = i;
          shouldSwap = true;
        }
      }
      if (shouldSwap) {
        [farms[minIndex], farms[j]] = [farms[j], farms[minIndex]];
        swaps++;
      }
    }

    console.timeEnd("Selection sort");
    console.log(`Comprasions: ${comparisons}`);
    console.log(`Swaps: ${swaps}`);
    console.log(farms.reverse());
  }
}

const init = async () => {
  const manager = new FarmManager();
  await manager.readAndInitData();
  manager.sortByPower();
  manager.sortByAnimalsCount();
};

init();
