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
      // Find in .->. and .<-. directions
      edges.forEach(edge => {
        if (edge.startNode === client.index) {
          routers.add(edge.endNode);
        } else if (edge.endNode === client.index) {
          routers.add(edge.startNode);
        }
      });
    });

    this.routers = Array.from(routers);
    console.log(this.routers);
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

  findOptimal() {
    // Take one route as a server.
    // Find distance;
    const { routers, clients } = this;

    this.fillNodes(clients, routers, 2);

    console.log(this.nodes);
  }
}

const init = async () => {
  const graph = new Graph();
  await graph.readAndInitData();
  graph.findOptimal();
  // await main.writeResultData(canGetMaxHasters);
};

init();
