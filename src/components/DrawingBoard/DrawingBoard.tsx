import * as React from 'react';
import './DrawingBoard.css';
import {StoreState, DrawingBoardState, SFCPackageState, VNFPackage} from "../../types";
import { connect } from 'react-redux';
import {selectNodeOrEdge, getVNFDProperties, updateEdges, removeNodeFromGraph, updateGraph, updateVNFPackages} from "../../actions";
import { Dispatch } from "redux";
import { GraphView, IEdge, INode } from 'react-digraph';
import GraphConfig from "../../constants/GraphConfig";

class DrawingBoard extends React.Component<{ selectNodeOrEdge: any, getVNFDProperties: any, updateEdges: any, removeNodeFromGraph: any, updateGraph: any, updateVNFPackages: any, sfcPackageState: SFCPackageState, drawingBoardState: DrawingBoardState }> {

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

    onDeleteEdge = (selectedEdge: IEdge, newEdges: IEdge[]) => {
        this.props.updateEdges(newEdges);
    }

    onDeleteNode = (selected: any, uuid: string, newNodes: any[]) => {
        this.props.removeNodeFromGraph(newNodes, uuid, this.props.drawingBoardState.graphViewState.graph.edges, this.props.sfcPackageState.vnfPackages);
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

    isNode = (object: any) => {
        return typeof object.title === 'undefined' ? false : true;
    }

    isEdge = (object: any) => {
        return typeof object.source === 'undefined' ? false : true;
    }

    handleRemoveElementButton = () => {
        const selectedElement = this.props.drawingBoardState.graphViewState.selected;
        if(this.isEdge(selectedElement)){
            const newEdges = this.props.drawingBoardState.graphViewState.graph.edges.filter(edge => {
                return !(edge.source == selectedElement.source && edge.target == selectedElement.target);
            });
            console.log(this.props.drawingBoardState.graphViewState.graph.edges);
            console.log(newEdges);
            this.props.updateEdges(newEdges);
        }
        else if(this.isNode(this.props.drawingBoardState.graphViewState.selected)){
            const newNodes = this.props.drawingBoardState.graphViewState.graph.nodes.filter(node => {
                return node.id !== selectedElement.id
            });
            this.props.removeNodeFromGraph(newNodes, selectedElement.id, this.props.drawingBoardState.graphViewState.graph.edges, this.props.sfcPackageState.vnfPackages);
        }
    }

    handleResetGraph = () => {
        this.props.updateGraph([] as INode[], [] as IEdge[]);
        this.props.updateVNFPackages([]);
    }

    render() {
        return (
            <div className='drawing-board'>
                <div id='graph'>
                    <GraphView 
                               edges={this.props.drawingBoardState.graphViewState.graph.edges}
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

                <div className='vnffgd-control'>
                    {(this.isNode(this.props.drawingBoardState.graphViewState.selected) || this.isEdge(this.props.drawingBoardState.graphViewState.selected)) ? <button className='vnffgd-button vnffgd-remove-element-button' onClick={this.handleRemoveElementButton}>{this.isEdge(this.props.drawingBoardState.graphViewState.selected) ? "Remove Edge" : "Remove Node"}</button> : null}
                    <button className='vnffgd-button vnffgd-reset-button' onClick={this.handleResetGraph}>Reset Forwarding Graph</button>
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
        },
        updateGraph: (edges: IEdge[], nodes: INode[]) => {
            dispatch(updateGraph(edges, nodes));
        },
        updateVNFPackages: (vnfPackages: VNFPackage[]) => {
            dispatch(updateVNFPackages(vnfPackages));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawingBoard);