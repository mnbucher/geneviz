import React from 'react';
import './ToolsMenu.css';
import ToolsMenuList from './ToolsMenuList/ToolsMenuList';
import ToolsMenuDropZone from './ToolsMenuDropZone/ToolsMenuDropZone';
import { connect } from "react-redux";
import { SFCPackageState, StoreState, GraphViewState } from "../../types";
import { Dispatch } from 'redux';
import { handleSFCPopup, handleVNFList } from 'src/actions';

class ToolsMenu extends React.Component<{ sfcPackageState: SFCPackageState, graphView: GraphViewState, showVNFList: boolean, handleSFCPopup: any, handleVNFList: any}> {

    concatUUIDsForURL = () => {
        const uuids = this.props.sfcPackageState.vnfPackages.map(vnfPackage => vnfPackage.uuid);
        if (uuids.length > 0) {
            let path = "";
            uuids.forEach((uuid, index) => {
                if (index == 0) {
                    path = path.concat("?uuids[]=" + uuid);
                }
                else {
                    path = path.concat("&uuids[]=" + uuid);
                }
            });
            return path;
        }
        return "";
    }

    generateSFCPackage = () => {
        this.props.handleSFCPopup(true);
    }

    isGraphValid = () => {
        if (this.props.sfcPackageState.vnfPackages.length < 2) {
            return false;
        }

        let allNodesWithEdges: string[] = [];
        this.props.graphView.graph.edges.forEach(edge => {
            if (!allNodesWithEdges.includes(edge.source)) {
                allNodesWithEdges.push(edge.source);
            }
            if (!allNodesWithEdges.includes(edge.target)) {
                allNodesWithEdges.push(edge.target);
            }
        });

        let allNodes: string[] = this.props.graphView.graph.nodes.map(node => {
            return node.id
        });

        if (JSON.stringify(allNodesWithEdges.sort()) !== JSON.stringify(allNodes.sort())) {
            return false;
        }

        return true;
    }

    render() {
        return (
            <div className="tools-menu-wrapper">

                <div className="geneviz-header">
                    <p className="geneviz-headline">Geneviz</p>
                    <p className="geneviz-subheadline">Generation and Visualization of SFC Packages</p>
                </div>

                <div className="tools-menu-inner-wrapper">
                    <div className="tools-menu">
                        <div className="tools-menu-tab-bar">
                            <span onClick={() => this.props.handleVNFList(true)} className={this.props.showVNFList ? "tools-menu-headline tools-menu-headline-active" : "tools-menu-headline"}>VNF Packages</span>
                            <span onClick={() => this.props.handleVNFList(false)} className={this.props.showVNFList ? "tools-menu-headline" : "tools-menu-headline tools-menu-headline-active"}>SFC Packages</span>
                        </div>
                        <div className="tools-menu-vnfs">
                            <ToolsMenuList />
                            <ToolsMenuDropZone />
                        </div>

                        {this.isGraphValid() ?
                            <div className='tools-menu-download-sfc bounceInUp'>
                                <button onClick={this.generateSFCPackage}><span className="tools-menu-download-sfc-text">Generate SFC Package</span></button>
                            </div>
                            : null}
                    </div>
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        sfcPackageState: state.sfcPackageState,
        graphView: state.userInterfaceState.drawingBoardState.graphViewState,
        showVNFList: state.userInterfaceState.showVNFList
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        handleSFCPopup: (showSFCPopup: boolean) => {
            dispatch(handleSFCPopup(showSFCPopup));
        },
        handleVNFList: (showVNFList: boolean) => {
            dispatch(handleVNFList(showVNFList));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenu);