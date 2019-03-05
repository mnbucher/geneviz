import ToolsMenu from '../components/ToolsMenu/ToolsMenu';
import { connect } from 'react-redux';
import {StoreState} from "../types";

export function mapStateToProps(state: StoreState) {
    return {
        vnfs: state.vnfs
    }
}

/*
export function mapDispatchToProps() {
    return {

    }
}*/

export default connect(mapStateToProps)(ToolsMenu);