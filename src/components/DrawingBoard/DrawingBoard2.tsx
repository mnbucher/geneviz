import * as React from 'react';

import {GraphView, IEdge, INode} from 'react-digraph';
import './DrawingBoard.css';
import GraphConfig, {
    EMPTY_EDGE,
    STANDARD_EDGE,
    VNF_NODE
} from "../../constants/GraphConfig2";
import {DrawingBoardState, SFCPackageState, StoreState} from "../../types";
import {getVNFD, updateEdges, updateNodes} from "../../actions";
import {connect} from "react-redux";
import {Dispatch} from "redux"; // Configures node/edge types

class DrawingBoard extends React.Component<{ getVNFD: any, updateEdges: any, updateNodes: any, sfcPackageState: SFCPackageState, drawingBoardState: DrawingBoardState }> {
    GraphView: any;

    constructor(props: any) {
        super(props);

        this.GraphView = React.createRef();
    }

    // Helper to find the index of a given node
    getNodeIndex(searchNode: INode | any) {
        /*return this.state.graph.nodes.findIndex((node: INode) => {
            return node[NODE_KEY] === searchNode[NODE_KEY];
        });*/
    }

    // Helper to find the index of a given edge
    getEdgeIndex(searchEdge: IEdge) {
        /*return this.state.graph.edges.findIndex((edge: IEdge) => {
            return edge.source === searchEdge.source && edge.target === searchEdge.target;
        });*/
    }


    // Called by 'drag' handler, etc..
    // to sync updates from D3 with the graph
    onUpdateNode = (viewNode: INode) => {
        console.log("called: onUpdateNode");
        /*const graph = this.state.graph;
        const i = this.getNodeIndex(viewNode);

        graph.nodes[i] = viewNode;
        this.setState({graph});*/
    }

    // Node 'mouseUp' handler
    onSelectNode = (viewNode: INode | null) => {
        console.log("called: onSelectNode");
        /*// Deselect events will send Null viewNode
        this.setState({selected: viewNode});*/
    }

    // Edge 'mouseUp' handler
    onSelectEdge = (viewEdge: IEdge) => {
        console.log("called: onSelectEdge");
        /*this.setState({selected: viewEdge});*/
    }

    // Updates the graph with a new node
    onCreateNode = (x: number, y: number) => {
        console.log("called: onCreateNode");
        /*const graph = this.state.graph;

        // This is just an example - any sort of logic
        // could be used here to determine node type
        // There is also support for subtypes. (see 'sample' above)
        // The subtype geometry will underlay the 'type' geometry for a node
        const type = Math.random() < 0.25 ? VNF_NODE : CONNECTION_NODE;

        const viewNode = {
            id: Date.now(),
            title: '',
            type,
            x,
            y
        };

        graph.nodes = [...graph.nodes, viewNode];
        this.setState({graph});*/
    }

    // Deletes a node from the graph
    onDeleteNode = (viewNode: INode, nodeId: string, nodeArr: INode[]) => {
        console.log("called: onDeleteNode");
        /*const graph = this.state.graph;
        // Delete any connected edges
        const newEdges = graph.edges.filter((edge: IEdge, i: any) => {
            return edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY];
        });
        graph.nodes = nodeArr;
        graph.edges = newEdges;

        this.setState({graph, selected: null});*/
    }

