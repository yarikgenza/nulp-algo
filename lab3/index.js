const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Node {
  constructor(index, type = null) {
    this.index = index;
    this.type = type;
  }
}

class Edge {
  constructor(startNode, endNode, weight) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.weight = weight;
  }
}

class Graph {
  constructor() {
    this.edges = [];
    this.clients = [];
    this.routers = [];
    this.nodes = [];
  }

  async readAndInitData() {
    try {
      const dataArr = await readFile("gmsrv.in", "utf8");
      let lines = dataArr.toString().split("\n");

      this.edges = lines.slice(2, lines.length).map(edge => {
        const data = edge.split(" ");
        return new Edge(+data[0], +data[1], +data[2]);
      });

      this.clients = lines[1]
        .split(" ")
        .map(clientIndex => new Node(+clientIndex, "client"));

      this.findRouters();
    } catch (error) {
      console.log("Error while reading data: ", error);
    }
  }

  findRouters() {
    const { clients, edges } = this;
    const routers = new Set();

    clients.forEach(client => {
      edges.forEach(edge => {
        if (edge.startNode === client.index) {
          routers.add(edge.endNode);
        } else if (edge.endNode === client.index) {
          routers.add(edge.startNode);
        }
      });
    });

    this.routers = Array.from(routers);
  }

  fillNodes(clients, routers, serverIndex) {
    const nodes = new Set();
    const SERVER = new Node(routers[serverIndex], "server");

    routers.forEach(router => {
      nodes.add(new Node(router, "router"));
    });
    clients.forEach(client => {
      nodes.add(client);
    });
    nodes.add(SERVER);

    this.nodes = Array.from(nodes).filter(
      node =>
        node.index === routers[serverIndex] && node.type !== "server"
          ? false
          : true
    );
  }

  getMaxVal(arr, key) {
    let init = arr[0];
    arr.forEach(i => {
      if (i[key] > init[key]) {
        init = i;
      }
    });
    return init;
  }

  findDistances() {
    const { clients, nodes, edges } = this;

    let leftClients = [];
    let rightClients = [];

    clients.forEach(client => {
      if (edges.find(edge => edge.startNode === client.index)) {
        leftClients.push(client);
      } else if (
        edges.find(
          edge => edge.endNode === client.index && !leftClients[client]
        )
      ) {
        rightClients.push(client);
      }
    });

    const evaluate = (client, direction) => {
      let weight = 0;
      let foundServer = false;
      let targetNode = client;

      while (!foundServer) {
        if (targetNode.type === "server") {
          foundServer = true;
          break;
        }

        if (direction === "left") {
          const paths = edges.filter(e => e.startNode === targetNode.index);
          const bestPath = this.getMaxVal(paths, "endNode");

          if (!bestPath) {
            break;
          }

          weight = weight + bestPath.weight;
          targetNode = nodes.find(node => node.index === bestPath.endNode);
        } else {
          const paths = edges.filter(e => e.endNode === targetNode.index);
          const bestPath = this.getMaxVal(paths, "endNode");

          if (!bestPath) {
            break;
          }

          weight = weight + bestPath.weight;
          targetNode = nodes.find(node => node.index === bestPath.startNode);
        }
      }
      return weight;
    };

    const leftDistances = leftClients.map(client => evaluate(client, "left"));
    const rightDistances = rightClients.map(client =>
      evaluate(client, "right")
    );
    return [...leftDistances, ...rightDistances];
  }

  findOptimal() {
    const { routers, clients } = this;

    let minLatency;

    routers.forEach((router, index) => {
      this.fillNodes(clients, routers, index);
      const max = Math.max(...this.findDistances());
      if (!minLatency) {
        minLatency = max;
      } else if (max < minLatency) {
        minLatency = max;
      }
    });

    console.log(minLatency);
  }
}

const init = async () => {
  const graph = new Graph();
  await graph.readAndInitData();
  graph.findOptimal();
};

init();
