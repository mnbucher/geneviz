import * as constants from '../constants';
import { VNFPackage, VNFTemplate, VNFDTO, VNFDPropertiesState, NSDPropertiesState } from "../types";
import { Dispatch } from "redux";
import fetch from "cross-fetch";
import { GENEVIZ_FILE_API } from "../constants";
import uuidv1 from 'uuid';
import { IEdge, INode } from "react-digraph";
import { toast } from 'react-toastify';

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

export interface SetNSDProperties {
    type: constants.SET_NSD_PROPERTIES;
    nsdProperties: NSDPropertiesState;
}

export interface SetVNFD {
    type: constants.SET_VNFD;
    uuid: string;
    vnfd: object;
}

export type SFCAction = UdpateVNFsInSFC | SetNSDProperties | SetVNFD;


// GraphAction

export interface UpdateEdges {
    type: constants.UPDATE_EDGES;
    edges: IEdge[];
}

export interface UpdateNodes {
    type: constants.UPDATE_NODES;
    nodes: INode[];
}

export interface UpdateGraph {
    type: constants.UPDATE_GRAPH;
    edges: IEdge[];
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

export type GraphAction = UpdateEdges | UpdateNodes | UpdateGraph | SelectNodeOrEdge | IncreaseXOffset;


// DrawingBoardAction

export interface SetVNFDProperties {
    type: constants.SET_VNFD_PROPERTIES;
    vnfdProperties: VNFDPropertiesState;
}

export interface ResetVNFDProperties {
    type: constants.RESET_VNFD_PROPERTIES;
}

export type DrawingBoardAction = SetVNFDProperties | ResetVNFDProperties | GraphAction;


// UserInterfaceAction

export interface FailedToCreateVNFP {
    type: constants.FAILED_TO_CREATE_VNFP;
    vnfTemplate: VNFTemplate;
}

export interface FailedToExtractPropertiesFromVNFD {
    type: constants.FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD;
    name: string;
}

export interface FailedToUpdateVNFDInVNFPackage {
    type: constants.FAILED_TO_UPDATE_VNFD_IN_VNF_PACKAGE;
    name: string;
}

export interface HandleSFCPopup {
    type: constants.HANDLE_SFC_POPUP;
    showSFCPopup: boolean;
}

export interface HandleVNFDPopup {
    type: constants.HANDLE_VNFD_POPUP;
    showVNFDPopup: boolean;
}

export type UserInterfaceAction = FailedToCreateVNFP | FailedToExtractPropertiesFromVNFD | FailedToUpdateVNFDInVNFPackage | DrawingBoardAction | HandleSFCPopup | HandleVNFDPopup;


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
                return dispatch(setVNFD(uuid, data));
            },
            error => {
                console.log(error);
                toast.error("Coult not get VNF Descriptor");
                return dispatch(failedToExtractPropertiesFromVNFD(name));
            }
        );
    }
}

export function createVNFPAndAddNodeToSFC(vnfTemplate: VNFTemplate, nodes: INode[], vnfPackages: VNFPackage[], xOffset: number) {
    return (dispatch: Dispatch) => {

        const uuid: string = uuidv1();
        const vnfDTO: VNFDTO = {
            file_base_64: vnfTemplate.fileBase64,
            uuid: uuid,
            vnf_name: vnfTemplate.name
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
                toast.success("Successfully created VNF Package");

                const newVNFPackage: VNFPackage = {
                    name: vnfTemplate.name,
                    uuid: vnfDTO.uuid,
                    vnfd: {}
                };
                const newVNFPackages = vnfPackages.slice();
                newVNFPackages.push(newVNFPackage);
                dispatch(updateVNFPackages(newVNFPackages));

                dispatch<any>(getVNFD(vnfDTO.uuid, vnfTemplate.name));

                const node: INode = {
                    title: vnfTemplate.name,
                    id: uuid,
                    x: xOffset,
                    y: 500,
                    type: 'vnfNode'
                }
                const newNodes: INode[] = nodes.slice();
                newNodes.push(node);
                dispatch(updateNodes(newNodes));

                dispatch(increaseXOffset(xOffset + 250));

                return dispatch(selectNodeOrEdge(node));
            },
            error => {
                console.log(error);
                toast.error("Coult not reach GENEVIZ File API");
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

export function setVNFD(uuid: string, vnfd: object) {
    return {
        type: constants.SET_VNFD,
        uuid: uuid,
        vnfd: vnfd
    }
}

export function getVNFDProperties(uuid: string, name: string, vnfd: object) {
    return (dispatch: Dispatch) => {
        const rawProperties = vnfd['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties'];
        
        let properties: VNFDPropertiesState = {
            uuid: uuid,
            name: name,
            numCPUs: rawProperties['num_cpus'],
            memSize: rawProperties['mem_size'],
            diskSize: rawProperties['disk_size'],
        };

        dispatch(setVNFDProperties(properties));
        return dispatch(handleVNFDPopup(true));

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

export function updateGraph(edges: IEdge[], nodes: INode[]) {
    return {
        type: constants.UPDATE_GRAPH,
        edges: edges,
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

export function updateVNFD(vnfdProperties: VNFDPropertiesState, vnfd: object) {
    return (dispatch: Dispatch) => {
        vnfd['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['num_cpus'] = vnfdProperties.numCPUs;
        vnfd['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['mem_size'] = vnfdProperties.memSize;
        vnfd['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['disk_size'] = vnfdProperties.diskSize;

        fetch(GENEVIZ_FILE_API + "/vnf/" + vnfdProperties.uuid + "/" + vnfdProperties.name, {
            method: "PUT",
            body: JSON.stringify(vnfd),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                toast.success("Updated VNFD successfully");
                return dispatch(setVNFD(vnfdProperties.uuid, vnfd));
            },
            error => {
                console.log(error);
                toast.error("Coult not update the VNF Descriptor");
                return dispatch(failedToUpdateVNFDInVNFPackage(vnfdProperties.name));
            }
        );
    }
}

export function removeNodeFromGraph(newNodes: INode[], uuid: string, oldEdges: IEdge[], vnfPackages: VNFPackage[]) {
    return (dispatch: Dispatch) => {
        const newEdges = oldEdges.filter(edge => {
            return edge.source !== uuid && edge.target !== uuid;
        });
        dispatch(updateGraph(newEdges, newNodes));

        return dispatch(updateVNFPackages(vnfPackages.filter(vnfPackage => vnfPackage.uuid !== uuid)));
    }
}

export function handleSFCPopup(showSFCPopup: boolean) {
    return {
        type: constants.HANDLE_SFC_POPUP,
        showSFCPopup: showSFCPopup
    }
}

export function handleVNFDPopup(showVNFDPopup: boolean) {
    return {
        type: constants.HANDLE_VNFD_POPUP,
        showVNFDPopup: showVNFDPopup
    }
}

export function setNSDProperties(nsdProperties: NSDPropertiesState) {
    return {
        type: constants.SET_NSD_PROPERTIES,
        nsdProperties: nsdProperties
    }
}