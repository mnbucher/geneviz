import ToolsMenu from '../components/ToolsMenu/ToolsMenu';
import { connect } from 'react-redux';

export function mapStateToProps(state) {
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