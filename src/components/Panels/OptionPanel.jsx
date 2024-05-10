import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import Panel from "./Panel";

export default function OptionPanel({ filters, setFilters }) {
    function handleAllConfigsChange(value) {
        setFilters((prevFilters) => {
            return {
                ...prevFilters,
                options: { ...prevFilters.options, explicitEdges: value, extraNodesIncoming: value, extraNodesOutcoming: value }
            }
        });
    }

    function handleConfigChange(config) {
        setFilters((prevFilters) => {
            return {
                ...prevFilters,
                options: { ...prevFilters.options, [config]: !prevFilters.options[config] }
            }
        });
    }

    return (
        <Panel title="Options">
            <p>
                <i className="text-muted">Click an option to show/hide graph elements from the network.</i>
            </p>
            <p className="buttons">
                <button className="btn" onClick={() => handleAllConfigsChange(true)} >
                    <AiOutlineCheckCircle /> Check all
                </button>{" "}
                <button className="btn" onClick={() => handleAllConfigsChange(false)} >
                    <AiOutlineCloseCircle /> Uncheck all
                </button>
            </p>
            <ul>
                <li className="caption-row" key="explicitEdges">
                    <input
                        type="checkbox"
                        checked={filters.options.explicitEdges || false}
                        onChange={() => handleConfigChange('explicitEdges')}
                        id="filter-explicitEdges"
                    />
                    <label htmlFor="filter-explicitEdges">
                        <span className="circle" style={{ background: '#767676', borderColor: '#767676' }} />{" "}
                        <div className="node-label">
                            <span>Ordering</span>
                        </div>
                    </label>
                </li>
                <li className="caption-row" key="extraNodesIncoming">
                    <input
                        type="checkbox"
                        checked={filters.options.extraNodesIncoming || false}
                        onChange={() => handleConfigChange('extraNodesIncoming')}
                        id="filter-extraNodesIncoming"
                    />
                    <label htmlFor="filter-extraNodesIncoming">
                        <span className="circle" style={{ background: '#767676', borderColor: '#767676' }} />{" "}
                        <div className="node-label">
                            <span>Dependent neighbors</span>
                        </div>
                    </label>
                </li>
                <li className="caption-row" key="extraNodesOutcoming">
                    <input
                        type="checkbox"
                        checked={filters.options.extraNodesOutcoming || false}
                        onChange={() => handleConfigChange('extraNodesOutcoming')}
                        id="filter-extraNodesOutcoming"
                    />
                    <label htmlFor="filter-extraNodesOutcoming">
                        <span className="circle" style={{ background: '#767676', borderColor: '#767676' }} />{" "}
                        <div className="node-label">
                            <span>Dependency neighbors</span>
                        </div>
                    </label>
                </li>
            </ul>
        </Panel>
    );
}