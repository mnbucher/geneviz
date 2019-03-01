import ToolsMenu from '../../containers/ToolsMenu';
import DrawingBoard from '../../containers/DrawingBoard';
import React from 'react';
import './Geneviz.css';

class Geneviz extends React.Component {

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

export default Geneviz;