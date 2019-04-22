import * as React from 'react';
import ReactDOM from 'react-dom';
import './DrawingBoard.css';
import { StoreState, DrawingBoardState, SFCPackageState, VNFPackage } from "../../types";
import { connect } from 'react-redux';
import { selectNodeOrEdge, getVNFDProperties, updateEdges, removeNodeFromGraph, updateGraph, updateVNFPackages } from "../../actions";
import { Dispatch } from "redux";
import { GraphView, IEdge, INode } from 'react-digraph';
import GraphConfig from "../../constants/GraphConfig";
import { toast } from 'react-toastify';
import { getSFCPath } from 'src/constants/GraphHelper';

class DrawingBoard extends React.Component<{ selectNodeOrEdge: any, getVNFDProperties: any, updateEdges: any, removeNodeFromGraph: any, updateGraph: any, updateVNFPackages: any, sfcPackageState: SFCPackageState, drawingBoardState: DrawingBoardState }> {
    showVNFDPropertiesRef: any;
    vnffgdRemoveElementRef: any;
    vnffgdResetRef: any;

    constructor(props: any) {
        super(props);
        this.showVNFDPropertiesRef = React.createRef();
        this.vnffgdRemoveElementRef = React.createRef();
        this.vnffgdResetRef = React.createRef();
    }

    componentDidUpdate() {
        let showVNFDPropertiesNode = ReactDOM.findDOMNode(this.showVNFDPropertiesRef.current) as HTMLInputElement;
        let vnffgdRemoveElementNode = ReactDOM.findDOMNode(this.vnffgdRemoveElementRef.current) as HTMLInputElement;
        let vnffgdResetNode = ReactDOM.findDOMNode(this.vnffgdResetRef.current) as HTMLInputElement;

        // If the graph is not empty anymore, show the Remove and Clear Buttons
        if (this.props.drawingBoardState.graphViewState.graph.nodes.length > 0 || this.props.drawingBoardState.graphViewState.graph.edges.length > 0) {
            
            this.handleVNFNodeNumbering();
            
            if (!vnffgdRemoveElementNode.classList.contains("bounceInUp")) {
                vnffgdRemoveElementNode.classList.remove("bounceInDown");
                vnffgdRemoveElementNode.classList.add("bounceInUp");
                setTimeout(() => {
                    vnffgdRemoveElementNode.classList.add("stayAtTop");
                }, 500);
            }

            if (!vnffgdResetNode.classList.contains("bounceInUp")) {
                vnffgdResetNode.classList.remove("bounceInDown");
                vnffgdResetNode.classList.add("bounceInUp");
                setTimeout(() => {
                    vnffgdResetNode.classList.add("stayAtTop");
                }, 400);
            }
        }
        else {
            if (!vnffgdRemoveElementNode.classList.contains("bounceInDown") && vnffgdRemoveElementNode.classList.contains("bounceInUp")) {
                vnffgdRemoveElementNode.classList.remove("bounceInUp");
                vnffgdRemoveElementNode.classList.add("bounceInDown");
                setTimeout(() => {
                    vnffgdRemoveElementNode.classList.remove("stayAtTop");
                }, 850);
            }

            if (!vnffgdResetNode.classList.contains("bounceInDown") && vnffgdResetNode.classList.contains("bounceInUp")) {
                vnffgdResetNode.classList.remove("bounceInUp");
                vnffgdResetNode.classList.add("bounceInDown");
                setTimeout(() => {
                    vnffgdResetNode.classList.remove("stayAtTop");
                }, 750);
            }
        }

        // If the newly selected element is a node, show the VNFD Popup Button
        if (typeof this.props.drawingBoardState.graphViewState.selected.id !== 'undefined') {
            if (!showVNFDPropertiesNode.classList.contains("bounceInUp")) {
                showVNFDPropertiesNode.classList.remove("bounceInDown");
                showVNFDPropertiesNode.classList.add("bounceInUp");
                setTimeout(() => {
                    showVNFDPropertiesNode.classList.add("stayAtTop");
                }, 600);
            }
        }
        // If the newly selected element is an edge, hide the VNFD Popup Button
        else {
            if (!showVNFDPropertiesNode.classList.contains("bounceInDown") && showVNFDPropertiesNode.classList.contains("bounceInUp")) {
                showVNFDPropertiesNode.classList.remove("bounceInUp");
                showVNFDPropertiesNode.classList.add("bounceInDown");
                setTimeout(() => {
                    showVNFDPropertiesNode.classList.remove("stayAtTop");
                }, 950);
            }
        }
    }

    handleVNFNodeNumbering = () => {
        const sfcPath = getSFCPath(this.props.sfcPackageState.vnfPackages, this.props.drawingBoardState.graphViewState.graph.edges);
        let number = 1;
        sfcPath.forEach(vnf => {
            let nodeDOM = document.getElementById("node-" + vnf['uuid']);
            if(nodeDOM){
                let textNode = nodeDOM.getElementsByClassName("node-text");
                if(textNode[0]){
                    let tspan = textNode[0].getElementsByTagName("tspan");
                    if(tspan[0]){
                        tspan[0].innerHTML = "VNF #" + number++;
                    }
                }
            }
        })
    }

    getVNFPackage = (uuid: string) => {
        return this.props.sfcPackageState.vnfPackages.find(vnfPackage => {
            return vnfPackage.uuid == uuid;
        });
    }

    isFoundInOtherList = (list1: string[], list2: string[]) => {
        let isRecommended: boolean = false;
        list1.forEach(element => {
            if (list2.includes(element)) {
                isRecommended = true;
            }
        });
        return isRecommended;
    }

