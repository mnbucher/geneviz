import React from 'react';
import ReactDOM from 'react-dom';
import './VNFDPropertiesPopup.css';
import {StoreState, VNFDPropertiesState, VNFPackage} from "../../types";
import {connect} from "react-redux";
import {resetVNFDProperties, setVNFDProperties, updateVNFDInVNFPackage} from "../../actions";
import {Dispatch} from "redux";

class VNFDPropertiesPopup extends React.Component<{vnfdPropertiesState: VNFDPropertiesState, vnfd: object, vnfPackages: VNFPackage[], setVNFDProperties: any, resetVNFDProperties: any, updateVNFDinVNFPackage: any}> {
    wrapperRef: any;
    popupRef: any;

    constructor(props: any) {
        super(props);
        this.wrapperRef = React.createRef();
        this.popupRef = React.createRef();
    }

    componentDidMount() {
        document.title = "GENEVIZ";

        setTimeout(() => {
            this.toggleActiveClasses();
        }, 250);
    }

    toggleActiveClasses = () => {
        let wrapperNode = ReactDOM.findDOMNode(this.wrapperRef.current) as HTMLInputElement;
        wrapperNode.classList.toggle("vnfd-properties-popup-wrapper-visible");

        let popupNode = ReactDOM.findDOMNode(this.popupRef.current) as HTMLInputElement;
        popupNode.classList.toggle("vnfd-properties-popup-visible");
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
        this.toggleActiveClasses();
        setTimeout(() => {
            this.props.resetVNFDProperties();
        }, 250);
    }

    updateVNFDinVNFPackage = () => {
        this.closePopup();
        this.props.updateVNFDinVNFPackage(this.props.vnfdPropertiesState, this.props.vnfd);
    }

    render() {
        return (
            <div className="vnfd-properties-popup-wrapper" ref={this.wrapperRef}>
                <div className="vnfd-properties-popup" ref={this.popupRef}>
                    <div className="vnfd-properties-popup-header">
                        <p>Manage VNF Properties</p>
                        <p>{this.props.vnfdPropertiesState.name}</p>
                    </div>

                    <div className="vnfd-properties-popup-content">
                        <p>Number of CPUs</p>
                        <input type="text" placeholder="Number of CPUs" value={this.props.vnfdPropertiesState.numCPUs} onChange={this.handleCPUChange} />
                        <p>Memory Size</p>
                        <input type="text" placeholder="Memory Size" value={this.props.vnfdPropertiesState.memSize} onChange={this.handleMemSizeChange} />
                        <p>Disk Size</p>
                        <input type="text" placeholder="Disk Size" value={this.props.vnfdPropertiesState.diskSize} onChange={this.handleDiskSizeChange} />
                    </div>

                    <div className="vnfd-properties-popup-buttons">
                        <button className="vnfd-properties-popup-button-apply" onClick={this.updateVNFDinVNFPackage}>Apply Changes</button>
                        <button className="vnfd-proeprties-popup-button-cancel" onClick={this.closePopup}>Cancel</button>
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VNFDPropertiesPopup);