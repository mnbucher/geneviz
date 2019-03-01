import Geneviz from '../components/Geneviz/Geneviz';
import { connect } from 'react-redux';

export function mapStateToProps(state) {
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