    getEdgeType = (source: string, target: string) => {
        const sourceVNFPackage = this.getVNFPackage(source);
        const targetVNFPackage = this.getVNFPackage(target);
        if (typeof sourceVNFPackage !== 'undefined' && typeof targetVNFPackage !== 'undefined') {
            const sourceTargetRecommendation: string[] = sourceVNFPackage.vnfd['vnfd']['target_recommendation'];
            const sourceTargetCaution: string[] = sourceVNFPackage.vnfd['vnfd']['target_caution'];
            const targetServiceTypes: object[] = (targetVNFPackage.vnfd['vnfd']['service_types']);

            if (typeof sourceTargetRecommendation !== 'undefined' && typeof sourceTargetCaution !== 'undefined' && typeof targetServiceTypes !== 'undefined') {
                const targetServiceTypesAsList = targetServiceTypes.map(serviceType => {
                    return serviceType['service_type'];
                });
                if (this.isFoundInOtherList(sourceTargetRecommendation, targetServiceTypesAsList)) {
                    return 'recommendedEdge';
                }
                else if (this.isFoundInOtherList(sourceTargetCaution, targetServiceTypesAsList)) {
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

    isEdgeAllowed = (newEdge: IEdge) => {

        // Don't allow loops on the same node
        if (newEdge.source == newEdge.target) {
            return false;
        }
        
        // Don't allow two edges from the same node or to the same node
        if(typeof this.props.drawingBoardState.graphViewState.graph.edges.find(edge => {
            if(edge.source == newEdge.source){
                toast.error("Multiple Paths are not allowed for an SFC");
                return true;
            }
            else if(edge.target == newEdge.target){
                toast.error("Multiple Paths are not allowed for an SFC");
                return true;
            }
            else {
                return false;
            }
        }) !== 'undefined') {
            return false;
        }

        // Don't allow circles
        if(this.props.drawingBoardState.graphViewState.graph.edges.length == this.props.drawingBoardState.graphViewState.graph.nodes.length - 1){
            toast.error("Loops are not allowed for an SFC");
            return false;
        }

        return true;
    }

    onCreateEdge = (sourceNode: INode, targetNode: INode) => {
        const sourceId = sourceNode[this.props.drawingBoardState.graphViewState.nodeKey];
        const targetId = targetNode[this.props.drawingBoardState.graphViewState.nodeKey]

        const newEdge: IEdge = {
            source: sourceId,
            target: targetId,
            type: this.getEdgeType(sourceId, targetId)
        };

        if (this.isEdgeAllowed(newEdge)) {
            const edges: IEdge[] = this.props.drawingBoardState.graphViewState.graph.edges;
            this.props.updateEdges([...edges, newEdge]);
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
        if (selectedNode != null && this.props.drawingBoardState.graphViewState.selected.id !== selectedNode.id) {
            this.props.selectNodeOrEdge(selectedNode);
        }
    }

    onSwapEdge = (sourceNode: INode, targetNode: INode, edge: IEdge) => {
        // Callback when two edges are swapped, but don't do anything in this case
    }

    onUpdateNode = (node: INode) => {
        // Callback when a node is updated, but don't do anything in this case
    }

    isNode = (object: any) => {
        return typeof object.title === 'undefined' ? false : true;
    }

    isEdge = (object: any) => {
        return typeof object.source === 'undefined' ? false : true;
    }

    handleShowVNFDPropertiesButton = () => {
        const selectedNode = this.props.drawingBoardState.graphViewState.selected;
        if (selectedNode != null) {
            const vnfPackage = this.props.sfcPackageState.vnfPackages.find(vnfPackage => {
                return vnfPackage.uuid == selectedNode.id
            });
            if (typeof vnfPackage !== 'undefined') {
                this.props.getVNFDProperties(vnfPackage.uuid, vnfPackage.name, vnfPackage.vnfd);
            }
        }
    }

    handleRemoveElementButton = () => {
        const selectedElement = this.props.drawingBoardState.graphViewState.selected;
        if (this.isEdge(selectedElement)) {
            const newEdges = this.props.drawingBoardState.graphViewState.graph.edges.filter(edge => {
                return !(edge.source == selectedElement.source && edge.target == selectedElement.target);
            });
            this.props.updateEdges(newEdges);
        }
        else if (this.isNode(this.props.drawingBoardState.graphViewState.selected)) {
            const newNodes = this.props.drawingBoardState.graphViewState.graph.nodes.filter(node => {
                return node.id !== selectedElement.id
            });
            this.props.removeNodeFromGraph(newNodes, selectedElement.id, this.props.drawingBoardState.graphViewState.graph.edges, this.props.sfcPackageState.vnfPackages);
        }
    }

    handleResetGraph = () => {
        this.props.selectNodeOrEdge({} as INode);
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
                    <button className='vnffgd-button show-vnfd-properties-button bounceDelay2' onClick={this.handleShowVNFDPropertiesButton} ref={this.showVNFDPropertiesRef} ><span className="show-vnfd-properties-button-text">Show VNFD Properties</span></button>
                    <button className='vnffgd-button vnffgd-remove-element-button bounceDelay1' onClick={this.handleRemoveElementButton} ref={this.vnffgdRemoveElementRef}><span className="vnffgd-remove-element-button-text">{this.isEdge(this.props.drawingBoardState.graphViewState.selected) ? "Remove Edge" : "Remove Node"}</span></button>
                    <button className='vnffgd-button vnffgd-reset-button' onClick={this.handleResetGraph} ref={this.vnffgdResetRef}><span className="vnffgd-reset-button-text">Clear Graph</span></button>
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
        getVNFDProperties: (uuid: string, name: string, vnfd: object) => {
            dispatch<any>(getVNFDProperties(uuid, name, vnfd));
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