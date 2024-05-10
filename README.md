# Getting Started with Graph Representation

## How to Run Application

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

## Structure of Data File 

The structure of data file is consistent with a graph-based model where nodes represent entities and edges represent relationships or interactions. Paths (might contain explicit edges which show order of the path) provide predefined routes through the graph for analysis and visualization purposes.

#### Nodes

A list of objects, each representing a node within a graph. Each node has a unique `key`, a `label` for identification, and a `description`.

#### Edges 

A list of objects that represent the connections or relationships between the nodes. Each edge specifies a `source` and a `target` node by their keys.

#### Paths 

A list of specified paths within the graph, each containing a sequence of nodes and potentially explicit edges. A list of 30 different colors are assigned to different paths (if there are more than 30 paths, same colors are used). Path's nodes and explicit edges are colored by this color.

#### Explicit Edges 

A list of edges which are defined in path's scope. These edges show specific order of connections.

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

## How the Application Works

This section provides a step-by-step guide on the core functionalities of the application.

### Uploading Data

- **Initiate Upload:** Click the Choose File button to begin the upload process.
- **Select File:** Browse and select your desired data file. Ensure the file adheres to the specified structure mentioned earlier in this document.
- **Upload Time:** Note that uploading larger files may take additional time due to increased processing requirements.

### Position of Nodes

Node positions within the graph are initially set at random. Upon loading the graph, these positions are dynamically updated based on their interconnecting edges. The following outlines the behavior of the node positioning feature:

- **Initial Positioning:** Upon loading, node positions are automatically adjusted for the first 10 seconds based on the graph's structural connections.
- **Visualization:** Below is an example of how the graph appears after the default positioning period:

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/813e7f68-7dc2-41a8-b089-e014eae81e9a)

- **Control Playback:**
  - **Access Control:** Locate the Play/Stop button at the bottom of the control section.
  - **Manage Positioning:** Use this button to start or stop the automatic positioning of nodes. The button's label toggles between Play and Stop depending on the current state of positioning

### Control Section

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/a9d72269-3481-42ee-bcec-8d0676048314)

The Control Section is designed to manage the viewing options and the automatic positioning of nodes within the graph.

- **Button 1** - zooms in (also possible with mouse)  
- **Button 2** - zooms out (also possible with mouse)  
- **Button 3** - returns to the starting position  
- **Button 4** - enables/disables full screen mode  
- **Button 5** - starts/stops default positioning of nodes  

### Paths Section

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/00c6adfc-39f5-4055-812b-68f5e239cf94)

Paths section displays specific paths within the graph, which can be activated by selecting the corresponding checkboxes.

- **Selecting Paths:** Activate a checkbox to display all nodes and edges associated with that path. When multiple paths are selected, the graph displays all corresponding nodes and edges.
- **Explicit Edges:** These edges, which indicate the sequence of nodes, are not shown by default but can be made visible through the options section.
- **Check/Uncheck All:** These buttons allow you to select or deselect all listed paths with a single click.
- **Modes:**
  - **Global Mode:** This default mode is active when no paths are selected and displays all nodes in a single color, shown here:

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/cd221619-0d9a-4339-a971-9816e78d6bd8)

  - **Path Mode:** Activated when one or more paths are selected, this mode highlights nodes in colors specific to each path:

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/bdae0580-429c-4da1-a747-aa7defb2156a)

### Options Section

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/1b44471e-bd4f-4e00-a677-4e603dedfec2)

The Options Section provides controls for enhancing the graphical display by showing explicit edges and neighboring nodes that are not part of the selected paths.

- **Ordering of Edges:**
  - **Explicit Edges:** These can be displayed by checking the "Ordering" checkbox, which reveals the sequence of nodes within a path:

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/9162b6ea-1c4a-4e40-a074-f98db31358fa)

- **Neighboring Nodes:**
  - Neighbors are nodes connected by edges to nodes within the selected paths but are not themselves part of any selected path.
  - **Types of Neighbors:**
    - **Dependent Neighbors:** These nodes depend on the selected path nodes. When the "Dependent neighbors" checkbox is selected, these nodes are highlighted in grey.
    - **Dependency Neighbors:** These nodes are those on which the selected path nodes depend. When the "Dependency neighbors" checkbox is selected, these nodes too are highlighted in grey.

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/bb2af944-5075-4a12-a8bc-b6aaa1ca9f00)

### Search Bar

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/9fadd1ac-7773-470e-9973-e7a7258c0ec5)

The search bar enables users to quickly locate any node within the graph by its label. Here’s how it works:

- **Node Search:** Enter the label of the node you wish to find in the search bar.
- **Highlight and Zoom:** Upon selection, the graph will automatically highlight the chosen node. Additionally, the view zooms in on this node to facilitate closer inspection.

This feature is designed to streamline navigation and improve efficiency when working with complex graph structures.

### Functions Section

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/88890fcb-a13a-49d1-afcd-9c8e21a9552a)

Functions section offers a suite of tools designed for precise control over node positioning and interaction. Below is an overview of each control:

- **Repositioning Nodes:**
  - **Start Repositioning:** Activates custom positioning for currently visible nodes.
  - **Stop Repositioning:** Deactivates the custom positioning.

Unlike default positioning, which affects all nodes, these controls only apply to nodes that are currently displayed.

- **Node Interaction Settings:** 
  - **Depth Input Field:** Defines the depth level, determining how many nodes are highlighted when a node is clicked.
  - **Neighbor Node Highlighting:**
    - **Dependants Checkbox:** When checked, dependant neighbor nodes of a selected node are highlighted.
    - **Dependencies Checkbox:** When checked, dependency neighbor nodes of a selected node are highlighted.
   
These settings collectively determine the scope of node highlighting upon interaction.

- **Path Display:**
  - **Show Searched Node Paths:** A sliding checkbox that, when activated, displays a list of all paths that include the searched node.

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/35547259-ca17-4a68-a23f-269c14563561)

This section provides essential tools for managing how nodes and their relationships are visualized and interacted with within the graph.

### Other Functionality

This section details additional interactive features within the graph environment.

- **Node Interaction:**
  - **Node Selection:** Clicking on a node highlights the edges between that node and its neighbors. The depth of neighbor nodes highlighted is determined by the "depth" input field in the Functions Section.
  - **Neighbor Type Selection:** The type of neighbors highlighted (dependants or dependencies) is controlled by the checkboxes in the Functions Section.
  - **Background Click:** Clicking on the background resets the view, removing any highlight from the edges.

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/e6e922ed-bc28-419d-b508-d29a5098ae82)

- **Node Information:**
  - **Right-Click on Node:** Right-clicking on a node displays the node's label and description in the top left corner of the interface.
  - **Right-Click on Background:** Right-clicking on the background removes node information section.

![image](https://github.com/ariis11/Graph-Representation/assets/47053735/52b4638b-f843-46ac-87c1-26a58d089244)



