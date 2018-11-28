const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

const results = new Set();

Array.prototype.chunk = function(n) {
  if (!this.length) {
    return [];
  }
  return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

const readData = async () => {
  try {
    const dataArr = await readFile("data.in", "utf8");
    const nodes = dataArr.split(",").map(item => +item);
    return nodes;
  } catch (error) {
    console.log("Error while reading data: ", error);
  }
};

const evaluate = (graph, reversedGraph, limitDiff, divider) => {
  let shallContinue = true;

  [...Array(limitDiff).keys()].forEach(diff => {
    const extract = [...graph[0]];
    extract.shift();

    extract.forEach(indexWeight => {
      const result = dfsWrapper(graph, 0, indexWeight, diff);

      if (result.length === divider) {
        reversedResult = dfsWrapper(reversedGraph, 0, indexWeight, diff);
        if (reversedResult.length === divider) {
          results.add(diff);
          shallContinue = false;
        }
      }

      if (!shallContinue) {
        throw new Error();
      }
    });
    if (!shallContinue) throw new Error();
  });
};

const dfsWrapper = (graph, start, indexWeight, diff) => {
  let edges = [indexWeight];
  const checked = new Set();

  const dfs = start => {
    checked.add(start);

    graph[start].forEach((weight, index) => {
      if (!checked.has(index) && index !== start) {
        edges.push(weight);

        if (Math.max(...edges) - Math.min(...edges) <= diff) {
          dfs(index);
        } else {
          edges = edges.filter(item => item !== weight);
        }
      }
    });
  };

  dfs(start);

  return Array.from(checked);
};

const getGraph = array => array.chunk(Math.sqrt(array.length));

const main = async () => {
  const data = await readData();
  const graph = getGraph(data);
  const reversedGraph = getGraph(data.reverse());
  const limitDiff = Math.max(...data) - Math.min(...data) + 1;
  try {
    evaluate(graph, reversedGraph, limitDiff, graph.length);
  } catch (error) {
    /* our of scope, it's okay */
    console.log("Results:", results);
  }
};

main();
