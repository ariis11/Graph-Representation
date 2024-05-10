import Panel from "./Panel";


export default function NodeInfo({ node }) {
    debugger;
    return (
        <div className="node-info">
            <Panel title="Module Information" initiallyDeployed={true}>
                Label: {node.label} <br/>
                Description: {node.description}
            </Panel>
        </div>
    );
}