import { useSigma } from "@react-sigma/core";
import { useEffect } from "react";

export default function GraphDataController({ data, filters, children }) {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  useEffect(() => {
    if (filters.options.globalMode) {
      graph.forEachNode((node) => {
        graph.setNodeAttribute(node, "hidden", false);
        graph.setNodeAttribute(node, "color", "#B70805");
      });
      graph.forEachEdge((edge) => {
        graph.setEdgeAttribute(edge, "hidden", false);
        graph.setEdgeAttribute(edge, "color", null);

        if (filters.explicitEdges[edge] !== undefined) {
          if (filters.options.explicitEdges) {
            graph.setEdgeAttribute(edge, "color", filters.nodes[edge.substring(0, edge.indexOf('_'))].primaryColor);
            graph.setEdgeAttribute(edge, "hidden", false);
          } else if (!filters.options.explicitEdges && !filters.overlappingEdges[edge]) {
            graph.setEdgeAttribute(edge, "hidden", true);
          }
        }
      });
    } else {
      debugger;
      graph.forEachNode((node) => {
        switch (filters.nodes[node]?.type) {
          case 'primary':
            graph.setNodeAttribute(node, "hidden", false);
            graph.setNodeAttribute(node, "color", filters.nodes[node]?.primaryColor);
            break;
          case 'secondary':
            let flag = false;
            if (filters.options.extraNodesIncoming) {
              filters.nodes[node].outcoming.forEach(outcomingNode => {
                if (filters.nodes[outcomingNode].type === 'primary') {
                  flag = true;
                }
              });
            }
            if (filters.options.extraNodesOutcoming) {
              filters.nodes[node].incoming.forEach(incomingNode => {
                if (filters.nodes[incomingNode].type === 'primary') {
                  flag = true;
                }
              });
            }
            if (flag) {
              graph.setNodeAttribute(node, "hidden", false);
              graph.setNodeAttribute(node, "color", null);
            } else {
              graph.setNodeAttribute(node, "hidden", true);
            }
            break;
          case null:
            graph.setNodeAttribute(node, "hidden", true);
            break;
          default:
            break;
        }
      });

      graph.forEachEdge((edge) => {
        graph.setEdgeAttribute(edge, "hidden", !filters.edges[edge]);
        graph.setEdgeAttribute(edge, "color", null);

        if (filters.explicitEdges[edge] !== undefined) {
          if (filters.explicitEdges[edge] && filters.options.explicitEdges) {
            graph.setEdgeAttribute(edge, "color", filters.nodes[edge.substring(0, edge.indexOf('_'))].primaryColor);
            graph.setEdgeAttribute(edge, "hidden", false);
          } else if (!filters.explicitEdges[edge] && !filters.overlappingEdges[edge]) {
            graph.setEdgeAttribute(edge, "hidden", true);
          }
        }
      });
    }
  }, [graph, filters]);

  return <>{children}</>;
};