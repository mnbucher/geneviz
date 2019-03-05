import Geneviz from '../components/Geneviz/Geneviz';
import { connect } from 'react-redux';
import {StoreState} from "../types";

export function mapStateToProps(state: StoreState) {
    return {
        state
    }
}

/*
export function mapDispatchToProps() {
    return {

    }
}*/

export default connect(mapStateToProps)(Geneviz);