    // Creates a new node between two edges
    onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
        console.log("called: onCreateEdge");
        /*const graph = this.state.graph;
        // This is just an example - any sort of logic
        // could be used here to determine edge type

        const viewEdge = {
            source: sourceViewNode[NODE_KEY],
            target: targetViewNode[NODE_KEY],
            STANDARD_EDGE
        };

        // Only add the edge when the source node is not the same as the target
        if (viewEdge.source !== viewEdge.target) {
            graph.edges = [...graph.edges, viewEdge];
            this.setState({
                graph,
                selected: viewEdge
            });
        }*/
    }

    // Called when an edge is reattached to a different target.
    onSwapEdge = (sourceViewNode: INode, targetViewNode: INode, viewEdge: IEdge) => {
        console.log("called: onSwapEdge");
        /*const graph = this.state.graph;
        const i = this.getEdgeIndex(viewEdge);
        const edge = JSON.parse(JSON.stringify(graph.edges[i]));

        edge.source = sourceViewNode[NODE_KEY];
        edge.target = targetViewNode[NODE_KEY];
        graph.edges[i] = edge;
        // reassign the array reference if you want the graph to re-render a swapped edge
        graph.edges = [...graph.edges];

        this.setState({
            graph,
            selected: edge
        });*/
    }

    // Called when an edge is deleted
    onDeleteEdge = (viewEdge: IEdge, edges: IEdge[]) => {
        console.log("called: onDeleteEdge");
        /*const graph = this.state.graph;
        graph.edges = edges;
        this.setState({
            graph,
            selected: null
        });*/
    }

    onUndo = () => {
        console.log("called: onUndo");
        /*// Not implemented
        console.warn('Undo is not currently implemented in the example.');
        // Normally any add, remove, or update would record the action in an array.
        // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
        // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
        // into the edges array at position i.*/
    }

    onCopySelected = () => {
        console.log("called: onCopySelected");
       /* if (this.state.selected.source) {
            console.warn('Cannot copy selected edges, try selecting a node instead.');
            return;
        }
        const x = this.state.selected.x + 10;
        const y = this.state.selected.y + 10;
        this.setState({
            copiedNode: {...this.state.selected, x, y}
        });*/
    }

    onPasteSelected = () => {
        console.log("called: onPasteSelected");
        /*if (!this.state.copiedNode) {
            console.warn('No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C');
        }
        const graph = this.state.graph;
        const newNode = {...this.state.copiedNode, id: Date.now()};
        graph.nodes = [...graph.nodes, newNode];
        this.forceUpdate();*/
    }

    mockData = () => {
        const nodes: INode[] = [
            {
                id: 'start1',
                title: 'Start (0)',
                type: VNF_NODE,
            },
            {
                id: 'a1',
                title: 'Node A (1)',
                type: VNF_NODE,
                x: 258.3976135253906,
                y: 331.9783248901367
            },
            {
                id: 'a2',
                title: 'Node B (2)',
                type: VNF_NODE,
                x: 593.9393920898438,
                y: 260.6060791015625
            },
            {
                id: 'a3',
                title: 'Node C (3)',
                type: VNF_NODE,
                x: 237.5757598876953,
                y: 61.81818389892578
            },
            {
                id: 'a4',
                title: 'Node D (4)',
                type: VNF_NODE,
                x: 600.5757598876953,
                y: 600.81818389892578
            },
            {
                id: 'a5',
                title: 'Node E (5)',
                type: VNF_NODE,
                x: 50.5757598876953,
                y: 500.81818389892578
            },
            {
                id: 'a6',
                title: 'Node E (6)',
                type: VNF_NODE,
                x: 300,
                y: 600
            },
            {
                id: 'a7',
                title: 'Node F (7)',
                type: VNF_NODE,
                x: 0,
                y: 300
            }
        ];

        const edges: IEdge[] = [
            {
                handleText: '5',
                source: 'start1',
                target: 'a1',
                type: EMPTY_EDGE
            },
            {
                handleText: '5',
                source: 'a1',
                target: 'a2',
                type: EMPTY_EDGE
            },
            {
                handleText: '54',
                source: 'a2',
                target: 'a4',
                type: EMPTY_EDGE
            },
            {
                handleText: '54',
                source: 'a1',
                target: 'a3',
                type: STANDARD_EDGE
            },
            {
                handleText: '54',
                source: 'a3',
                target: 'a4',
                type: STANDARD_EDGE
            },
            {
                handleText: '54',
                source: 'a1',
                target: 'a5',
                type: STANDARD_EDGE
            },
            {
                handleText: '54',
                source: 'a4',
                target: 'a1',
                type: STANDARD_EDGE
            },
            {
                handleText: '54',
                source: 'a1',
                target: 'a6',
                type: STANDARD_EDGE
            },
            {
                handleText: '24',
                source: 'a1',
                target: 'a7',
                type: STANDARD_EDGE
            }
        ];

        if(this.props.drawingBoardState.graphViewState.graph.nodes.length == 0){
            this.props.updateNodes(nodes);
        }
        else {
            this.props.updateEdges(edges);
        }
    }

    render() {
        return (
            <div className='drawing-board'>
                <div id="graph">
                    <GraphView
                        ref={(el) => (this.GraphView = el)}
                        nodeKey={this.props.drawingBoardState.graphViewState.nodeKey}
                        nodes={this.props.drawingBoardState.graphViewState.graph.nodes}
                        edges={this.props.drawingBoardState.graphViewState.graph.edges}
                        selected={this.props.drawingBoardState.graphViewState.selected}
                        nodeTypes={GraphConfig.NodeTypes}
                        nodeSubtypes={GraphConfig.NodeSubtypes}
                        edgeTypes={GraphConfig.EdgeTypes}
                        onSelectNode={this.onSelectNode}
                        onCreateNode={this.onCreateNode}
                        onUpdateNode={this.onUpdateNode}
                        onDeleteNode={this.onDeleteNode}
                        onSelectEdge={this.onSelectEdge}
                        onCreateEdge={this.onCreateEdge}
                        onSwapEdge={this.onSwapEdge}
                        onDeleteEdge={this.onDeleteEdge}
                        onUndo={this.onUndo}
                        onCopySelected={this.onCopySelected}
                        onPasteSelected={this.onPasteSelected}
                        layoutEngineType={'VerticalTree'}
                    />
                    <button onClick={() => this.mockData()}>Mock Data</button>
                </div>
            </div>
        );
    }
}


export function mapStateToProps(state: StoreState) {
    return {
        sfcPackageState: state.sfcPackageState,
        drawingBoardState: state.userInterfaceState.drawingBoardState
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        getVNFD: (uuid: string, name: string) => {
            dispatch<any>(getVNFD(uuid, name));
        },
        updateEdges: (edges: IEdge[]) => {
            dispatch(updateEdges(edges));
        },
        updateNodes: (nodes: INode[]) => {
            dispatch(updateNodes(nodes));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawingBoard);