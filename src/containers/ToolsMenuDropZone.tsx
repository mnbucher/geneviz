import ToolsMenuDropZone from '../components/ToolsMenu/ToolsMenuDropZone/ToolsMenuDropZone';
import { connect } from 'react-redux';
import {StoreState, VNFTemplate} from "../types";
import { uploadVNFTemplate } from "../actions";
import { Dispatch } from "redux";

export function mapStateToProps(state: StoreState) {
    return {
        vnfTemplates: state.vnfTemplates
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        addVNF: (vnfTemplate: VNFTemplate) => {
            console.log("add vnf is called!");
            dispatch(uploadVNFTemplate(vnfTemplate));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuDropZone);