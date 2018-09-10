const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

Array.prototype.chunk = function(n) {
  if (!this.length) {
    return [];
  }
  return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

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

      if (farms.length % 3 !== 0) {
        console.log("Invalid data");
        return;
      }

      const farmsArr = farms.chunk(3);

      farmsArr.forEach(item => {
        this.farms.push(
          new Farm(
            item[0], // Location
            +item[1], // animalsCount
            +item[2] // power
          )
        );
      });
    } catch (error) {
      console.log("Error while reading data: ", error);
    }
  }

  quickSortByAnimalsCount() {
    const farms = [...this.farms];
    let comparisons = 0;
    let swaps = 0;

    const quickSort = arr => {
      if (arr.length <= 1) return arr;

      let left = [];
      let right = [];

      const [first, ...rest] = arr;

      left = rest.filter(i => {
        comparisons++;
        return i.animalsCount < first.animalsCount;
      });
      right = rest.filter(i => {
        comparisons++;
        return i.animalsCount > first.animalsCount;
      });

      swaps++;
      return quickSort(left).concat(first, quickSort(right));
    };

    console.time("QuickSort");
    const sorted = quickSort(farms);
    console.timeEnd("QuickSort");
    console.log(`Comprasions: ${comparisons}`);
    console.log(`Swaps: ${swaps}`);
    console.log(sorted);
  }

  bubbleSortByPower() {
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
  manager.bubbleSortByPower();
  manager.quickSortByAnimalsCount();
};

init();
