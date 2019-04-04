import * as React from 'react';
import './DrawingBoard.css';
import {StoreState, DrawingBoardState, SFCPackageState, VNFPackage} from "../../types";
import { connect } from 'react-redux';
import {selectNodeOrEdge, getVNFDProperties, updateEdges, removeNodeFromGraph, updateGraph, updateVNFPackages} from "../../actions";
import { Dispatch } from "redux";
import { GraphView, IEdge, INode } from 'react-digraph';
import GraphConfig from "../../constants/GraphConfig";

class DrawingBoard extends React.Component<{ selectNodeOrEdge: any, getVNFDProperties: any, updateEdges: any, removeNodeFromGraph: any, updateGraph: any, updateVNFPackages: any, sfcPackageState: SFCPackageState, drawingBoardState: DrawingBoardState }> {

    getVNFPackage = (uuid: string) => {
        return this.props.sfcPackageState.vnfPackages.find(vnfPackage => {
            return vnfPackage.uuid == uuid;
        });
    }

    isFoundInOtherList = (list1: string[], list2: string[]) => {
        let isRecommended: boolean = false;
        list1.forEach(element => {
            if(list2.includes(element)){
                isRecommended = true;
            }
        });
        return isRecommended;
    }

    getEdgeType = (source: string, target: string) => {
        const sourceVNFPackage = this.getVNFPackage(source);
        const targetVNFPackage = this.getVNFPackage(target);
        if(typeof sourceVNFPackage !== 'undefined' && typeof targetVNFPackage !== 'undefined'){
            const sourceTargetRecommendation: string[] = sourceVNFPackage.vnfd['vnfd']['target_recommendation'];
            const sourceTargetCaution: string[] = sourceVNFPackage.vnfd['vnfd']['target_caution'];
            const targetServiceTypes: object[] = (targetVNFPackage.vnfd['vnfd']['service_types']);

            if(typeof sourceTargetRecommendation !== 'undefined' && typeof sourceTargetCaution !== 'undefined' && typeof targetServiceTypes !== 'undefined') {
                const targetServiceTypesAsList = targetServiceTypes.map(serviceType => {
                    return serviceType['service_type'];
                });
                if(this.isFoundInOtherList(sourceTargetRecommendation, targetServiceTypesAsList)) {
                    return 'recommendedEdge';
                }
                else if (this.isFoundInOtherList(sourceTargetCaution, targetServiceTypesAsList)) {
                    return 'notRecommendedEdge';
                }
                else {
                    return 'standardEdge';
                }
            }
            else {
                return 'standardEdge';
            }
        }
        else {
            return 'standardEdge';
        }
    }

    onCreateEdge = (sourceNode: INode, targetNode: INode) => {
        const sourceId = sourceNode[this.props.drawingBoardState.graphViewState.nodeKey];
        const targetId = targetNode[this.props.drawingBoardState.graphViewState.nodeKey]

        console.log(this.getEdgeType(sourceId, targetId));

        const newEdge: IEdge = {
            source: sourceId,
            target: targetId,
            type: this.getEdgeType(sourceId, targetId)
        };

        if (newEdge.source !== newEdge.target) {
            const edges: IEdge[] = this.props.drawingBoardState.graphViewState.graph.edges;
            this.props.updateEdges([... edges, newEdge]);
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
                const vnfPackage = this.props.sfcPackageState.vnfPackages.find(vnfPackage => {
                    return vnfPackage.uuid == selectedNode.id
                });
                if(typeof vnfPackage !== 'undefined'){
                    this.props.getVNFDProperties(selectedNode, vnfPackage.vnfd);
                }
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
        getVNFDProperties: (node: INode, vnfd: object) => {
            dispatch<any>(getVNFDProperties(node.id, node.title, vnfd));
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