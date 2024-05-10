import { useSigma } from "@react-sigma/core";
import { useEffect } from "react";

import useDebounce from "../../use-debounce";


export default function GraphSettingsController({ children, hoveredNode }) {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  // Here we debounce the value to avoid having too much highlights refresh when
  // moving the mouse over the graph:
  const debouncedHoveredNode = useDebounce(hoveredNode, 40);

  useEffect(() => {
    sigma.setSetting(
      "edgeReducer",
      debouncedHoveredNode
        ? (edge, data) =>
            graph.hasExtremity(edge, debouncedHoveredNode)
              ? { ...data, label: "" }
              : { ...data }
        : null,
    );
  }, [debouncedHoveredNode]);

  return <>{children}</>;
};