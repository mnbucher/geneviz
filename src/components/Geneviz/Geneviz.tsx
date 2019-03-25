import ToolsMenu from '../ToolsMenu/ToolsMenu';
import DrawingBoard from '../DrawingBoard/DrawingBoard';
import React from 'react';
import './Geneviz.css';
import {StoreState} from "../../types";
import {connect} from "react-redux";
import VNFDPropertiesPopup from "../VNFDPropertiesPopup/VNFDPropertiesPopup";

class Geneviz extends React.Component<{numCPUs: string}> {

    componentDidMount() {
        document.title = "GENEVIZ";
    }

    render() {
        return (
            <div className="geneviz">
                <ToolsMenu/>
                <DrawingBoard/>
                {this.props.numCPUs !== "" ? <VNFDPropertiesPopup /> : null}
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        numCPUs: state.userInterfaceState.drawingBoardState.vnfdPropertiesState.numCPUs
    }
}

export default connect(mapStateToProps)(Geneviz);