import { useState } from "react";
import { useSigma } from "@react-sigma/core";
import FA2Layout from 'graphology-layout-forceatlas2/worker';

import Panel from "./Panel";
import SwitchInput from "./SwitchInput";

export default function FunctionPanel({ setFilters, filters, pathData, searchedNode }) {
    const [showPathList, setShowPathList] = useState(false);
    const [nodesStorage, setNodesStorage] = useState(null);
    const [edgesStorage, setEdgesStorage] = useState(null);
    const [layout, setLayout] = useState(null);

    let pathList = [];


    const sigma = useSigma();

    function handleSearchedNodePaths() {
        setShowPathList(prevValue => !prevValue);
    }

    function startFA2() {
        const graph = sigma.getGraph();
        const tempNodeStorage = {};
        const tempEdgeStorage = {};
        graph.forEachEdge(edge => {
            const index = edge.indexOf('_');
            const firstNode = edge.substring(0, index);
            const secondNode = edge.substring(index + 1);

            if (filters.nodes[firstNode].type === null || filters.nodes[secondNode].type === null) {
                tempEdgeStorage[edge] = graph.getEdgeAttributes(edge);
            }
        });
        setEdgesStorage(tempEdgeStorage);
        graph.forEachNode(node => {
            if (filters.nodes[node].type === null) {
                tempNodeStorage[node] = graph.getNodeAttributes(node);
                graph.dropNode(node);
            }
        });
        setNodesStorage(tempNodeStorage);
        sigma.refresh();
        const tempLayout = new FA2Layout(graph);
        tempLayout.start({ settings: { edgeWeightInfluence: 0.1, gravity: 10, slowDown: 10, } });
        setLayout(tempLayout);
    }

    function stopFA2() {
        if (layout) {
            layout.stop();
            const graph = sigma.getGraph();
            Object.keys(nodesStorage).forEach(key => {
                const value = nodesStorage[key];
                graph.addNode(
                    key, {
                    x: value.x,
                    y: value.y,
                    label: value.label,
                    size: value.size,
                    color: value.color
                });
                graph.setNodeAttribute(key, "hidden", true);
            });
            Object.keys(edgesStorage).forEach(key => {
                const index = key.indexOf('_');
                const firstNode = key.substring(0, index);
                const secondNode = key.substring(index + 1);

                graph.addEdgeWithKey(
                    key,
                    firstNode,
                    secondNode
                );
            });
            sigma.refresh();
            setNodesStorage(null);
            setLayout(null);
        }
    }

    function getSearchedNodePaths(node) {
        const paths = [];

        Object.keys(pathData).forEach(path => {
            if (pathData[path].nodes.includes(node)) {
                paths.push(path);
            }
        });

        return paths;
    }

    function handleDepthChange(event) {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                options: {
                    ...prevFilters.options,
                    depth: event.target.value
                }
            }
        });
    }

    function handleCheckboxChange(event) {
        setFilters(prevFilters => {
            debugger;
            let newNeighbourDirection = null;
            if (event.currentTarget.checked && prevFilters.options.neighbourDirection) {
                newNeighbourDirection = 'both';
            } else if (event.currentTarget.checked && !prevFilters.options.neighbourDirection) {
                newNeighbourDirection = event.target.value;
            } else if (!event.currentTarget.checked && prevFilters.options.neighbourDirection === 'both') {
                if (event.target.value === 'incoming') {
                    newNeighbourDirection = 'outcoming';
                } else {
                    newNeighbourDirection = 'incoming';
                }
            }
            return {
                ...prevFilters,
                options: {
                    ...prevFilters.options,
                    neighbourDirection: newNeighbourDirection
                }
            }
        });

        const graph = sigma.getGraph();
        graph.forEachEdge((edge) => {
            graph.setEdgeAttribute(edge, 'size', 1);
        });
    }

    if (showPathList) {
        pathList = getSearchedNodePaths(searchedNode);
    }

    return (
        <Panel title="Functions">
            <ul style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <li key="neighbourDirection" className="space-between">
                    <div>
                        <button className="btn" onClick={startFA2}>Start repositioning</button>
                    </div>
                    <div>
                        <button className="btn" onClick={stopFA2}>Stop repositioning</button>
                    </div>
                </li>
                <li key="depth" className="space-between">
                    <p>Depth level:</p>
                    <input type="number" value={filters.options.depth} onChange={handleDepthChange} />
                </li>
                <li key="neighbourDirection" className="space-between">
                    <div>
                        <input type="checkbox" id="incoming" name="neighbourDirection" value="incoming" checked={filters.options.neighbourDirection === 'incoming' || filters.options.neighbourDirection === 'both'} onChange={handleCheckboxChange} />
                        <label htmlFor="incoming">Dependants</label>
                    </div>
                    <div>
                        <input type="checkbox" id="outcoming" name="neighbourDirection" value="outcoming" checked={filters.options.neighbourDirection === 'outcoming' || filters.options.neighbourDirection === 'both'} onChange={handleCheckboxChange} />
                        <label htmlFor="outcoming">Dependencies</label>
                    </div>
                </li>
                <li key="searchedNodePaths">
                    <SwitchInput key="searchedNodePaths" text="Show searched node paths" onToggle={handleSearchedNodePaths} />
                </li>
            </ul>
            {showPathList && (
                <ul>
                    {pathList.map((path, index) => (
                        <li key={index}>{path}</li>
                    ))}
                </ul>
            )}
        </Panel>
    );
}