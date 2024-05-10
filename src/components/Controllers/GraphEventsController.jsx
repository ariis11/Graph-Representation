import { useEffect } from 'react';

import { useRegisterEvents, useSigma } from "@react-sigma/core";

export default function GraphEventsController({ onHoveredNode, onSelectedNode, filters, primaryNodeAttributes, setPrimaryNodeAttributes, primaryEdgeAttributes, setPrimaryEdgeAttributes }) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();

  function generateSurroundingNodes(node, depthLevel, passedFilters) {
    let surroundingNodes = new Set();
    let highlightedEdges = new Set();

    if (passedFilters.options.neighbourDirection === 'incoming' || passedFilters.options.neighbourDirection === 'both') {
      if (passedFilters.options.globalMode) {
        surroundingNodes = new Set(passedFilters.nodes[node]?.incoming);
        surroundingNodes.forEach(neighbourNode => {
          highlightedEdges.add(`${neighbourNode}_${node}`);
        });
      } else {
        passedFilters.nodes[node]?.incoming.forEach(neighbour => {
          if (passedFilters.nodes[neighbour].type === 'primary' || (passedFilters.nodes[neighbour].type === 'secondary' && passedFilters.options.extraNodesIncoming === true)) {
            surroundingNodes.add(neighbour);
            highlightedEdges.add(`${neighbour}_${node}`);
          }
        });
      }
      if (passedFilters.options.explicitEdges) {
        passedFilters.nodes[node]?.incomingExplicit.forEach(neighbour => {
          if (passedFilters.nodes[neighbour].type === 'primary' || (passedFilters.nodes[neighbour].type === 'secondary' && passedFilters.options.extraNodesIncoming === true) || passedFilters.options.globalMode) {
            surroundingNodes.add(neighbour);
            highlightedEdges.add(`${neighbour}_${node}`);
          }
        });
      }
    }
    if (passedFilters.options.neighbourDirection === 'outcoming' || passedFilters.options.neighbourDirection === 'both') {
      if (passedFilters.options.globalMode) {
        surroundingNodes = new Set(passedFilters.nodes[node]?.outcoming);
        surroundingNodes.forEach(neighbourNode => {
          highlightedEdges.add(`${node}_${neighbourNode}`);
        });
      } else {
        passedFilters.nodes[node]?.outcoming.forEach(neighbour => {
          if (passedFilters.nodes[neighbour].type === 'primary' || (passedFilters.nodes[neighbour].type === 'secondary' && passedFilters.options.extraNodesOutcoming === true)) {
            surroundingNodes.add(neighbour);
            highlightedEdges.add(`${node}_${neighbour}`);
          }
        });
      }
      if (passedFilters.options.explicitEdges) {
        passedFilters.nodes[node]?.outcomingExplicit.forEach(neighbour => {
          if (passedFilters.nodes[neighbour].type === 'primary' || (passedFilters.nodes[neighbour].type === 'secondary' && passedFilters.options.extraNodesOutcoming === true) || passedFilters.options.globalMode) {
            surroundingNodes.add(neighbour);
            highlightedEdges.add(`${node}_${neighbour}`);
          }
        });
      }
    }

    depthLevel = depthLevel - 1;

    if (depthLevel > 0) {
      if (passedFilters.options.neighbourDirection === 'incoming' || passedFilters.options.neighbourDirection === 'both') {
        passedFilters.nodes[node].incoming.forEach(newNode => {
          const { newNodes, newEdges } = generateSurroundingNodes(newNode, depthLevel, passedFilters);
          if (newNodes) {
            surroundingNodes = new Set([...surroundingNodes, ...newNodes]);
          }
          if (newEdges) {
            highlightedEdges = new Set([...highlightedEdges, ...newEdges]);
          }
        });
        if (passedFilters.options.explicitEdges) {
          passedFilters.nodes[node].incomingExplicit.forEach(newNode => {
            const { newNodes, newEdges } = generateSurroundingNodes(newNode, depthLevel, passedFilters);
            if (newNodes) {
              surroundingNodes = new Set([...surroundingNodes, ...newNodes]);
            }
            if (newEdges) {
              highlightedEdges = new Set([...highlightedEdges, ...newEdges]);
            }
          });
        }
      }
      if (passedFilters.options.neighbourDirection === 'outcoming' || passedFilters.options.neighbourDirection === 'both') {
        passedFilters.nodes[node].outcoming.forEach(newNode => {
          debugger;
          const { newNodes, newEdges } = generateSurroundingNodes(newNode, depthLevel, passedFilters);
          if (newNodes) {
            surroundingNodes = new Set([...surroundingNodes, ...newNodes]);
          }
          if (newEdges) {
            highlightedEdges = new Set([...highlightedEdges, ...newEdges]);
          }
        });
        if (passedFilters.options.explicitEdges) {
          passedFilters.nodes[node].outcomingExplicit.forEach(newNode => {
            const { newNodes, newEdges } = generateSurroundingNodes(newNode, depthLevel, passedFilters);
            if (newNodes) {
              surroundingNodes = new Set([...surroundingNodes, ...newNodes]);
            }
            if (newEdges) {
              highlightedEdges = new Set([...highlightedEdges, ...newEdges]);
            }
          });
        }
      }
    }

    debugger;
    return { newNodes: surroundingNodes, newEdges: highlightedEdges };
  }

  const handleNodeClick = (nodeKey, passedFilters) => {
    const nodesAttributes = {};
    const edgeAttributes = {};

    const { newNodes: surroundingNodes, newEdges: highlightedEdges } = generateSurroundingNodes(nodeKey, filters.options.depth, passedFilters);

    if (!surroundingNodes) {
      return null;
    }

    graph.forEachNode((node, attributes) => {
      nodesAttributes[node] = { ...attributes };
      if (surroundingNodes.has(node) || node === nodeKey) {
        graph.setNodeAttribute(node, "hidden", false);
        graph.setNodeAttribute(node, "color", passedFilters.nodes[node].primaryColor);
      }
    });

    graph.forEachEdge((edge, attributes) => {
      const index = edge.indexOf('_');
      const firstNode = edge.substring(0, index);

      debugger;
      if (passedFilters.explicitEdges[edge] && !passedFilters.edges[edge]) {
        edgeAttributes[edge] = { ...attributes, 'size': 1, 'color': passedFilters.nodes[firstNode].primaryColor };
      } else {
        edgeAttributes[edge] = { ...attributes, 'size': 1 };
      }

      if (highlightedEdges.has(edge)) {
        graph.setEdgeAttribute(edge, 'size', 4);
        graph.setEdgeAttribute(edge, 'color', passedFilters.nodes[firstNode].primaryColor);
      }
    });

    if (primaryNodeAttributes === null) {
      setPrimaryNodeAttributes(nodesAttributes);
    }
    if (primaryEdgeAttributes === null) {
      setPrimaryEdgeAttributes(edgeAttributes);
    }
    sigma.refresh();
  };

  function handleStageClick(nodesAttributes, edgeAttributes) {
    if (nodesAttributes) {
      graph.forEachNode((node) => {
        graph.setNodeAttribute(node, "hidden", nodesAttributes[node].hidden);
        graph.setNodeAttribute(node, "color", nodesAttributes[node].color);
      });

      setPrimaryNodeAttributes(null);
    }

    if (edgeAttributes) {
      graph.forEachEdge((edge) => {
        graph.setEdgeAttribute(edge, 'size', 1);
        graph.setEdgeAttribute(edge, 'color', edgeAttributes[edge].color);
      });

      setPrimaryNodeAttributes(null);
    }
  }

  useEffect(() => {
    registerEvents({
      clickNode: (event) => handleNodeClick(event.node, filters),
      rightClickNode: (event) => onSelectedNode(event.node),
      enterNode: (event) => onHoveredNode(event.node),
      leaveNode: () => onHoveredNode(null),
      clickStage: () => handleStageClick(primaryNodeAttributes, primaryEdgeAttributes),
      rightClickStage: () => onSelectedNode(null),
    });
  }, [registerEvents, filters, primaryNodeAttributes, primaryEdgeAttributes]);

  return null;
};