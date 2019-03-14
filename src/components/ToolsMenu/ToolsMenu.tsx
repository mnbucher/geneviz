import React from 'react';
import './ToolsMenu.css';
import ToolsMenuVNFList from './ToolsMenuVNFList/ToolsMenuVNFList';
import ToolsMenuDropZone from './ToolsMenuDropZone/ToolsMenuDropZone';
import {connect} from "react-redux";
import {GENEVIZ_FILE_API} from "../../constants";
import {SFCPackageState, StoreState} from "../../types";

class ToolsMenu extends React.Component<{sfcPackageState: SFCPackageState}> {

    concatUUIDsForURL = () => {
        const uuids = this.props.sfcPackageState.vnfPackageState.map(vnfPackage => vnfPackage.uuid);
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

    render() {
        return (
            <div className="tools-menu-wrapper">

                <div className="geneviz-header">
                    <p className="geneviz-headline">Geneviz</p>
                </div>

                <div className="tools-menu-inner-wrapper">
                    <div className="tools-menu">
                        <div className="tools-menu-header"><p>Imported VNF Packages</p></div>
                        <div className="tools-menu-vnfs">
                            <ToolsMenuVNFList />
                            <ToolsMenuDropZone />
                        </div>

                        <div className='tools-menu-download-sfc'>
                            <form action={GENEVIZ_FILE_API + "/sfc" + this.concatUUIDsForURL()} method="post">
                                <input type="submit" value="Download SFC Package"></input>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        sfcPackageState: state.sfcPackageState
    }
}

export default connect(mapStateToProps)(ToolsMenu);