import * as constants from '../constants';
import { VNFPackage, VNFTemplate, VNFPackageDTO, VNFDPropertiesState, NSDPropertiesState, SFCTemplate, BCPropertiesState } from "../types";
import { Dispatch } from "redux";
import fetch from "cross-fetch";
import { GENEVIZ_FILE_API } from "../constants";
import uuidv1 from 'uuid';
import { IEdge, INode } from "react-digraph";
import { toast } from 'react-toastify';
import { getEdgeType } from 'src/constants/GraphHelper';

// Actions only describe what happened, but don't describe how the application's state changes.

// Action Types (Used finally for the GenevizAction type)

// VNFTemplateAction

export interface AddVNFTemplate {
    type: constants.ADD_VNF_TEMPLATE;
    vnfTemplate: VNFTemplate;
}

export interface DeleteVNFTemplate {
    type: constants.DELETE_VNF_TEMPLATE;
    uuid: string;
}

export interface AddSFCTemplate {
    type: constants.ADD_SFC_TEMPLATE;
    sfcTemplate: SFCTemplate;
}

export interface DeleteSFCTemplate {
    type: constants.DELETE_SFC_TEMPLATE;
    uuid: string;
}

export interface SetSFCValidationStatus {
    type: constants.SET_SFC_VALIDATION_STATUS;
    uuid: string;
    status: constants.SFCValidationStatus;
}

export type TemplateAction = AddVNFTemplate | DeleteVNFTemplate | AddSFCTemplate | DeleteSFCTemplate | SetSFCValidationStatus;


// SFCAction

export interface SetVNFPackages {
    type: constants.SET_VNF_PACKAGES
    vnfPackages: VNFPackage[];
}

export interface SetNSDProperties {
    type: constants.SET_NSD_PROPERTIES;
    nsd: NSDPropertiesState;
}

export interface SetVNFD {
    type: constants.SET_VNFD;
    uuid: string;
    vnfd: object;
}

export interface SetBCProperties {
    type: constants.SET_BC_PROPERTIES;
    bc: BCPropertiesState;
}

export type SFCAction = SetVNFPackages | SetNSDProperties | SetVNFD | SetBCProperties;


// GraphAction

export interface UpdateEdges {
    type: constants.SET_EDGES;
    edges: IEdge[];
}

export interface UpdateNodes {
    type: constants.SET_NODES;
    nodes: INode[];
}

export interface UpdateGraph {
    type: constants.SET_GRAPH;
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

export interface HandleSFCPopup {
    type: constants.HANDLE_SFC_POPUP;
    showSFCPopup: boolean;
}

export interface HandleVNFDPopup {
    type: constants.HANDLE_VNFD_POPUP;
    showVNFDPopup: boolean;
}

export interface HandleVNFList {
    type: constants.HANDLE_VNF_LIST;
    showVNFList: boolean;
}

export type UserInterfaceAction = DrawingBoardAction | HandleSFCPopup | HandleVNFDPopup | HandleVNFList;


// GenevizAction

export type GenevizAction = TemplateAction | SFCAction | UserInterfaceAction;


// Action Creators (Like stamps for not using the raw object construct of Actions every time you need them

export function addVNFTemplate(vnfTemplate: VNFTemplate) {
    return {
        type: constants.ADD_VNF_TEMPLATE,
        vnfTemplate: vnfTemplate
    }
}

export function deleteVNFTemplate(uuid: string) {
    return {
        type: constants.DELETE_VNF_TEMPLATE,
        uuid: uuid
    }
}

export function addSFCTemplate(sfcTemplate: SFCTemplate) {
    return {
        type: constants.ADD_SFC_TEMPLATE,
        sfcTemplate: sfcTemplate
    }
}

export function deleteSFCTemplate(uuid: string) {
    return {
        type: constants.DELETE_SFC_TEMPLATE,
        uuid: uuid
    }
}

export function setVNFPackages(vnfPackages: VNFPackage[]) {
    return {
        type: constants.SET_VNF_PACKAGES,
        vnfPackages: vnfPackages
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

export function getVNFD(uuid: string, name: string, newVNFPackages: VNFPackage[], nodes: INode[], xOffset: number) {
    return (dispatch: Dispatch) => {

        fetch(GENEVIZ_FILE_API + "/vnfs/" + name + "/" + uuid, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                if(data['success']) {
                    dispatch(setVNFPackages(newVNFPackages.map(vnfPackage => {
                        if(vnfPackage.uuid == uuid){
                            vnfPackage.vnfd = data['vnfd'];
                            return vnfPackage;
                        }
                        return vnfPackage;
                    })));
 
                    const node: INode = {
                        title: data['vnfd']['vnfd']['name'],
                        id: uuid,
                        x: xOffset,
                        y: 500,
                        type: 'vnfNode'
                    }
                    const newNodes: INode[] = nodes.slice();
                    newNodes.push(node);

                    dispatch(increaseXOffset(xOffset + 400));
                    dispatch(updateNodes(newNodes));
                    return dispatch(selectNodeOrEdge(node));
                }
                else {
                    return toast.error("The VNF Package seems to have a wrong format. Could not get VNF Descriptor.");    
                }
            },
            error => {
                console.log(error);
                return toast.error("The VNF Package seems to have a wrong format. Could not get VNF Descriptor.");
            }
        );
    }
}

export function createVNFPAndAddNodeToSFC(vnfTemplate: VNFTemplate, nodes: INode[], vnfPackages: VNFPackage[], xOffset: number) {
    return (dispatch: Dispatch) => {

        const uuid: string = uuidv1();
        
        const vnfPackageDTO: VNFPackageDTO = {
            fileBase64: vnfTemplate.fileBase64,
            uuid: uuid,
            vnfName: vnfTemplate.name
        };

        fetch(GENEVIZ_FILE_API + "/vnfs", {
            method: "POST",
            body: JSON.stringify(vnfPackageDTO),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                if(data['success']) {
                    const newVNFPackage: VNFPackage = {
                        name: vnfTemplate.name,
                        uuid: vnfPackageDTO.uuid,
                        vnfd: {}
                    };
                    const newVNFPackages = vnfPackages.slice();
                    newVNFPackages.push(newVNFPackage);

                    return dispatch<any>(getVNFD(vnfPackageDTO.uuid, vnfTemplate.name, newVNFPackages, nodes, xOffset));
                }
                else {
                    return toast.error("Coult not add VNF Package.");
                }
            },
            error => {
                console.log(error);
                return toast.error("Coult not add VNF Package.");
            }
        )
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
        try {
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
        catch (e) {
            return toast.error("The VNF Descriptor seems to have a wrong format.");
        }
    }
}

export function updateEdges(edges: IEdge[]) {
    return {
        type: constants.SET_EDGES,
        edges: edges
    }
}

export function updateNodes(nodes: INode[]) {
    return {
        type: constants.SET_NODES,
        nodes: nodes
    }
}

export function updateGraph(edges: IEdge[], nodes: INode[]) {
    return {
        type: constants.SET_GRAPH,
        edges: edges,
        nodes: nodes
    }
}

export function updateVNFD(vnfdProperties: VNFDPropertiesState, vnfd: object) {
    return (dispatch: Dispatch) => {
        vnfd['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['num_cpus'] = vnfdProperties.numCPUs;
        vnfd['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['mem_size'] = vnfdProperties.memSize;
        vnfd['vnfd']['attributes']['vnfd']['topology_template']['node_templates']['VDU1']['capabilities']['nfv_compute']['properties']['disk_size'] = vnfdProperties.diskSize;

        fetch(GENEVIZ_FILE_API + "/vnfs/" + vnfdProperties.name + "/" + vnfdProperties.uuid, {
            method: "PUT",
            body: JSON.stringify(vnfd),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                if(data['success']) {
                    toast.success("Updated VNF Descriptor successfully.");
                    return dispatch(setVNFD(vnfdProperties.uuid, vnfd));
                }
                else {
                    return toast.error("Coult not update the VNF Descriptor.");
                }
            },
            error => {
                console.log(error);
                return toast.error("Coult not update the VNF Descriptor.");
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
        dispatch(selectNodeOrEdge({} as INode));

        return dispatch(setVNFPackages(vnfPackages.filter(vnfPackage => vnfPackage.uuid !== uuid)));
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

export function setNSDProperties(nsd: NSDPropertiesState) {
    return {
        type: constants.SET_NSD_PROPERTIES,
        nsd: nsd
    }
}

export function handleVNFList(showVNFList: boolean) {
    return {
        type: constants.HANDLE_VNF_LIST,
        showVNFList: showVNFList
    }
}

export function setBCProperties(bc: BCPropertiesState) {
    return {
        type: constants.SET_BC_PROPERTIES,
        bc: bc
    }
}

export function importSFC(template: SFCTemplate) {
    return (dispatch: Dispatch) => {
        fetch(GENEVIZ_FILE_API + "/sfcs", {
            method: "POST",
            body: JSON.stringify(template.fileBase64),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(
            data => {
                dispatch(selectNodeOrEdge({} as INode));
                dispatch(setVNFPackages(data['vnfs']));

                let xOffset = 500;
                const vnfs = data['vnfs'] as VNFPackage[];
                const nodes: INode[] = vnfs.map(vnf => {
                    xOffset += 400;
                    const node: INode = {
                        title: vnf.name,
                        id: vnf['uuid'],
                        x: xOffset,
                        y: 500,
                        type: 'vnfNode'
                    }
                    return node;
                });

                const order = data['order'] as string[];
                const uuids = order.map(vnfd => {
                    return (vnfd.split('/Descriptors/vnfd-')[1]).split('.')[0];
                });
                const edges: IEdge[] = [];
                for(var i=0; i<uuids.length-1; i++){
                    const edge: IEdge = {
                        source: uuids[i],
                        target: uuids[i+1],
                        type: getEdgeType(data['vnfs'] as VNFPackage[], uuids[i], uuids[i+1])
                    };
                    edges.push(edge);
                }

                dispatch(updateGraph(edges, nodes));
                toast.success("Imported SFC Package successfully.");
            },
            error => {
                console.log(error);
                toast.error("Coult not import the SFC Package.");
            }
        );
    }
}

export function setSFCValidationStatus(uuid: string, status: constants.SFCValidationStatus) {
    return {
        type: constants.SET_SFC_VALIDATION_STATUS,
        uuid: uuid,
        status: status
    }
}

export function validateSFC(template: SFCTemplate) {
    return (dispatch: Dispatch) => {
        dispatch(setSFCValidationStatus(template.uuid, constants.SFCValidationStatus.SFC_VALIDATION_PENDING));
        fetch(GENEVIZ_FILE_API + "/sfcs/validate", {
            method: "POST",
            body: JSON.stringify(template.fileBase64),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response;
        }).then(
            response => {
                if(response.status == 200) {
                    toast.success("The SFC Package is valid.");
                    return(dispatch(setSFCValidationStatus(template.uuid, constants.SFCValidationStatus.SFC_VALIDATION_VALID)));
                }
                else if(response.status == 404) {
                    toast.error("The SFC Package is not valid.");
                    return(dispatch(setSFCValidationStatus(template.uuid, constants.SFCValidationStatus.SFC_VALIDATION_INVALID)));
                }
                else if (response.status == 400) {
                    toast.error("The SFC Package is unknown.");
                    return(dispatch(setSFCValidationStatus(template.uuid, constants.SFCValidationStatus.SFC_VALIDATION_UNKNOWN)));
                }
                else {
                    toast.warn("The .zip files seems to have a wrong format.");
                    return(dispatch(setSFCValidationStatus(template.uuid, constants.SFCValidationStatus.SFC_VALIDATION_UNKNOWN)));
                }
            },
            error => {
                console.log(error);
                toast.error("Coult not validate the SFC Package.");
                dispatch(setSFCValidationStatus(template.uuid, constants.SFCValidationStatus.SFC_VALIDATION_INITIAL));
            }
        );
    }
}