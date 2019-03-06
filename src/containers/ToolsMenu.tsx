import ToolsMenu from '../components/ToolsMenu/ToolsMenu';
import { connect } from 'react-redux';
import {StoreState} from "../types";

export function mapStateToProps(state: StoreState) {
    return {
        vnfTemplates: state.vnfTemplates
    }
}

/*
export function mapDispatchToProps() {
    return {

    }
}*/

export default connect(mapStateToProps)(ToolsMenu);