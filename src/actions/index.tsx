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
    type: constants.UPDATE_VNF_PACKAGES;
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

export interface SelectNodeOrEdge {
    type: constants.SELECT_NODE_OR_EDGE;
    selected: INode | IEdge;
}

export interface IncreaseXOffset {
    type: constants.INCREASE_X_OFFSET;
    xOffset: number;
}

export type GraphAction = UpdateEdges | UpdateNodes | SelectNodeOrEdge | IncreaseXOffset;


// DrawingBoardAction

export interface SetVNFDProperties {
    type: constants.SET_VNFD_PROPERTIES;
    vnfdProperties: VNFDPropertiesState;
}

export interface ResetVNFDProperties {
    type: constants.RESET_VNFD_PROPERTIES;
}

export interface SetVNFD {
    type: constants.SET_VNFD;
    vnfd: object;
}

export type DrawingBoardAction = SetVNFDProperties | ResetVNFDProperties | SetVNFD | GraphAction;


// UserInterfaceAction

export interface FailedToCreateVNFP {
    type: constants.FAILED_TO_CREATE_VNFP;
    vnfTemplate: VNFTemplate;
}

export interface FailedToExtractPropertiesFromVNFD {
    type: constants.FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD;
    name: string;
}

export interface UpdatedVNFDInVNFPackage {
    type: constants.UPDATED_VNFD_IN_VNF_PACKAGE;
    name: string;
}

export interface FailedToUpdateVNFDInVNFPackage {
    type: constants.FAILED_TO_UPDATE_VNFD_IN_VNF_PACKAGE;
    name: string;
}


// UserInterfaceAction

export type UserInterfaceAction = FailedToCreateVNFP | FailedToExtractPropertiesFromVNFD | UpdatedVNFDInVNFPackage | FailedToUpdateVNFDInVNFPackage | DrawingBoardAction ;


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

export function updateVNFPackages(vnfPackages: VNFPackage[]) {
    return {
        type: constants.UPDATE_VNF_PACKAGES,
        vnfPackages: vnfPackages
    }
}

export function failedToCreateVNFP(vnfTemplate: VNFTemplate) {
    return {
        type: constants.FAILED_TO_CREATE_VNFP,
        vnfTemplate: vnfTemplate
    }
}

export function selectNodeOrEdge(selected: INode | IEdge) {
    return {
        type: constants.SELECT_NODE_OR_EDGE,
        selected: selected
    }
}

export function increaseXOffset(xOffset: number) {
    return {
        type: constants.INCREASE_X_OFFSET,
        xOffset: xOffset
    }
}

export function createVNFPAndAddVNFTtoSFC(vnfTemplate: VNFTemplate, nodes: INode[], vnfPackages: VNFPackage[], xOffset: number) {
    return (dispatch: Dispatch) => {

        const uuid: string = uuidv1();

        const vnfDTO: VNFDTO = {
            file_base_64: vnfTemplate.fileBase64,
            uuid: uuid,
            vnf_name: vnfTemplate.name
        };

        console.log(vnfDTO);

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

                dispatch(updateVNFPackages(newVNFPackages));

                const node: INode = {
                    title: vnfTemplate.name,
                    id: uuid,
                    x: xOffset,
                    y: 500,
                    type: 'vnfNode'
                }
                const newNodes: INode[] = nodes.slice();
                newNodes.push(node);

                dispatch(increaseXOffset(xOffset + 250));
                dispatch(updateNodes(newNodes));
                return dispatch(selectNodeOrEdge(node));
            },
            error => {
                console.log(error);
                return dispatch(failedToCreateVNFP(vnfTemplate));
            }
        )
    }
}

export function failedToExtractPropertiesFromVNFD(name: string) {
    return {
        type: constants.FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD,
        name: name
    }
}

export function setVNFDProperties(properties: VNFDPropertiesState) {
    return {
        type: constants.SET_VNFD_PROPERTIES,
        vnfdProperties: properties
    }
}

export function resetVNFDProperties() {
    return {
        type: constants.RESET_VNFD_PROPERTIES,
    }
}

export function setVNFD(vnfd: object) {
    return {
        type: constants.SET_VNFD,
        vnfd: vnfd
    }
}

export function getVNFDProperties(uuid: string, name: string) {
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
                    diskSize: rawProperties['disk_size'],
                    uuid: uuid,
                    name: name
                };

                dispatch(setVNFD(data));
                return dispatch(setVNFDProperties(properties));
            },
            error => {
                console.log(error);
                return dispatch(failedToExtractPropertiesFromVNFD(name));
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

export function updatedVNFDInVNFPackage(name: string) {
    return {
        type: constants.UPDATED_VNFD_IN_VNF_PACKAGE,
        name: name
    }
}

export function failedToUpdateVNFDInVNFPackage(name: string) {
    return {
        type: constants.FAILED_TO_UPDATE_VNFD_IN_VNF_PACKAGE,
        name: name
    }
}

export function updateVNFDInVNFPackage(vnfdProperties: VNFDPropertiesState, vnfd: object) {
    return (dispatch: Dispatch) => {

        let newVNFD = JSON.parse(JSON.stringify(vnfd));
        newVNFD['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['num_cpus'] = vnfdProperties.numCPUs;
        newVNFD['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['mem_size'] = vnfdProperties.memSize;
        newVNFD['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['disk_size'] = vnfdProperties.diskSize;

        fetch(GENEVIZ_FILE_API + "/vnf/" + vnfdProperties.uuid + "/" + vnfdProperties.name, {
            method: "PUT",
            body: JSON.stringify(newVNFD),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                return dispatch(updatedVNFDInVNFPackage(vnfdProperties.name));
            },
            error => {
                console.log(error);
                return dispatch(failedToUpdateVNFDInVNFPackage(vnfdProperties.name));
            }
        );
    }
}

export function removeNodeFromGraph(newNodes: INode[], uuid: string, edges: IEdge[], vnfPackages: VNFPackage[]) {
    return (dispatch: Dispatch) => {
        dispatch(selectNodeOrEdge({} as INode));
        dispatch(updateEdges(edges.filter(edge => {
            return edge.source !== uuid && edge.target !== uuid;
        })));
        dispatch(updateNodes(newNodes));

        // TODO: Add here an async function with the Flask API to delete the .ZIP file completely also
        return dispatch(updateVNFPackages(vnfPackages.filter(vnfPackage => vnfPackage.uuid !== uuid)));
    }
}