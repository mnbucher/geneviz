import * as constants from '../constants';
import {VNFPackage, VNFTemplate} from "../types";

// Actions only describe what happened, but don't describe how the application's state changes.

// Action Types

export interface UploadVNFTemplate {
    type: constants.UPLOAD_VNF_TEMPLATE;
    vnfTemplate: VNFTemplate;
}

export interface DeleteVNFTemplate {
    type: constants.DELETE_VNF_TEMPLATE;
    uuid: string;
}

export type VNFTemplateAction = UploadVNFTemplate | DeleteVNFTemplate;

export interface AddVNFToSFC {
    type: constants.ADD_VNF_TO_SFC;
    vnfPackage: VNFPackage;
}

export interface RemoveVNFFromSFC {
    type: constants.REMOVE_VNF_FROM_SFC;
    uuid: string;
}

export type SFCAction = AddVNFToSFC | RemoveVNFFromSFC

export type GenevizAction = VNFTemplateAction | SFCAction;


// Action Creators

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