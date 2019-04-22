import React from 'react';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StoreState, VNFPackage, VNFTemplate, SFCTemplate } from "../../../types";
import { createVNFPAndAddNodeToSFC, deleteVNFTemplate, importSFC, validateSFC, deleteSFCTemplate } from "../../../actions";
import './ToolsMenuList.css';
import { INode } from "react-digraph";
import { GENEVIZ_FILE_API } from 'src/constants';
import { toast } from 'react-toastify';

class ToolsMenuList extends React.Component<{ removeVNF: any, createVNFPAndAddVNFTtoSFC: any, importSFC: any, validateSFC: any, removeSFC: any, vnfTemplates: VNFTemplate[], sfcTemplates: SFCTemplate[], nodes: INode[], vnfPackages: VNFPackage[], xOffset: number, showVNFList: boolean }> {

    triggerImport = (template: SFCTemplate) => {
        fetch(GENEVIZ_FILE_API + "/sfc", {
            method: "POST",
            body: JSON.stringify(template.fileBase64),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                toast.success("Imported SFC Package successfully");
            },
            error => {
                console.log(error);
                toast.error("Coult not import the SFC Package");
            }
        );
    }
    
    allVNFs = () => {
        const templates = this.props.showVNFList ? this.props.vnfTemplates : this.props.sfcTemplates;
        let DOM: any = [];
        if (templates.length == 0) {
            return (
                <p className='tools-menu-empty-state'>There were no {this.props.showVNFList ? "VNF" : "SFC"} Packages uploaded yet.</p>
            )
        }
        templates.forEach((template) => {
            DOM.push(<div className='tools-menu-list-element' key={template.uuid}>
                <p className='tools-menu-list-element-name'>{template.name}</p>

                {this.props.showVNFList ?
                    <p className='tools-menu-list-element-buttons'>
                        <span className='tools-menu-list-element-blue'
                            onClick={() => this.props.createVNFPAndAddVNFTtoSFC(template, this.props.nodes, this.props.vnfPackages, this.props.xOffset)}>Add to SFC</span>
                        <span className='tools-menu-list-element-remove'
                            onClick={() => this.props.removeVNF(template.uuid)}>Remove</span>
                    </p>
                    :
                    <p className='tools-menu-list-element-buttons'>
                        <span className='tools-menu-list-element-blue'
                            onClick={() => this.triggerImport(template)}>Import SFC</span>
                        <span className='tools-menu-list-element-blue'
                            onClick={() => this.props.validateSFC(template)}>Validate</span>
                        <span className='tools-menu-list-element-remove'
                            onClick={() => this.props.removeSFC(template.uuid)}>Remove</span>
                    </p>}
            </div>);
        });
        return DOM;
    }

    render() {
        return (
            <div className="tools-menu-list">
                {this.allVNFs()}
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        vnfTemplates: state.vnfTemplates,
        sfcTemplates: state.sfcTemplates,
        nodes: state.userInterfaceState.drawingBoardState.graphViewState.graph.nodes,
        vnfPackages: state.sfcPackageState.vnfPackages,
        xOffset: state.userInterfaceState.drawingBoardState.graphViewState.xOffset,
        showVNFList: state.userInterfaceState.showVNFList
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        removeVNF: (uuid: string) => {
            dispatch(deleteVNFTemplate(uuid));
        },
        createVNFPAndAddVNFTtoSFC: (vnfTemplate: VNFTemplate, nodes: INode[], vnfPackages: VNFPackage[], xOffset: number) => {
            dispatch<any>(createVNFPAndAddNodeToSFC(vnfTemplate, nodes, vnfPackages, xOffset));
        },
        importSFC: (template: SFCTemplate) => {
            dispatch<any>(importSFC(template));
        },
        validateSFC: (template: SFCTemplate) => {
            dispatch<any>(validateSFC(template));
        },
        removeSFC: (uuid: string) => {
            dispatch(deleteSFCTemplate(uuid));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuList);