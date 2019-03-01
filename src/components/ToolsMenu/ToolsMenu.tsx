import React from 'react';
import './ToolsMenu.css';

class ToolsMenu extends React.Component {

    render() {
        return (
            <div className="toolsMenu">
                <div className="toolsMenu-header"><p>Imported VNFs</p></div>
                <div className="toolsMenu-vnfs">
                    <p>VNF 1</p>
                </div>
            </div>
        )
    }
}

export default ToolsMenu;