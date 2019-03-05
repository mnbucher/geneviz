import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import * as constants from '../../../constants';
import { VNFPackage } from "../../../types";
const JSZip = require("jszip");
const uuidv1 = require('uuid/v1');
import './ToolsMenuDropZone.css';

class ToolsMenuDropZone extends React.Component<{addVNF: any, vnfs: VNFPackage[]}> {

    isAlreadyAdded = (fileBase64: string) => {
        const currentVNFs = this.props.vnfs as VNFPackage[];
        let sameFileWasFound: boolean = false;

        currentVNFs.map((vnf) => {
            if (vnf.fileBase64 == fileBase64 as string){
                console.log("already exists!");
                sameFileWasFound = true;
            }
        });

        return sameFileWasFound;
    }

    onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            const fileName = file.name;

            reader.onload = () => {
                const zipAsBinaryString = reader.result;
                let zip = new JSZip();

                zip.loadAsync(zipAsBinaryString).then((zipFile: any) => {
                    let pathForDescriptor: string;

                    zipFile.forEach((path: any, file: any) => {
                        if (file.name.indexOf(constants.VNF_DESCRIPTOR_PATH) != -1){
                            pathForDescriptor = path;
                            zip.files[pathForDescriptor].async('text').then((vnfd: object) => {

                                let vnfPackage: VNFPackage = {
                                    name: fileName,
                                    vnfd: vnfd,
                                    fileBase64: zipAsBinaryString as string,
                                    uuid: uuidv1()
                                };

                                this.isAlreadyAdded(zipAsBinaryString as string) ? alert('This File was already added!') : this.props.addVNF(vnfPackage);
                            });
                        }
                    })
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
                                        <p>Upload a VNF Package (only .ZIP files allowed) by dropping the file directly here or by clicking here to select a file.</p>
                                }
                            </div>
                        )
                    }}
                </Dropzone>
            </div>
        );
    }
}

export default ToolsMenuDropZone;