import React from 'react';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {StoreState, VNFPackage, VNFTemplate} from "../../../types";
import {createVNFPAndAddVNFTtoSFC, deleteVNFTemplate} from "../../../actions";
import './ToolsMenuVNFList.css';
import {INode} from "react-digraph";

class ToolsMenuVNFList extends React.Component<{ removeVNF: any, addVNFToSFC: any, vnfTemplateState: VNFTemplate[], nodes: INode[], vnfPackages: VNFPackage[] }> {

    allVNFs = () => {
        const vnfTemplates = this.props.vnfTemplateState;
        let vnfDOM: any = [];
        let vnfCounter = 1;
        if(vnfTemplates.length == 0) {
            return (
                <p className='tools-menu-empty-state'>There were no VNF Packages uploaded yet.</p>
            )
        }
        vnfTemplates.forEach((vnf) => {
            vnfDOM.push(<div className='tools-menu-vnf-list-element' key={vnf.uuid}>
                <p className='tools-menu-vnf-list-element-number'>VNF #{vnfCounter}</p>
                <p className='vnf-list-element-name'>{vnf.name}</p>
                <p className='vnf-list-element-buttons'>
                    <span className='vnf-list-element-add-to-sfc'
                          onClick={() => this.props.addVNFToSFC(vnf, this.props.nodes, this.props.vnfPackages)}>Add to SFC</span>
                    <span className='vnf-list-element-remove'
                          onClick={() => this.props.removeVNF(vnf.uuid)}>Remove from List</span>
                </p>
            </div>)
            vnfCounter++;
        });
        return vnfDOM;
    }

    render() {
        return (
            <div className="tools-menu-vnf-list">
                <div className="tools-menu-vnf-list-imported-vnfs">
                    {this.allVNFs()}
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        vnfTemplateState: state.vnfTemplates,
        nodes: state.userInterfaceState.drawingBoardState.graphViewState.graph.nodes,
        vnfPackages: state.sfcPackageState.vnfPackages
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        removeVNF: (uuid: string) => {
            dispatch(deleteVNFTemplate(uuid));
        },
        addVNFToSFC: (vnfTemplate: VNFTemplate, nodes: INode[], vnfPackages: VNFPackage[]) => {
            dispatch<any>(createVNFPAndAddVNFTtoSFC(vnfTemplate, nodes, vnfPackages));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuVNFList);