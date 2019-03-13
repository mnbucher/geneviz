import * as constants from '../constants';
import {VNFPackageState, VNFTemplateState, VNFDTO, VNFDPropertiesState } from "../types";
import { Dispatch } from "redux";
import fetch from "cross-fetch";
import { GENEVIZ_FILE_API } from "../constants";
import uuidv1 from 'uuid';
import {IEdge, INode} from "react-digraph";

// Actions only describe what happened, but don't describe how the application's state changes.

// Action Types (Used finally for the GenevizAction type)

// VNFTemplateAction

export interface UploadVNFTemplate {
    type: constants.UPLOAD_VNF_TEMPLATE;
    vnfTemplate: VNFTemplateState;
}

export interface DeleteVNFTemplate {
    type: constants.DELETE_VNF_TEMPLATE;
    uuid: string;
}

export type VNFTemplateAction = UploadVNFTemplate | DeleteVNFTemplate;


// SFCAction

export interface AddVNFToSFC {
    type: constants.ADD_VNF_TO_SFC;
    vnfPackage: VNFPackageState;
}

export interface RemoveVNFFromSFC {
    type: constants.REMOVE_VNF_FROM_SFC;
    uuid: string;
}

export type SFCAction = AddVNFToSFC | RemoveVNFFromSFC ;


// UserInterfaceAction

export interface AddErrorFailedToCreateVNFP {
    type: constants.ADD_ERROR_FAILED_TO_CREATE_VNFP;
    vnfTemplate: VNFTemplateState;
}

export interface ExtractPropertiesFromVNFD {
    type: constants.EXTRACT_PROPERTIES_FROM_VNFD;
    vnfdProperties: VNFDPropertiesState;
    name: string;
}

export interface AddErrorFailedToExtractPropertiesFromVNFD {
    type: constants.ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD;
    name: string;
}

export interface UpdateEdges {
    type: constants.UPDATE_EDGES;
    edges: IEdge[];
}

export interface UpdateNodes {
    type: constants.UPDATE_NODES;
    nodes: INode[];
}

export type UserInterfaceAction = AddErrorFailedToCreateVNFP | AddErrorFailedToExtractPropertiesFromVNFD | ExtractPropertiesFromVNFD | UpdateEdges | UpdateNodes;


// GenevizAction

export type GenevizAction = VNFTemplateAction | SFCAction | UserInterfaceAction;


// Action Creators (Like stamps for not using the raw object construct of Actions every time you need them

export function uploadVNFTemplate(vnfTemplate: VNFTemplateState) {
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

export function addVNFToSFC(vnfPackage: VNFPackageState) {
    return {
        type: constants.ADD_VNF_TO_SFC,
        vnfPackage: vnfPackage
    }
}

export function addErrorFailedToCreateVNFP(vnfTemplate: VNFTemplateState) {
    return {
        type: constants.ADD_ERROR_FAILED_TO_CREATE_VNFP,
        vnfTemplate: vnfTemplate
    }
}

export function createVNFPAndAddVNFTtoSFC(vnfTemplate: VNFTemplateState) {
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
                const vnfPackage: VNFPackageState = {
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

export function addPropertiesFromVNFD(properties: VNFDPropertiesState, name: string) {
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
                let properties: VNFDPropertiesState = {
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

export function updateEdges(edges: IEdge[]) {
    return {
        type: constants.UPDATE_EDGES,
        edges: edges
    }
}

export function updateNodes(nodes: INode[]) {
    return {
        type: constants.UPDATE_NODES,
        nodes: nodes
    }
}