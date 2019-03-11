import React from 'react';
import './DrawingBoard.css';
import { StoreState, DrawingBoardState, SFCPackage } from "../../types";
import { connect } from 'react-redux';
import { getVNFD } from "../../actions";
import { Dispatch } from "redux";
import { GENEVIZ_FILE_API } from "../../constants";

class DrawingBoard extends React.Component<{ getVNFD: any, sfcPackage: SFCPackage, drawingBoardState: DrawingBoardState }> {

    showAllVNFsOfSFC = () => {
        const vnfPackages = this.props.sfcPackage.vnfPackages;
        let vnfDOM: any = [];
        vnfPackages.forEach((vnf) => {
            vnfDOM.push(<div className="drawing-board-vnf-list" key={vnf.uuid}>
                <p>{vnf.name}</p>
                <p onClick={() => this.props.getVNFD(vnf.uuid, vnf.name)}>Show Properties of VNFD</p>
            </div>)
        });
        return vnfDOM;
    }

    showVNFDProperties = () => {
        let vnfdProperties = this.props.drawingBoardState.vnfdProperties;
        return (
            <div className='vnfd-properties'>
                <p>Number of CPUs: {vnfdProperties.numCPUs}</p>
                <p>Memory Size: {vnfdProperties.memSize}</p>
                <p>Disk Size: {vnfdProperties.diskSize}</p>
            </div>);
    }

    concatUUIDsForURL = () => {
        const uuids = this.props.sfcPackage.vnfPackages.map(vnfPackage => vnfPackage.uuid);
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
            <div className="drawing-board">
                <h1>This is the Drawing Board.</h1>

                {this.showAllVNFsOfSFC()}

                <form action={GENEVIZ_FILE_API + "/sfc" + this.concatUUIDsForURL()} method="post">
                    <input type="submit" value="Create SFC"></input>
                </form>

                {this.showVNFDProperties()}

            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        sfcPackage: state.sfcPackage,
        drawingBoardState: state.userInterface.drawingBoardState
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        getVNFD: (uuid: string, name: string) => {
            dispatch<any>(getVNFD(uuid, name));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawingBoard);