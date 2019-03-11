import * as constants from '../constants';
import {VNFPackage, VNFTemplate, VNFDTO, VNFDProperties, StoreState} from "../types";
import { Dispatch } from "redux";
import fetch from "cross-fetch";
import { GENEVIZ_FILE_API } from "../constants";
const uuidv1 = require('uuid/v1');

// Actions only describe what happened, but don't describe how the application's state changes.

// Action Types (Used finally for the GenevizAction type)

// VNFTemplateAction

export interface UploadVNFTemplate {
    type: constants.UPLOAD_VNF_TEMPLATE;
    vnfTemplate: VNFTemplate;
}

export interface DeleteVNFTemplate {
    type: constants.DELETE_VNF_TEMPLATE;
    uuid: string;
}

export type VNFTemplateAction = UploadVNFTemplate | DeleteVNFTemplate;


// SFCAction

export interface AddVNFToSFC {
    type: constants.ADD_VNF_TO_SFC;
    vnfPackage: VNFPackage;
}

export interface RemoveVNFFromSFC {
    type: constants.REMOVE_VNF_FROM_SFC;
    uuid: string;
}

export type SFCAction = AddVNFToSFC | RemoveVNFFromSFC ;


// UserInterfaceAction

export interface AddErrorFailedToCreateVNFP {
    type: constants.ADD_ERROR_FAILED_TO_CREATE_VNFP;
    vnfTemplate: VNFTemplate;
}

export interface ExtractPropertiesFromVNFD {
    type: constants.EXTRACT_PROPERTIES_FROM_VNFD;
    vnfdProperties: VNFDProperties;
    name: string;
}

export interface AddErrorFailedToExtractPropertiesFromVNFD {
    type: constants.ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD;
    name: string;
}

export type UserInterfaceAction = AddErrorFailedToCreateVNFP | AddErrorFailedToExtractPropertiesFromVNFD | ExtractPropertiesFromVNFD;


// GenevizAction

export type GenevizAction = VNFTemplateAction | SFCAction | UserInterfaceAction;


// Action Creators (Like stamps for not using the raw object construct of Actions every time you need them

export function uploadVNFTemplate(vnfTemplate: VNFTemplate) {
    return {
        type: constants.UPLOAD_VNF_TEMPLATE,
        vnfTemplate: vnfTemplate
    }
}

export function deleteVNFTemplate(uuid: string) {
    return {
        type: constants.DELETE_VNF_TEMPLATE,
        uuid: uuid
    }
}

export function addVNFToSFC(vnfPackage: VNFPackage) {
    return {
        type: constants.ADD_VNF_TO_SFC,
        vnfPackage: vnfPackage
    }
}

export function addErrorFailedToCreateVNFP(vnfTemplate: VNFTemplate) {
    return {
        type: constants.ADD_ERROR_FAILED_TO_CREATE_VNFP,
        vnfTemplate: vnfTemplate
    }
}

export function createVNFPAndAddVNFTtoSFC(vnfTemplate: VNFTemplate) {
    return (dispatch: Dispatch) => {

        const vnfDTO: VNFDTO = {
            fileBase64: vnfTemplate.fileBase64,
            uuid: uuidv1()
        };

        fetch(GENEVIZ_FILE_API + "/vnf", {
            method: "POST",
            body: JSON.stringify(vnfDTO),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                const vnfPackage: VNFPackage = {
                    name: vnfTemplate.name,
                    uuid: vnfDTO.uuid
                };
                return dispatch(addVNFToSFC(vnfPackage))
            },
            error => {
                console.log(error);
                return dispatch(addErrorFailedToCreateVNFP(vnfTemplate));
            }
        )
    }
}

export function addErrorFailedToExtractPropertiesFromVNFD(name: string) {
    return {
        type: constants.ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD,
        name: name
    }
}

export function addPropertiesFromVNFD(properties: VNFDProperties, name: string) {
    return {
        type: constants.EXTRACT_PROPERTIES_FROM_VNFD,
        vnfdProperties: properties,
        name: name,
    }
}

export function getVNFD(uuid: string, name: string) {
    return (dispatch: Dispatch) => {

        fetch(GENEVIZ_FILE_API + "/vnf/" + uuid + "/" + name, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                const rawProperties = data['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties'];
                let properties: VNFDProperties = {
                    numCPUs: rawProperties['num_cpus'],
                    memSize: rawProperties['mem_size'],
                    diskSize: rawProperties['disk_size']
                };
                return dispatch(addPropertiesFromVNFD(properties, name))
            },
            error => {
                console.log(error);
                return dispatch(addErrorFailedToExtractPropertiesFromVNFD(name));
            }
        )
    }
}