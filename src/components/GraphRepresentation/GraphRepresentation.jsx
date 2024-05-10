import React, { useState, useRef } from 'react';

import { SigmaContainer, ControlsContainer, ZoomControl, FullScreenControl } from "@react-sigma/core";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";

import "@react-sigma/core/lib/react-sigma.min.css";
import './GraphRepresentation.css';

import MyGraph from './MyGraph';
import GraphEventsController from '../Controllers/GraphEventsController';
import GraphSettingsController from '../Controllers/GraphSettingsController';
import GraphDataController from '../Controllers/GraphDataController';
import Panels from '../Panels/Panels';
import NodeInfo from '../Panels/NodeInfo';

export default function GraphRepresentation({ data }) {
  console.log('GraphRepresentation rendered');
  const sigmaRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pathData, setPathData] = useState(null);
  const [primaryNodeAttributes, setPrimaryNodeAttributes] = useState(null);
  const [primaryEdgeAttributes, setPrimaryEdgeAttributes] = useState(null);
  const [filters, setFilters] = useState({
    paths: {},
    nodes: {},
    edges: {},
    options: { explicitEdges: false, extraNodesIncoming: false, extraNodesOutcoming: false, globalMode: true, depth: 1, neighbourDirection: 'incoming' },
    explicitEdges: {},
    overlappingEdges: {}
  });

  return (
    <SigmaContainer
      style={{ height: "100vh", width: "100vw" }}
      settings={{
        defaultEdgeType: "arrow",
        renderEdgeLabels: true,
        zIndex: true,
      }}
      ref={sigmaRef}
    >
      <MyGraph data={data} onGraphReady={(data) => {
        setFilters(data.filters);
        setPathData(data.pathData);
      }} />
      {!pathData && <div className="spinner" />}
      <ControlsContainer position={"bottom-left"}>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control
          autoRunFor={10000}
          settings={{
            edgeWeightInfluence: 0.1,
            gravity: 10,
            slowDown: 10
          }}
        />
      </ControlsContainer>
      {selectedNode && <NodeInfo node={filters.nodes[selectedNode]} />}
      <Panels filters={filters} setFilters={setFilters} pathData={pathData} setPrimaryNodeAttributes={setPrimaryNodeAttributes} />
      <GraphEventsController onHoveredNode={setHoveredNode} onSelectedNode={setSelectedNode} filters={filters} primaryNodeAttributes={primaryNodeAttributes} setPrimaryNodeAttributes={setPrimaryNodeAttributes} primaryEdgeAttributes={primaryEdgeAttributes} setPrimaryEdgeAttributes={setPrimaryEdgeAttributes} />
      <GraphSettingsController hoveredNode={hoveredNode} />
      <GraphDataController filters={filters} />
    </SigmaContainer>
  );
};
