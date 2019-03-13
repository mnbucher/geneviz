import {GenevizAction, VNFTemplateAction, SFCAction, UserInterfaceAction} from '../actions';
import {
    SFCPackageState,
    StoreState,
    UserInterfaceState,
    VNFPackageState,
    VNFTemplateState
} from '../types/index';
import {
    UPLOAD_VNF_TEMPLATE,
    DELETE_VNF_TEMPLATE,
    ADD_VNF_TO_SFC,
    REMOVE_VNF_FROM_SFC,
    ADD_ERROR_FAILED_TO_CREATE_VNFP,
    EXTRACT_PROPERTIES_FROM_VNFD, ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD, UPDATE_EDGES, UPDATE_NODES
} from '../constants/index';

// Reducers. They should be pure functions with no side-effects.
// Updating the store is serious, complicated business. Don't contaminate it with other logic
// Hence, only take the data given in the action object and replace the old state by the new state. That's it.

export function vnfTemplates(state: VNFTemplateState[], action: VNFTemplateAction): VNFTemplateState[] {
    switch (action.type) {
        case UPLOAD_VNF_TEMPLATE: {
            let newState: VNFTemplateState[] = state.slice();
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
        case ADD_VNF_TO_SFC: {
            let newVNFPackages: VNFPackageState[] = state.vnfPackageState.slice();
            newVNFPackages.push(action.vnfPackage);
            return {...state, vnfPackageState: newVNFPackages};
        }
        case REMOVE_VNF_FROM_SFC: {
            return {...state, vnfPackageState: state.vnfPackageState.filter(vnf => vnf.uuid !== action.uuid)};
        }
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
        case EXTRACT_PROPERTIES_FROM_VNFD: {
            let newDrawingBoardState = {...state.drawingBoardState, vnfdProperties: action.vnfdProperties};
            return {...state, drawingBoardState: newDrawingBoardState};
        }
        case ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD: {
            const errorMessage = "Could not get VNF Descriptor of " + action.name;
            return {...state, errorState: errorMessage};
        }
        case UPDATE_EDGES: {
            const newGraph = {...state.drawingBoardState.graphViewState.graph, edges: action.edges};
            const newGraphViewState = {...state.drawingBoardState.graphViewState, graph: newGraph};
            const newDrawingBoardState = {...state.drawingBoardState, graphViewState: newGraphViewState};
            return {...state, drawingBoardState: newDrawingBoardState};
        }
        case UPDATE_NODES: {
            const newGraph = {...state.drawingBoardState.graphViewState.graph, nodes: action.nodes};
            const newGraphViewState = {...state.drawingBoardState.graphViewState, graph: newGraph};
            const newDrawingBoardState = {...state.drawingBoardState, graphViewState: newGraphViewState};
            return {...state, drawingBoardState: newDrawingBoardState};
        }
        default:
            return state;
    }
}

/* Root Reducer */

const initialState: StoreState = {
    sfcPackageState: {
        vnfPackageState: [],
        vnffgd: {},
        nsd: {},
    },
    vnfTemplateState: [],
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
            return {...state, vnfTemplateState: vnfTemplates(state.vnfTemplateState, action)};
        case ADD_VNF_TO_SFC:
        case REMOVE_VNF_FROM_SFC:
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