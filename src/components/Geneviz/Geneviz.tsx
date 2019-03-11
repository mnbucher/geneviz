import ToolsMenu from '../ToolsMenu/ToolsMenu';
import DrawingBoard from '../DrawingBoard/DrawingBoard';
import React from 'react';
import './Geneviz.css';
import {StoreState} from "../../types";
import {connect} from "react-redux";

class Geneviz extends React.Component {

    componentDidMount() {
        document.title = "GENEVIZ";
    }

    render() {
        return (
            <div className="geneviz">
                <div className="geneviz-header">
                    <p className="geneviz-headline">Geneviz</p>
                </div>
                <div className="geneviz-content-wrapper">
                    <div className="geneviz-content">
                        <DrawingBoard />
                        <ToolsMenu />
                    </div>
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        state
    }
}

export default connect(mapStateToProps)(Geneviz);