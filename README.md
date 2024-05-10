# Getting Started with Graph Representation application

## How to run application

In order to run this application, open it in your code editor, open terminal and run these commands:

### `npm install`

Installs the dependencies in the local node_modules folder as defined in the package.json file. By executing this command, all the packages that the project relies on are downloaded and configured, preparing the project for development or production use.

This is a necessary step before running the app if the dependencies are not yet installed or if new dependencies have been added to the project.

This command is necessary only the first time the application is started.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Structure of data file 

The structure of data file is consistent with a graph-based model where nodes represent entities and edges represent relationships or interactions. Paths (might contain explicit edges which show order of the path) provide predefined routes through the graph for analysis and visualization purposes.

#### Nodes

A list of objects, each representing a node within a graph. Each node has a unique `key`, a `label` for identification, and a `description`.

#### Edges 

A list of objects that represent the connections or relationships between the nodes. Each edge specifies a `source` and a `target` node by their keys.

#### Paths 

A list of specified paths within the graph, each containing a sequence of nodes and potentially explicit edges to show specific order of connections.

### Example:

```json
{
  "nodes": [
    {"key": "1.0", "label": "Node1", "description": "Description of Node 1"},
    {"key": "2.0", "label": "Node2", "description": "Description of Node 2"},
    {"key": "3.0", "label": "Node3", "description": "Description of Node 3"}
  ],
  "edges": [
    {"source": "1.0", "target": "2.0"},
    {"source": "1.0", "target": "3.0"}
  ],
  "paths": [
    {
      "title": "Path 1",
      "nodes": ["1.0", "2.0", "3.0"],
      "explicitEdges": [
        {"source": "1.0", "target": "2.0"},
        {"source": "2.0", "target": "3.0"}
      ]
    }
  ]
}
```

## How does the application work

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/813e7f68-7dc2-41a8-b089-e014eae81e9a)






