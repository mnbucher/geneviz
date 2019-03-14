import {
    GenevizAction,
    VNFTemplateAction,
    SFCAction,
    UserInterfaceAction,
    GraphAction,
    DrawingBoardAction
} from '../actions';
import {
    DrawingBoardState,
    GraphViewState,
    SFCPackageState,
    StoreState,
    UserInterfaceState,
    VNFTemplate
} from '../types/index';
import {
    UPLOAD_VNF_TEMPLATE,
    DELETE_VNF_TEMPLATE,
    ADD_ERROR_FAILED_TO_CREATE_VNFP,
    EXTRACT_PROPERTIES_FROM_VNFD,
    ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD,
    UPDATE_EDGES,
    UPDATE_NODES,
    SELECT_NODE, UPDATE_VNFS_IN_SFC
} from '../constants/index';

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
        case UPDATE_VNFS_IN_SFC: {
            return {...state, vnfPackages: action.vnfPackages};
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
        case SELECT_NODE: {
            return {... state, selected: action.selectedNode};
        }
        default:
            return state;
    }
}

export function drawingBoard(state: DrawingBoardState, action: DrawingBoardAction): DrawingBoardState {
    switch (action.type){
        case EXTRACT_PROPERTIES_FROM_VNFD: {
            return {...state, vnfdPropertiesState: action.vnfdProperties};
        }
        case UPDATE_EDGES:
        case UPDATE_NODES:
        case SELECT_NODE:
            return {...state, graphViewState: graphView(state.graphViewState, action)};
        default:
            return state;
    }
}

export function userInterface(state: UserInterfaceState, action: UserInterfaceAction): UserInterfaceState {
    switch (action.type) {
        case ADD_ERROR_FAILED_TO_CREATE_VNFP: {
            const errorMessage = "Failed to add the VNF Package " + action.vnfTemplate.name;
            return {...state, errorState: errorMessage};
        }
        case ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD: {
            const errorMessage = "Could not get VNF Descriptor of " + action.name;
            return {...state, errorState: errorMessage};
        }
        case EXTRACT_PROPERTIES_FROM_VNFD:
        case UPDATE_EDGES:
        case UPDATE_NODES:
        case SELECT_NODE:
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
        nsd: {},
    },
    vnfTemplates: [],
    userInterfaceState: {
        errorState: "",
        drawingBoardState: {
            vnfdPropertiesState: {
                numCPUs: "",
                memSize: "",
                diskSize: ""
            },
            graphViewState: {
                graph: {
                    nodes: [],
                    edges: []
                },
                nodeKey: 'id',
                selected: {}
            },
        }
    }
}

export function geneviz(state: StoreState = initialState, action: GenevizAction): StoreState {
    switch (action.type) {
        case UPLOAD_VNF_TEMPLATE:
        case DELETE_VNF_TEMPLATE:
            return {...state, vnfTemplates: vnfTemplates(state.vnfTemplates, action)};
        case UPDATE_VNFS_IN_SFC:
            return {...state, sfcPackageState: sfcPackage(state.sfcPackageState, action)};
        case ADD_ERROR_FAILED_TO_CREATE_VNFP:
        case EXTRACT_PROPERTIES_FROM_VNFD:
        case ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD:
        case UPDATE_EDGES:
        case UPDATE_NODES:
            return {...state, userInterfaceState: userInterface(state.userInterfaceState, action)};
        default:
            return state;
    }
}