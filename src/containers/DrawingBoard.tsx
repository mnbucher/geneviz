import DrawingBoard from '../components/DrawingBoard/DrawingBoard';
import { connect } from 'react-redux';
import {StoreState} from "../types";

export function mapStateToProps(state: StoreState) {
    return {
        sfcPackage: state.sfcPackage
    }
}

/*
export function mapDispatchToProps() {
    return {

    }
}*/

export default connect(mapStateToProps)(DrawingBoard);