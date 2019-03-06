import React from 'react';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {StoreState, VNFPackage, VNFTemplate} from "../../../types";
import {addVNFToSFC, deleteVNFTemplate} from "../../../actions";
const uuidv1 = require('uuid/v1');
import './ToolsMenuVNFList.css';

class ToolsMenuVNFList extends React.Component<{ removeVNF: any, addVNFToSFC: any, vnfTemplates: VNFTemplate[] }> {

    allVNFs = () => {
        const vnfTemplates = this.props.vnfTemplates;
        let vnfDOM: any = [];
        let vnfCounter = 1;
        vnfTemplates.forEach((vnf) => {
            vnfDOM.push(<div className='tools-menu-vnf-list-element' key={vnf.uuid}>
                <div className='tools-menu-vnf-list-element-remove'
                     onClick={() => this.props.removeVNF(vnf.uuid)}>Remove
                </div>
                <p className='tools-menu-vnf-list-element-number'>VNF #{vnfCounter}</p>
                <p className='vnf-list-element-name'>{vnf.name}</p>
                <p className='vnf-list-element-add-to-sfc' onClick={() => this.props.addVNFToSFC(vnf)}>Add to SFC</p></div>);
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
        vnfTemplates: state.vnfTemplates
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        removeVNF: (uuid: string) => {
            dispatch(deleteVNFTemplate(uuid));
        },
        addVNFToSFC: (vnfTemplate: VNFTemplate) => {
            const vnfPackage: VNFPackage = {
                name: vnfTemplate.name,
                uuid: uuidv1()
            }
            dispatch(addVNFToSFC(vnfPackage));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuVNFList);