import React from 'react';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StoreState, VNFPackage } from "../../../types";
import { removeVNF } from "../../../actions";
import './ToolsMenuVNFList.css';

class ToolsMenuVNFList extends React.Component<{removeVNF: any, vnfs: VNFPackage[]}> {

    allVNFs = () => {
        const vnfs = this.props.vnfs;
        let vnfDOM: any = [];
        let vnfCounter = 1;
        vnfs.forEach((vnf) => {
            vnfDOM.push(<div className='tools-menu-vnf-list-element' key={vnf.uuid}><div className='tools-menu-vnf-list-element-remove' onClick={() => this.props.removeVNF(vnf.uuid)}>Remove</div><p className='tools-menu-vnf-list-element-number'>VNF #{vnfCounter}</p><p className='vnf-list-element-name'>{vnf.name}</p></div>);
            vnfCounter++;
        });
        return vnfDOM;
    }

    render() {
        return (
            <div className="tools-menu-vnf-list">
                <div className="tools-menu-vnf-list-imported-vnfs">
                    <p className="tools-menu-subtitle">Imported VNFs</p>
                    {this.allVNFs()}
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        vnfs: state.vnfs
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        removeVNF: (uuid: string) => {
            dispatch(removeVNF(uuid));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuVNFList);