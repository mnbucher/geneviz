import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import { StoreState, VNFTemplate, SFCTemplate } from "../../../types";
const JSZip = require("jszip");
import uuidv1 from 'uuid';
import './ToolsMenuDropZone.css';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { toast } from 'react-toastify';
import { addVNFTemplate, addSFCTemplate, validateSFC } from 'src/actions';
import { SFCValidationStatus } from 'src/constants';

class ToolsMenuDropZone extends React.Component<{addVNFTemplate: any, addSFCTemplate: any, validateSFC: any, vnfTemplates: VNFTemplate[], sfcTemplates: SFCTemplate[], showVNFList: boolean}> {

    isTemplateAlreadyAdded = (fileBase64: string) => {
        const templates = this.props.showVNFList ? this.props.vnfTemplates : this.props.sfcTemplates;

        const template = templates.find((template) => {
            if (template.fileBase64 == fileBase64 as string){
                return true;
            }
            return false;
        });
        return typeof template == 'undefined' ? false : true;
    }

    onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            const fileName = file.name.replace(".zip", "");

            reader.onload = () => {
                const zipAsBinaryString = reader.result;
                let zip = new JSZip();

                zip.loadAsync(zipAsBinaryString).then((zipFile: any) => {
                    zipFile.generateAsync({type:"base64"}).then((fileBase64: string) => {
                        if(this.isTemplateAlreadyAdded(fileBase64 as string)) {
                            toast.error('This .zip file was already added.')
                        }
                        else if (this.props.showVNFList) {
                            const vnfTemplate: VNFTemplate = {
                                name: fileName,
                                fileBase64: fileBase64,
                                uuid: uuidv1()
                            };
                            this.props.addVNFTemplate(vnfTemplate);
                        }
                        else {
                            const sfcTemplate: SFCTemplate = {
                                name: fileName,
                                fileBase64: fileBase64,
                                uuid: uuidv1(),
                                validationStatus: SFCValidationStatus.SFC_VALIDATION_INITIAL 
                            };
                            this.props.addSFCTemplate(sfcTemplate);
                            this.props.validateSFC(sfcTemplate);
                        }
                    });
                });
            };
            reader.readAsBinaryString(file);
        });
    }

    render() {
        return (
            <div className="toolsMenu-add-vnfs">
                <Dropzone onDrop={this.onDrop} accept="application/zip">
                    {({getRootProps, getInputProps, isDragActive}) => {
                        return (
                            <div
                                {...getRootProps()}
                                className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                            >
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop files here...</p> :
                                        <p>Upload a {this.props.showVNFList ? "VNF Package" : "SFC Package"} by dropping the file directly here or by clicking here to select a file (only .zip files allowed).</p>
                                }
                            </div>
                        )
                    }}
                </Dropzone>
            </div>
        );
    }
}


export function mapStateToProps(state: StoreState) {
    return {
        vnfTemplates: state.vnfTemplates,
        sfcTemplates: state.sfcTemplates,
        showVNFList: state.userInterfaceState.showVNFList
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        addVNFTemplate: (vnfTemplate: VNFTemplate) => {
            dispatch(addVNFTemplate(vnfTemplate));
        },
        addSFCTemplate: (sfcTemplate: SFCTemplate) => {
            dispatch(addSFCTemplate(sfcTemplate));
        },
        validateSFC: (sfcTemmplate: SFCTemplate) => {
            dispatch<any>(validateSFC(sfcTemmplate));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuDropZone);