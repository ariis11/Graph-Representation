import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import Panel from "./Panel";

export default function PathPanel({ filters, setFilters, pathData, setPrimaryNodeAttributes }) {
    function handleAllPathsChange(value) {
        setFilters((prevFilters) => ({
            ...prevFilters,
            paths: setObjectValues(prevFilters.paths, value, 'path'),
            nodes: setObjectValues(prevFilters.nodes, value, 'node'),
            explicitEdges: setObjectValues(prevFilters.explicitEdges, value, 'explicitEdge'),
            edges: setObjectValues(prevFilters.edges, value, 'edge'),
            options: { ...prevFilters.options, globalMode: !value }
        }));
        setPrimaryNodeAttributes(null);
    }

    function handleAddPath(path) {
        setFilters(prevFilters => {
            const newNodes = { ...prevFilters.nodes };
            const newEdges = { ...prevFilters.edges };
            const newExplicitEdges = { ...prevFilters.explicitEdges };

            // Edit filters.nodes by setting path nodes to primary type
            pathData[path].nodes.forEach(node => {
                newNodes[node] = { 
                    ...prevFilters.nodes[node],
                    type: 'primary', 
                    primaryColor: pathData[path].color
                };
            });
            // Edit filters.nodes by setting path neighbouring nodes to secondary type
            pathData[path].neighbourNodes.forEach(node => {
                if (newNodes[node].type === null) {
                    newNodes[node] = { ...newNodes[node], type: 'secondary' };
                }
            });
            // Edit fiters.edges by setting them to true if target or source is in path nodes list
            Object.keys(newEdges).forEach(edge => {
                const splitEdges = edge.split("_");
                if (pathData[path].nodes.includes(splitEdges[0]) || pathData[path].nodes.includes(splitEdges[1])) {
                    newEdges[edge] = true;
                }
            });
            // Edit filters.explicitEdges by setting path explicitEdges to true
            pathData[path].explicitEdges.forEach(edge => {
                newExplicitEdges[edge] = true;
            });

            // Return newNodes, newEdges, newExplicitEdges and set filters.paths selected path show value to true
            return {
                ...prevFilters,
                paths: {
                    ...prevFilters.paths,
                    [path]: {
                        ...prevFilters.paths[path],
                        show: true
                    }
                },
                nodes: newNodes,
                edges: newEdges,
                explicitEdges: newExplicitEdges,
                options: {
                    ...prevFilters.options,
                    globalMode: (getAllSelectedPaths().length === 0 ? false : prevFilters.options.globalMode)
                }
            };
        });
        setPrimaryNodeAttributes(null);
    }

    function handleRemovePath(path) {
        let shownPaths = getAllSelectedPaths();
        shownPaths.splice(shownPaths.indexOf(path), 1);

        setFilters(prevFilters => {
            const newNodes = { ...prevFilters.nodes };
            const newEdges = { ...prevFilters.edges };
            const newExplicitEdges = setObjectValues(prevFilters.explicitEdges, false, 'explicitEdge');

            // Nodes that have to be removed (nodes and neighbours of unselected path)
            const nodesToRemove = [...pathData[path].nodes, ...pathData[path].neighbourNodes];

            // Iterating through all left paths
            shownPaths.forEach(pathTitle => {
                // If path has node that exists in nodesToRemove, remove it from there
                // Always set node to primary type
                pathData[pathTitle].nodes.forEach(node => {
                    if (nodesToRemove.includes(node)) {
                        nodesToRemove.splice(nodesToRemove.indexOf(node), 1);
                    }
                    newNodes[node] = { ...prevFilters.nodes[node], type: 'primary', primaryColor: pathData[pathTitle].color };
                });
                // If path has neighbour node that exists in nodesToRemove, remove it from there and set it to secondary type
                pathData[pathTitle].neighbourNodes.forEach(node => {
                    if (nodesToRemove.includes(node)) {
                        nodesToRemove.splice(nodesToRemove.indexOf(node), 1);
                        newNodes[node] = { ...newNodes[node], type: 'secondary' };
                    }
                });
                // Edit filters.explicitEdges by setting all path explicitEdges to false
                pathData[pathTitle].explicitEdges.forEach(edge => {
                    newExplicitEdges[edge] = true;
                });
            });

            Object.keys(newEdges).forEach(edge => {
                const splitEdges = edge.split("_");
                if (nodesToRemove.includes(splitEdges[0]) || nodesToRemove.includes(splitEdges[1])) {
                    newEdges[edge] = false;
                }
            });

            nodesToRemove.forEach(node => {
                newNodes[node] = { ...newNodes[node], type: null };
            });

            return {
                ...prevFilters,
                paths: {
                    ...prevFilters.paths,
                    [path]: {
                        ...prevFilters.paths[path],
                        show: false
                    }
                },
                nodes: newNodes,
                edges: newEdges,
                explicitEdges: newExplicitEdges,
                options: {
                    ...prevFilters.options,
                    globalMode: (shownPaths.length === 0 ? true : prevFilters.options.globalMode)
                }
            };
        });
        setPrimaryNodeAttributes(null);
    }

    function getAllSelectedPaths() {
        const shownPaths = Object.entries(filters.paths)
            .filter(([key, value]) => value.show === true)
            .map(([key, value]) => key);

            debugger;
        return shownPaths;
    }

    function setObjectValues(obj, value, objType) {
        return Object.keys(obj).reduce((newObj, key) => {
            switch (objType) {
                case 'node':
                    newObj[key] = { 
                        ...obj[key],
                        type: value ? 'primary' : null
                    };
                    break;
                case 'path':
                    newObj[key] = { show: value, color: obj[key].color };
                    break;
                default:
                    newObj[key] = value;
            }
            return newObj;
        }, {});
    };

    return (
        <Panel title="Paths">
            <p>
                <i className="text-muted">Click a path to show/hide related nodes from the network.</i>
            </p>
            <p className="buttons">
                <button className="btn" onClick={() => handleAllPathsChange(true)} >
                    <AiOutlineCheckCircle /> Check all
                </button>{" "}
                <button className="btn" onClick={() => handleAllPathsChange(false)} >
                    <AiOutlineCloseCircle /> Uncheck all
                </button>
            </p>
            <ul>
                {Object.entries(filters.paths).map(([key, value]) => {
                    return (
                        <li
                            className="caption-row"
                            key={key}
                        >
                            <input
                                type="checkbox"
                                checked={value.show || false}
                                onChange={() => value.show ? handleRemovePath(key) : handleAddPath(key)}
                                id={`path-${key}`}
                            />
                            <label htmlFor={`path-${key}`}>
                                <span className="circle" style={{ background: value.color, borderColor: value.color }} />{" "}
                                <div className="node-label">
                                    <span>{key}</span>
                                </div>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </Panel>
    );
}