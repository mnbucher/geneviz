import React from 'react';
import ReactDOM from 'react-dom';
import './SFCPopup.css';
import '../Popup.css';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState, SFCPackageState, SFCPackageDTO } from 'src/types';
import fileDownload from 'js-file-download';
import { GENEVIZ_FILE_API } from 'src/constants';
import { handleSFCPopup, setNSDName } from 'src/actions';
import { toast } from 'react-toastify';

class SFCPopup extends React.Component<{handleSFCPopup: any, setNSDName: any, sfcPackageState: SFCPackageState}> {
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
        if(this.props.sfcPackageState.nsdName === ""){
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
               vnf_packages: groupedVNFPackages,
               vnffgd: this.props.sfcPackageState.vnffgd,
               nsd_name: this.props.sfcPackageState.nsdName
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
                 toast.error("Could not download the SFC Package");
             });
        }
    }

    handleNSDNameChange = (event: any) => {
        this.props.setNSDName(event.target.value);
    }

    closePopup = () => {
        this.props.handleSFCPopup(false);
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
                        <input type="text" placeholder="Custom Network Service" value={this.props.sfcPackageState.nsdName} onChange={this.handleNSDNameChange} />
                    </div>

                    <div className="popup-buttons">
                        <button className="popup-button-apply" onClick={this.downloadSFC}>Download SFC</button>
                        <button className="popup-button-cancel" onClick={this.closePopup}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        sfcPackageState: state.sfcPackageState
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        setNSDName: (nsdName: string) => {
            dispatch(setNSDName(nsdName));
        }, 
        handleSFCPopup: (showSFCPopup: boolean) => {
            dispatch(handleSFCPopup(showSFCPopup));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SFCPopup)