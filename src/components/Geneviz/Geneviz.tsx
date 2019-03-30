import ToolsMenu from '../ToolsMenu/ToolsMenu';
import DrawingBoard from '../DrawingBoard/DrawingBoard';
import React from 'react';
import './Geneviz.css';
import {StoreState} from "../../types";
import {connect} from "react-redux";
import VNFDPopup from "../Popup/VNFDPopup/VNFDPopup";
import SFCPopup from '../Popup/SFCPopup/SFCPopup';

class Geneviz extends React.Component<{showSFCPopup: boolean, showVNFDPopup: boolean}> {

    componentDidMount() {
        document.title = "GENEVIZ";
    }

    render() {
        return (
            <div className="geneviz">
                <ToolsMenu/>
                <DrawingBoard/>
                {this.props.showSFCPopup ? <SFCPopup /> : null}
                {this.props.showVNFDPopup ? <VNFDPopup /> : null}
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        showSFCPopup: state.userInterfaceState.showSFCPopup,
        showVNFDPopup: state.userInterfaceState.showVNFDPopup
    }
}

export default connect(mapStateToProps)(Geneviz);