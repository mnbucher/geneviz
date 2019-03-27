import React from 'react';
import './ToolsMenu.css';
import ToolsMenuVNFList from './ToolsMenuVNFList/ToolsMenuVNFList';
import ToolsMenuDropZone from './ToolsMenuDropZone/ToolsMenuDropZone';
import {connect} from "react-redux";
import {GENEVIZ_FILE_API} from "../../constants";
import {SFCPackageDTO, SFCPackageState, StoreState} from "../../types";
import fileDownload from "js-file-download";

class ToolsMenu extends React.Component<{sfcPackageState: SFCPackageState}> {

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

    downloadSFC = () => {

        let groupedVNFPackages = this.props.sfcPackageState.vnfPackages.reduce((acc, obj) => {
           let key = obj['name'];
           if(!acc[key]) {
               acc[key] = [];
           }
           acc[key].push(obj['uuid']);
           return acc;
        }, {});

        const sfcPackageDTO: SFCPackageDTO = {
          vnf_packages: groupedVNFPackages,
          vnffgd: this.props.sfcPackageState.vnffgd,
          nsd_name: "test-nsd"
        };

        fetch(GENEVIZ_FILE_API + "/sfc", {
            method: "POST",
            body: JSON.stringify(sfcPackageDTO),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.blob();
        }).then(data => {
            fileDownload(data, "sfc-package.zip");
        }, error => {
            console.log(error);
        });
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
                            <button onClick={this.downloadSFC}>Generate SFC Package</button>
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