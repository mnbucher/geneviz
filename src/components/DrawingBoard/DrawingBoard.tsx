import * as React from 'react';
import './DrawingBoard.css';
import {StoreState, DrawingBoardState, SFCPackageState, VNFPackage} from "../../types";
import { connect } from 'react-redux';
import {selectNodeOrEdge, getVNFDProperties, updateEdges, removeNodeFromGraph} from "../../actions";
import { Dispatch } from "redux";
import { GraphView, IEdge, INode } from 'react-digraph';
import GraphConfig from "../../constants/GraphConfig";

class DrawingBoard extends React.Component<{ selectNodeOrEdge: any, getVNFDProperties: any, updateEdges: any, removeNodeFromGraph: any, sfcPackageState: SFCPackageState, drawingBoardState: DrawingBoardState }> {

    onCreateEdge = (sourceNode: INode, targetNode: INode) => {
        const newEdge = {
            source: sourceNode[this.props.drawingBoardState.graphViewState.nodeKey],
            target: targetNode[this.props.drawingBoardState.graphViewState.nodeKey],
            type: 'emptyEdge'
        };

        const edges = this.props.drawingBoardState.graphViewState.graph.edges;

        // Only add the edge when the source node is not the same as the target
        if (newEdge.source !== newEdge.target) {
            const newEdges = [... edges, newEdge];
            this.props.updateEdges(newEdges);
        }
    }

    onCreateNode = (x: number, y: number) => {
        // Creating a Node via DrawingBoard should not be allowed so do not do anything here.
    }

    onDeleteEdge = (selectedEdge: IEdge, edges: IEdge[]) => {
        this.props.updateEdges(edges);
    }

    onDeleteNode = (selected: any, nodeId: string, nodes: any[]) => {
        this.props.removeNodeFromGraph(nodes, nodeId, this.props.drawingBoardState.graphViewState.graph.edges, this.props.sfcPackageState.vnfPackages);
    }

    onSelectEdge = (selectedEdge: IEdge) => {
        this.props.selectNodeOrEdge(selectedEdge);
    }

    onSelectNode = (selectedNode: INode | null) => {
        if(selectedNode != null){
            if(this.props.drawingBoardState.graphViewState.selected != null && this.props.drawingBoardState.graphViewState.selected.id == selectedNode.id){
                this.props.getVNFDProperties(selectedNode);
            }
            else {
                this.props.selectNodeOrEdge(selectedNode);
            }
        }
    }

    onSwapEdge = (sourceNode: INode, targetNode: INode, edge: IEdge) => {
        // Callback when two edges are swapped, but don't do anything in this case
    }

    onUpdateNode = (node: INode) => {
        // Callback when a node is moved, but don't do anything in this case
    }

    render() {
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
                               />
                </div>
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
        selectNodeOrEdge: (selected: INode | IEdge) => {
            dispatch(selectNodeOrEdge(selected));
        },
        getVNFDProperties: (node: INode) => {
            dispatch<any>(getVNFDProperties(node.id, node.title));
        },
        updateEdges: (edges: IEdge[]) => {
            dispatch(updateEdges(edges));
        },
        removeNodeFromGraph: (nodes: INode[], uuid: string, edges: IEdge[], vnfPackages: VNFPackage[]) => {
            dispatch<any>(removeNodeFromGraph(nodes, uuid, edges, vnfPackages));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawingBoard);