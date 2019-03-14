import * as constants from '../constants';
import {VNFPackage, VNFTemplate, VNFDTO, VNFDPropertiesState } from "../types";
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
    vnfTemplate: VNFTemplate;
}

export interface DeleteVNFTemplate {
    type: constants.DELETE_VNF_TEMPLATE;
    uuid: string;
}

export type VNFTemplateAction = UploadVNFTemplate | DeleteVNFTemplate;


// SFCAction

export interface UdpateVNFsInSFC {
    type: constants.UPDATE_VNFS_IN_SFC;
    vnfPackages: VNFPackage[];
}

export type SFCAction = UdpateVNFsInSFC;


// GraphAction

export interface UpdateEdges {
    type: constants.UPDATE_EDGES;
    edges: IEdge[];
}

export interface UpdateNodes {
    type: constants.UPDATE_NODES;
    nodes: INode[];
}

export interface SelectNode {
    type: constants.SELECT_NODE;
    selectedNode: INode;
}

export type GraphAction = UpdateEdges | UpdateNodes | SelectNode;


// DrawingBoardAction

export interface ExtractPropertiesFromVNFD {
    type: constants.EXTRACT_PROPERTIES_FROM_VNFD;
    vnfdProperties: VNFDPropertiesState;
    name: string;
}

export type DrawingBoardAction = ExtractPropertiesFromVNFD | GraphAction;


// UserInterfaceAction

export interface AddErrorFailedToCreateVNFP {
    type: constants.ADD_ERROR_FAILED_TO_CREATE_VNFP;
    vnfTemplate: VNFTemplate;
}

export interface AddErrorFailedToExtractPropertiesFromVNFD {
    type: constants.ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD;
    name: string;
}


// UserInterfaceAction

export type UserInterfaceAction = AddErrorFailedToCreateVNFP | AddErrorFailedToExtractPropertiesFromVNFD | ExtractPropertiesFromVNFD | DrawingBoardAction ;


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

export function updateVNFsInSFC(vnfPackages: VNFPackage[]) {
    return {
        type: constants.UPDATE_VNFS_IN_SFC,
        vnfPackages: vnfPackages
    }
}

export function addErrorFailedToCreateVNFP(vnfTemplate: VNFTemplate) {
    return {
        type: constants.ADD_ERROR_FAILED_TO_CREATE_VNFP,
        vnfTemplate: vnfTemplate
    }
}

export function selectNode(selectedNode: INode) {
    return {
        type: constants.SELECT_NODE,
        selectedNode: selectedNode
    }
}

export function createVNFPAndAddVNFTtoSFC(vnfTemplate: VNFTemplate, nodes: INode[], vnfPackages: VNFPackage[]) {
    return (dispatch: Dispatch) => {

        const uuid: string = uuidv1();

        const vnfDTO: VNFDTO = {
            fileBase64: vnfTemplate.fileBase64,
            uuid: uuid
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
                const newVNFPackage: VNFPackage = {
                    name: vnfTemplate.name,
                    uuid: vnfDTO.uuid
                };

                const newVNFPackages = vnfPackages.slice();
                newVNFPackages.push(newVNFPackage);

                dispatch(updateVNFsInSFC(newVNFPackages));

                const node: INode = {
                    title: vnfTemplate.name,
                    id: uuid,
                    type: 'vnfNode'
                }
                const newNodes: INode[] = nodes.slice();
                newNodes.push(node);

                dispatch(updateNodes(newNodes));
                return dispatch(selectNode(node));
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

                return dispatch(addPropertiesFromVNFD(properties, name));
            },
            error => {
                console.log(error);
                return dispatch(addErrorFailedToExtractPropertiesFromVNFD(name));
            }
        );
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