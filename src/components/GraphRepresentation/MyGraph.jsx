import { useEffect } from 'react';
import "@react-sigma/core/lib/react-sigma.min.css";
import { useLoadGraph } from "@react-sigma/core";
import { MultiDirectedGraph } from "graphology";

export default function MyGraph({ data, onGraphReady }) {
  console.log('MyGraph rendered');
  const loadGraph = useLoadGraph();

  const colors = [
    "#5d4c86", "#946aa2", "#c3a5b4", "#d30b94", "#f07cab",
    "#772b9d", "#b732cc", "#2f2aa0", "#f47a22", "#ffc413",
    "#632819", "#96341c", "#c56133", "#e68f66", "#ffcba5",
    "#991919", "#f22020", "#3750db", "#277da7", "#37294f",
    "#3998f5", "#29bdab", "#235b54", "#8ad8e8", "#228c68",
    "#0ec434", "#7dfc00", "#fcff5d", "#888a3e", "#201923"
  ];

  let currentIndex = 0;
  function assignNextColor() {
    const color = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
    return color;
  }

  useEffect(() => {
    const graph = new MultiDirectedGraph();
    const paths = {};
    const nodes = {};
    const edges = {};
    const overlappingEdges = [];
    const explicitEdges = {};

    const pathData = {};
    const pathNeighbours = {};

    // Adding nodes to a graph
    data.nodes.forEach(node => {
      graph.addNode(
        node.key, {
        x: Math.random(),
        y: Math.random(),
        label: node.label,
        size: 4,
        color: "#B70805"
      });
      nodes[node.key] = { 
        type: null, 
        label: node.label,
        description: node.description,
        primaryColor: "#636363", 
        incoming: new Set([]), 
        outcoming: new Set([]),
        incomingExplicit: new Set([]),
        outcomingExplicit: new Set([])
      };
    });

    // Adding edges to a graph
    data.edges.forEach(edge => {
      const key = `${edge.source}_${edge.target}`;
      if (!graph.edges().includes(key)) {
        graph.addEdgeWithKey(
          key,
          edge.source,
          edge.target,
          {
            label: "this is a label"
          }
        );
        edges[key] = false;
        nodes[edge.source].outcoming.add(edge.target);
        nodes[edge.target].incoming.add(edge.source);
        pathNeighbours[edge.source] === undefined ?
          pathNeighbours[edge.source] = new Set([edge.target]) :
          pathNeighbours[edge.source].add(edge.target);
        pathNeighbours[edge.target] === undefined ?
          pathNeighbours[edge.target] = new Set([edge.source]) :
          pathNeighbours[edge.target].add(edge.source);
      }
    });

    // Iterating throuh paths from data to fill paths, explicitEdges and pathData
    data.paths.forEach(path => {
      const color = assignNextColor();
      let neighbourSet = new Set();

      paths[path.title] = { show: false, color: color };

      pathData[path.title] = {
        color: color,
        nodes: [],
        neighbourNodes: [],
        edges: [],
        explicitEdges: []
      };
      path.explicitEdges.forEach(explicitEdge => {
        const key = `${explicitEdge.source}_${explicitEdge.target}`;
        const hasEdge = graph.hasEdge(key);
        if (!hasEdge) {
          graph.addEdgeWithKey(
            key,
            explicitEdge.source,
            explicitEdge.target
          );
        } else {
          overlappingEdges.push(key);
        }
        nodes[explicitEdge.source].outcomingExplicit.add(explicitEdge.target);
        nodes[explicitEdge.target].incomingExplicit.add(explicitEdge.source);
        explicitEdges[key] = false;
        pathData[path.title].explicitEdges.push(key);
      });
      path.nodes.forEach(node => {
        nodes[node].primaryColor = color;
        pathData[path.title].nodes.push(node);

        if (pathNeighbours[node]) {
          neighbourSet = new Set([...neighbourSet, ...pathNeighbours[node]]);
        }
      });
      path.nodes.forEach(node => {
        neighbourSet.delete(node);
      });
      pathData[path.title].neighbourNodes = [...neighbourSet];
      neighbourSet.clear();
    });

    loadGraph(graph);

    debugger;
    onGraphReady(({ filters: { paths: paths, nodes: nodes, edges: edges, options: { explicitEdges: false, extraNodesIncoming: false, extraNodesOutcoming: false, globalMode: true, depth: 1, neighbourDirection: 'incoming' }, explicitEdges: explicitEdges, overlappingEdges: overlappingEdges }, pathData: pathData }));
  }, [loadGraph, data]);

  return null;
};