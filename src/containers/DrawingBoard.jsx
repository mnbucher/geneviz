import DrawingBoard from '../components/DrawingBoard/DrawingBoard';
import { connect } from 'react-redux';

export function mapStateToProps(state) {
    return {
        sfcp: state.sfcp
    }
}

/*
export function mapDispatchToProps() {
    return {

    }
}*/

export default connect(mapStateToProps)(DrawingBoard);