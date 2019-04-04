import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import { StoreState, VNFTemplate } from "../../../types";
const JSZip = require("jszip");
import uuidv1 from 'uuid';
import './ToolsMenuDropZone.css';
import { connect } from "react-redux";
import { uploadVNFTemplate } from "../../../actions";
import { Dispatch } from "redux";
import { toast } from 'react-toastify';

class ToolsMenuDropZone extends React.Component<{addVNF: any, vnfTemplates: VNFTemplate[]}> {

    isAlreadyAdded = (fileBase64: string) => {
        const currentVNFs = this.props.vnfTemplates;
        let sameFileWasFound: boolean = false;

        currentVNFs.map((vnf) => {
            if (vnf.fileBase64 == fileBase64 as string){
                sameFileWasFound = true;
            }
        });

        return sameFileWasFound;
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

                        let vnfTemplate: VNFTemplate = {
                            name: fileName,
                            fileBase64: fileBase64,
                            uuid: uuidv1()
                        };
                        this.isAlreadyAdded(fileBase64 as string) ? toast.error('This .zip file was already added.') : this.props.addVNF(vnfTemplate);
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
                                        <p>Upload a VNF Package by dropping the file directly here or by clicking here to select a file (only .zip files allowed).</p>
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
        vnfTemplates: state.vnfTemplates
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        addVNF: (vnfTemplate: VNFTemplate) => {
            dispatch(uploadVNFTemplate(vnfTemplate));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuDropZone);