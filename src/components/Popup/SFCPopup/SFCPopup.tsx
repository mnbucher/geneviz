import React from 'react';
import ReactDOM from 'react-dom';
import './SFCPopup.css';
import '../Popup.css';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState, SFCPackageState, SFCPackageDTO, NSDPropertiesState, GraphViewState, BCPropertiesState } from 'src/types';
import fileDownload from 'js-file-download';
import { GENEVIZ_FILE_API } from 'src/constants';
import { handleSFCPopup, setNSDProperties, setBCProperties } from 'src/actions';
import { toast } from 'react-toastify';
import { getSFCPath } from 'src/constants/GraphHelper';

class SFCPopup extends React.Component<{handleSFCPopup: any, setNSDProperties: any, setBCProperties: any, sfcPackageState: SFCPackageState, graphView: GraphViewState}> {
    sfcWrapperRef: any;
    sfcPopupRef: any;

    constructor(props: any) {
        super(props);
        this.sfcWrapperRef = React.createRef();
        this.sfcPopupRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            this.toggleActiveClasses();
        }, 250);
    }

    toggleActiveClasses = () => {
        let wrapperNode = ReactDOM.findDOMNode(this.sfcWrapperRef.current) as HTMLInputElement;
        wrapperNode.classList.toggle("sfc-popup-wrapper-visible");

        let popupNode = ReactDOM.findDOMNode(this.sfcPopupRef.current) as HTMLInputElement;
        popupNode.classList.toggle("sfc-popup-visible");
    }

    downloadSFC = () => {
        if(this.props.sfcPackageState.nsd.name === ""){
            toast.error("Please provide a name for the Network Service");
        }
        else {
            let groupedVNFPackages = this.props.sfcPackageState.vnfPackages.reduce((acc, obj) => {
                let key = obj['name'];
                if(!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj['uuid']);
                return acc;
             }, {});
     
             const sfcPackageDTO: SFCPackageDTO = {
               vnfPackages: groupedVNFPackages,
               path: getSFCPath(this.props.sfcPackageState.vnfPackages, this.props.graphView.graph.edges),
               nsd: this.props.sfcPackageState.nsd,
               bc: this.props.sfcPackageState.bc,
             };
     
             fetch(GENEVIZ_FILE_API + "/sfc/generate", {
                 method: "POST",
                 body: JSON.stringify(sfcPackageDTO),
                 headers: {
                     "Content-Type": "application/json"
                 }
             }).then(response => {
                 return response.blob();
             }).then(data => {
                 fileDownload(data, "sfc-package.zip");
                 this.props.handleSFCPopup(false);
             }, error => {
                 console.log(error);
                 toast.error("Could not download the SFC Package");
             });
        }
    }

    handleNSDNameChange = (event: any) => {
        this.props.setNSDProperties({... this.props.sfcPackageState.nsd, name: event.target.value});
    }

    handleVendorChange = (event: any) => {
        this.props.setNSDProperties({... this.props.sfcPackageState.nsd, vendor: event.target.value});
    }

    handleVersionChange = (event: any) => {
        this.props.setNSDProperties({... this.props.sfcPackageState.nsd, version: event.target.value});
    }

    handleShowBCPropertiesChange = (event: any) => {
        this.props.setBCProperties({... this.props.sfcPackageState.bc, storeOnBC: event.target.checked});
    }

    handleAddressChange = (event: any) => {
        this.props.setBCProperties({... this.props.sfcPackageState.bc, address: event.target.value});
    }

    handlePrivateKeyChange = (event: any) => {
        this.props.setBCProperties({... this.props.sfcPackageState.bc, privateKey: event.target.value});
    }

    render() {
        return (
            <div className="popup-wrapper sfc-popup-wrapper" ref={this.sfcWrapperRef}>
                <div className="popup sfc-popup" ref={this.sfcPopupRef}>
                    <div className="popup-header">
                        <p className="popup-header-title">Generate SFC Package</p>
                    </div>

                    <div className="popup-content">
                        <p>Name of SFC Package</p>
                        <input type="text" placeholder="Custom Network Service" value={this.props.sfcPackageState.nsd.name} onChange={this.handleNSDNameChange} />
                        <p>Vendor</p>
                        <input type="text" placeholder="Custom Network Service" value={this.props.sfcPackageState.nsd.vendor} onChange={this.handleVendorChange} />
                        <p>Version</p>
                        <input type="text" placeholder="1.0" value={this.props.sfcPackageState.nsd.version} onChange={this.handleVersionChange} />

                        <label>
                            Store Hash of SFC Package on the Ethereum Blockchain for later Verification
                            <input type="checkbox" checked={this.props.sfcPackageState.bc.storeOnBC} onChange={this.handleShowBCPropertiesChange} />
                        </label>

                        {this.props.sfcPackageState.bc.storeOnBC ?
                            <div className="sfc-popup-bc-properties">
                                <p>Address of Ethereum Account</p>
                                <input type="text" placeholder="Address of the Wallet" value={this.props.sfcPackageState.bc.address} onChange={this.handleAddressChange} />
                                <p>Private Key of Ethereum Account</p>
                                <input type="text" placeholder="Private Key to Sign the Transacation" value={this.props.sfcPackageState.bc.privateKey} onChange={this.handlePrivateKeyChange} />
                            </div>
                            : null}
                    </div>

                    <div className="popup-buttons">
                        <button className="popup-button-apply" onClick={this.downloadSFC}>Download SFC</button>
                        <button className="popup-button-cancel" onClick={() => this.props.handleSFCPopup(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        sfcPackageState: state.sfcPackageState,
        graphView: state.userInterfaceState.drawingBoardState.graphViewState
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        setNSDProperties: (nsd: NSDPropertiesState) => {
            dispatch(setNSDProperties(nsd));
        }, 
        handleSFCPopup: (showSFCPopup: boolean) => {
            dispatch(handleSFCPopup(showSFCPopup));
        },
        setBCProperties: (bc: BCPropertiesState) => {
            dispatch(setBCProperties(bc));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SFCPopup)