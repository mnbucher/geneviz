import {
    GenevizAction,
    VNFTemplateAction,
    SFCAction,
    UserInterfaceAction,
    GraphAction,
    DrawingBoardAction,
} from '../actions';
import {
    DrawingBoardState,
    GraphViewState,
    SFCPackageState,
    StoreState,
    UserInterfaceState, VNFDPropertiesState,
    VNFTemplate
} from '../types/index';
import {
    UPLOAD_VNF_TEMPLATE,
    DELETE_VNF_TEMPLATE,
    FAILED_TO_CREATE_VNFP,
    SET_VNFD_PROPERTIES,
    FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD,
    UPDATE_EDGES,
    UPDATE_NODES,
    SELECT_NODE_OR_EDGE,
    UPDATE_VNF_PACKAGES,
    INCREASE_X_OFFSET,
    RESET_VNFD_PROPERTIES,
    SET_VNFD,
    UPDATED_VNFD_IN_VNF_PACKAGE,
    FAILED_TO_UPDATE_VNFD_IN_VNF_PACKAGE,
    HANDLE_SFC_POPUP,
    HANDLE_VNFD_POPUP,
    SET_NSD_NAME,
    UPDATE_GRAPH
} from '../constants/index';
import {INode} from "react-digraph";

// Reducers. They should be pure functions with no side-effects.
// Updating the store is serious, complicated business. Don't contaminate it with other logic
// Hence, only take the data given in the action object and replace the old state by the new state. That's it.

export function vnfTemplates(state: VNFTemplate[], action: VNFTemplateAction): VNFTemplate[] {
    switch (action.type) {
        case UPLOAD_VNF_TEMPLATE: {
            let newState: VNFTemplate[] = state.slice();
            newState.push(action.vnfTemplate);
            return newState;
        }
        case DELETE_VNF_TEMPLATE: {
            return state.filter(vnf => vnf.uuid !== action.uuid);
        }
        default:
            return state;
    }
}

export function sfcPackage(state: SFCPackageState, action: SFCAction): SFCPackageState {
    switch (action.type) {
        case UPDATE_VNF_PACKAGES: {
            return {...state, vnfPackages: action.vnfPackages};
        }
        case SET_NSD_NAME: {
            return {...state, nsdName: action.nsdName};
        }
        default:
            return state;
    }
}

export function graphView(state: GraphViewState, action: GraphAction): GraphViewState {
    switch (action.type) {
        case UPDATE_EDGES: {
            const newGraph = {... state.graph, edges: action.edges};
            return {...state, graph: newGraph};
        }
        case UPDATE_NODES: {
            const newGraph = {... state.graph, nodes: action.nodes};
            return {...state, graph: newGraph};
        }
        case UPDATE_GRAPH: {
            const newGraph = {... state.graph, edges: action.edges, nodes: action.nodes, selected: {} as INode};
            return {...state, graph: newGraph};
        }
        case SELECT_NODE_OR_EDGE: {
            return {... state, selected: action.selected};
        }
        case INCREASE_X_OFFSET: {
            return {... state, xOffset: action.xOffset};
        }
        default:
            return state;
    }
}

export function drawingBoard(state: DrawingBoardState, action: DrawingBoardAction): DrawingBoardState {
    switch (action.type){
        case SET_VNFD_PROPERTIES: {
            return {...state, vnfdPropertiesState: action.vnfdProperties};
        }
        case RESET_VNFD_PROPERTIES: {
            const resettedProperties: VNFDPropertiesState = {
                numCPUs: "",
                memSize: "",
                diskSize: "",
                uuid: "",
                name: ""
            }
            return {...state, vnfdPropertiesState: resettedProperties};
        }
        case SET_VNFD: {
            return {...state, vnfd: action.vnfd};
        }
        case UPDATE_EDGES:
        case UPDATE_NODES:
        case UPDATE_GRAPH:
        case SELECT_NODE_OR_EDGE:
        case INCREASE_X_OFFSET:
            return {...state, graphViewState: graphView(state.graphViewState, action)};
        default:
            return state;
    }
}

export function userInterface(state: UserInterfaceState, action: UserInterfaceAction): UserInterfaceState {
    switch (action.type) {
        case FAILED_TO_CREATE_VNFP: {
            const message = "Failed to add the VNF Package " + action.vnfTemplate.name;
            console.log(message);
            return {...state, notification: message};
        }
        case FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD: {
            const message = "Could not get VNF Descriptor of " + action.name;
            console.log(message);
            return {...state, notification: message};
        }
        case UPDATED_VNFD_IN_VNF_PACKAGE: {
            const message = "Updated successfully VNF Descriptor of " + action.name;
            console.log(message);
            return {...state, notification: message};
        }
        case FAILED_TO_UPDATE_VNFD_IN_VNF_PACKAGE: {
            const message = "Could not update VNF Descriptor of " + action.name;
            console.log(message);
            return {...state, notification: message};
        }
        case HANDLE_SFC_POPUP:
            return {...state, showSFCPopup: action.showSFCPopup}
        case HANDLE_VNFD_POPUP:
            return {...state, showVNFDPopup: action.showVNFDPopup}
        case SET_VNFD_PROPERTIES:
        case RESET_VNFD_PROPERTIES:
        case SET_VNFD:
        case UPDATE_EDGES:
        case UPDATE_NODES:
        case UPDATE_GRAPH:
        case SELECT_NODE_OR_EDGE:
        case INCREASE_X_OFFSET:
            return {...state, drawingBoardState: drawingBoard(state.drawingBoardState, action)};
        default:
            return state;
    }
}

/* Root Reducer */

const initialState: StoreState = {
    sfcPackageState: {
        vnfPackages: [],
        vnffgd: {},
        nsdName: "",
    },
    vnfTemplates: [],
    userInterfaceState: {
        notification: "",
        drawingBoardState: {
            vnfd: {},
            vnfdPropertiesState: {
                numCPUs: "",
                memSize: "",
                diskSize: "",
                uuid: "",
                name: ""
            },
            graphViewState: {
                graph: {
                    nodes: [],
                    edges: []
                },
                nodeKey: 'id',
                selected: {} as INode,
                xOffset: 500
            },
        },
        showSFCPopup: false,
        showVNFDPopup: false
    }
}

export function geneviz(state: StoreState = initialState, action: GenevizAction): StoreState {
    switch (action.type) {
        case UPLOAD_VNF_TEMPLATE:
        case DELETE_VNF_TEMPLATE:
            return {...state, vnfTemplates: vnfTemplates(state.vnfTemplates, action)};
        case UPDATE_VNF_PACKAGES:
        case SET_NSD_NAME:
            return {...state, sfcPackageState: sfcPackage(state.sfcPackageState, action)};
        case FAILED_TO_CREATE_VNFP:
        case SET_VNFD_PROPERTIES:
        case RESET_VNFD_PROPERTIES:
        case SET_VNFD:
        case FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD:
        case UPDATED_VNFD_IN_VNF_PACKAGE:
        case FAILED_TO_UPDATE_VNFD_IN_VNF_PACKAGE:
        case UPDATE_EDGES:
        case UPDATE_NODES:
        case UPDATE_GRAPH:
        case SELECT_NODE_OR_EDGE:
        case INCREASE_X_OFFSET:
        case HANDLE_SFC_POPUP:
        case HANDLE_VNFD_POPUP:
            return {...state, userInterfaceState: userInterface(state.userInterfaceState, action)};
        default:
            return state;
    }
}