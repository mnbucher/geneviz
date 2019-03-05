import ToolsMenuDropZone from '../components/ToolsMenu/ToolsMenuDropZone/ToolsMenuDropZone';
import { connect } from 'react-redux';
import { StoreState, VNFPackage } from "../types";
import { addVNF } from "../actions";
import { Dispatch } from "redux";

export function mapStateToProps(state: StoreState) {
    return {
        vnfs: state.vnfs
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        addVNF: (vnfPackage: VNFPackage) => {
            console.log("add vnf is called!");
            dispatch(addVNF(vnfPackage));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuDropZone);