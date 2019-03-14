import * as React from 'react';
import './DrawingBoard.css';
import { StoreState, DrawingBoardState, SFCPackageState } from "../../types";
import { connect } from 'react-redux';
import { getVNFD, updateEdges, updateNodes} from "../../actions";
import { Dispatch } from "redux";
import { GraphView, IEdge, INode } from 'react-digraph';
import GraphConfig from "../../constants/GraphConfig";
import uuidv1 from 'uuid';

class DrawingBoard extends React.Component<{ getVNFD: any, updateEdges: any, updateNodes: any, sfcPackageState: SFCPackageState, drawingBoardState: DrawingBoardState }> {

    showAllVNFsOfSFC = () => {
        const vnfPackages = this.props.sfcPackageState.vnfPackages;
        let vnfDOM: any = [];
        vnfPackages.forEach((vnf) => {
            vnfDOM.push(<div className="drawing-board-vnf-list" key={vnf.uuid}>
                <p>{vnf.name}</p>
                <p onClick={() => this.props.getVNFD(vnf.uuid, vnf.name)}>Show Properties of VNFD</p>
            </div>)
        });
        return vnfDOM;
    }

    showVNFDProperties = () => {
        let vnfdProperties = this.props.drawingBoardState.vnfdPropertiesState;
        return (
            <div className='drawing-board-vnfd-properties'>
                <p>Number of CPUs: {vnfdProperties.numCPUs}</p>
                <p>Memory Size: {vnfdProperties.memSize}</p>
                <p>Disk Size: {vnfdProperties.diskSize}</p>
            </div>);
    }

    mockData = () => {
        const nodes: INode[] = [
            {
                id: 'asdf1',
                title: 'Node A',
                x: 258.3976135253906,
                y: 331.9783248901367,
                type: 'vnfNode',
            },
            {
                id: 'asdf2',
                title: 'Node B',
                x: 593.9393920898438,
                y: 260.6060791015625,
                type: 'vnfNode'
            },
            {
                id: 'asdf3',
                title: 'Node C',
                x: 237.5757598876953,
                y: 61.81818389892578,
                type: 'vnfNode'
            },
            {
                id: 'asdf4',
                title: 'Node D',
                x: 600.5757598876953,
                y: 600.81818389892578,
                type: 'vnfNode'
            }];

        const edges: IEdge[] = [
            {
                handleText: 'Edge 1',
                source: 'asdf1',
                target: 'asdf2',
                type: 'standardEdge'
            },
            {
                handleText: 'Edge 2',
                source: 'asdf2',
                target: 'asdf4',
                type: 'standardEdge'
            }
        ];

        this.props.updateNodes(nodes);
        this.props.updateEdges(edges);
    }

    onCreateEdge = (sourceNode: INode, targetNode: INode) => {

        console.log("Create New Edge");

        const newEdge = {
            source: sourceNode[this.props.drawingBoardState.graphViewState.nodeKey],
            target: targetNode[this.props.drawingBoardState.graphViewState.nodeKey],
            type: 'emptyEdge'
        };

        // Only add the edge when the source node is not the same as the target
        const edges = this.props.drawingBoardState.graphViewState.graph.edges;

        if (newEdge.source !== newEdge.target) {
            const newEdges = [... edges, newEdge];
            this.props.updateEdges(newEdges);
        }
    }

    onCreateNode = (x: number, y: number) => {

        console.log("Create New Node");

        const newNode = {
            id: uuidv1(),
            title: 'asdf',
            x: x,
            y: y,
            type: 'customNode'
        };

        const nodes = this.props.drawingBoardState.graphViewState.graph.nodes;
        const newNodes = [... nodes, newNode];
        this.props.updateNodes(newNodes);
    }

    onDeleteNode = (selected: any, nodeId: string, nodes: any[]) => {
        console.log("Delete Node");
    }

    onDeleteEdge = (selectedEdge: IEdge, edges: IEdge[]) => {
        console.log("Delete Edge");
    }

    onSelectEdge = (selectedEdge: IEdge) => {
        console.log("Select Edge");
        alert(selectedEdge.handleText);
    }

    onSelectNode = (node: INode | null) => {
        console.log("Select Node");
        if(node != null){
            alert(node.title);
        }
    }

    onSwapEdge = (sourceNode: INode, targetNode: INode, edge: IEdge) => {
        console.log("Swap Edge");
    }

    onUpdateNode = (node: INode) => {
        console.log("Update Node");
    }

    render() {

        /* layoutEngineType={'VerticalTree'} */

        return (
            <div className='drawing-board'>

                <div id='graph'>
                    <GraphView edges={this.props.drawingBoardState.graphViewState.graph.edges}
                               edgeTypes={GraphConfig.EdgeTypes}
                               nodeKey={this.props.drawingBoardState.graphViewState.nodeKey}
                               nodes={this.props.drawingBoardState.graphViewState.graph.nodes}
                               nodeSubtypes={GraphConfig.NodeSubtypes}
                               nodeTypes={GraphConfig.NodeTypes}
                               selected={this.props.drawingBoardState.graphViewState.selected}

                               onCreateEdge={this.onCreateEdge}
                               onCreateNode={this.onCreateNode}

                               onDeleteEdge={this.onDeleteEdge}
                               onDeleteNode={this.onDeleteNode}

                               onSelectEdge={this.onSelectEdge}
                               onSelectNode={this.onSelectNode}

                               onSwapEdge={this.onSwapEdge}
                               onUpdateNode={this.onUpdateNode}

                               layoutEngineType={'VerticalTree'}

                               />
                </div>

                {this.showAllVNFsOfSFC()}

                <button onClick={() => this.mockData()}>Mock Data</button>

                {this.showVNFDProperties()}

            </div>
        )
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