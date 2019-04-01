import React from 'react';
import ReactDOM from 'react-dom';
import './VNFDPopup.css';
import '../Popup.css';
import {StoreState, VNFDPropertiesState, VNFPackage} from "../../../types";
import {connect} from "react-redux";
import {resetVNFDProperties, setVNFDProperties, updateVNFDInVNFPackage, handleVNFDPopup} from "../../../actions";
import {Dispatch} from "redux";

class VNFDPopup extends React.Component<{vnfdPropertiesState: VNFDPropertiesState, vnfd: object, vnfPackages: VNFPackage[], setVNFDProperties: any, resetVNFDProperties: any, updateVNFDinVNFPackage: any, handleVNFDPopup: any}> {
    vnfdWrapperRef: any;
    vnfdPopupRef: any;

    constructor(props: any) {
        super(props);
        this.vnfdWrapperRef = React.createRef();
        this.vnfdPopupRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            this.toggleActiveClasses();
        }, 250);
    }

    toggleActiveClasses = () => {
        let wrapperNode = ReactDOM.findDOMNode(this.vnfdWrapperRef.current) as HTMLInputElement;
        wrapperNode.classList.toggle("vnfd-popup-wrapper-visible");

        let popupNode = ReactDOM.findDOMNode(this.vnfdPopupRef.current) as HTMLInputElement;
        popupNode.classList.toggle("vnfd-popup-visible");
    }

    handleCPUChange = (event: any) => {
        const newNumCPUs = event.target.value;
        const newProperties = {... this.props.vnfdPropertiesState, numCPUs: newNumCPUs};
        this.props.setVNFDProperties(newProperties);
    }

    handleMemSizeChange = (event: any) => {
        const newMemSize = event.target.value;
        const newProperties = {... this.props.vnfdPropertiesState, memSize: newMemSize};
        this.props.setVNFDProperties(newProperties);
    }

    handleDiskSizeChange = (event: any) => {
        const newDiskSize = event.target.value;
        const newProperties = {... this.props.vnfdPropertiesState, diskSize: newDiskSize};
        this.props.setVNFDProperties(newProperties);
    }

    closePopup = () => {
        this.props.handleVNFDPopup(false);
    }

    updateVNFDinVNFPackage = () => {
        this.closePopup();
        this.props.updateVNFDinVNFPackage(this.props.vnfdPropertiesState, this.props.vnfd);
    }

    render() {
        return (
            <div className="popup-wrapper vnfd-popup-wrapper" ref={this.vnfdWrapperRef}>
                <div className="popup vnfd-popup" ref={this.vnfdPopupRef}>
                    <div className="popup-header">
                        <p className="popup-header-title">Manage VNFD Properties</p>
                        <p className="vnfd-popup-header-vnf-name">{this.props.vnfdPropertiesState.name}</p>
                    </div>

                    <div className="popup-content">
                        <p>Number of CPUs</p>
                        <input type="text" placeholder="Number of CPUs" value={this.props.vnfdPropertiesState.numCPUs} onChange={this.handleCPUChange} />
                        <p>Memory Size</p>
                        <input type="text" placeholder="Memory Size" value={this.props.vnfdPropertiesState.memSize} onChange={this.handleMemSizeChange} />
                        <p>Disk Size</p>
                        <input type="text" placeholder="Disk Size" value={this.props.vnfdPropertiesState.diskSize} onChange={this.handleDiskSizeChange} />
                    </div>

                    <div className="popup-buttons">
                        <button className="popup-button-apply" onClick={this.updateVNFDinVNFPackage}>Apply Changes</button>
                        <button className="popup-button-cancel" onClick={this.closePopup}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        vnfdPropertiesState: state.userInterfaceState.drawingBoardState.vnfdPropertiesState,
        vnfd: state.userInterfaceState.drawingBoardState.vnfd,
        vnfPackages: state.sfcPackageState.vnfPackages,
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        setVNFDProperties: (vnfdProperties: VNFDPropertiesState) => {
            dispatch(setVNFDProperties(vnfdProperties));
        },
        resetVNFDProperties: () => {
            dispatch(resetVNFDProperties());
        },
        updateVNFDinVNFPackage: (vnfdProperties: VNFDPropertiesState, vnfd: object) => {
            dispatch<any>(updateVNFDInVNFPackage(vnfdProperties, vnfd));
        },
        handleVNFDPopup: (showVNFDPopup: boolean) => {
            dispatch(handleVNFDPopup(showVNFDPopup));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VNFDPopup);