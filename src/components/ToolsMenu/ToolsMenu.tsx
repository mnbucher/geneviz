import React from 'react';
import './ToolsMenu.css';
import ToolsMenuVNFList from './ToolsMenuVNFList/ToolsMenuVNFList';
import ToolsMenuDropZone from './ToolsMenuDropZone/ToolsMenuDropZone';
import {connect} from "react-redux";

class ToolsMenu extends React.Component {

    render() {
        return (
            <div className="tools-menu">
                <div className="tools-menu-header"><p>Imported VNF Packages</p></div>
                <div className="tools-menu-vnfs">
                    <ToolsMenuVNFList />
                    <ToolsMenuDropZone />
                </div>
            </div>
        )
    }
}

export default connect()(ToolsMenu);