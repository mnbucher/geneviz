import {GenevizAction, VNFTemplateAction, SFCAction, UserInterfaceAction} from '../actions';
import {SFCPackage, StoreState, UserInterface, VNFDProperties, VNFPackage, VNFTemplate} from '../types/index';
import {
    UPLOAD_VNF_TEMPLATE,
    DELETE_VNF_TEMPLATE,
    ADD_VNF_TO_SFC,
    REMOVE_VNF_FROM_SFC,
    ADD_ERROR_FAILED_TO_CREATE_VNFP,
    EXTRACT_PROPERTIES_FROM_VNFD, ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD
} from '../constants/index';

// Reducers. They should be pure functions with no side-effects.
// Updating the store is serious, complicated business. Don't contaminate it with other logic
// Hence, only take the data given in the action object and replace the old state by the new state. That's it.

export function vnfTemplates(state: VNFTemplate[], action: VNFTemplateAction): VNFTemplate[] {
    switch(action.type) {
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

export function sfcPackage(state: SFCPackage, action: SFCAction): SFCPackage {
    switch(action.type) {
        case ADD_VNF_TO_SFC: {
            let newVNFPackages: VNFPackage[] = state.vnfPackages.slice();
            newVNFPackages.push(action.vnfPackage);
            return {...state, vnfPackages: newVNFPackages};
        }
        case REMOVE_VNF_FROM_SFC: {
            return {...state, vnfPackages: state.vnfPackages.filter(vnf => vnf.uuid !== action.uuid)};
        }
        default:
            return state;
    }
}

export function userInterface(state: UserInterface, action: UserInterfaceAction): UserInterface {
    switch(action.type) {
        case ADD_ERROR_FAILED_TO_CREATE_VNFP: {
            const errorMessage = "Failed to add the VNF Package " + action.vnfTemplate.name;
            return {...state, error: errorMessage};
        }
        case EXTRACT_PROPERTIES_FROM_VNFD: {
            let newDrawingBoardState = {... state.drawingBoardState, vnfdProperties: action.vnfdProperties};
            return {...state, drawingBoardState: newDrawingBoardState};
        }
        case ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD: {
            const errorMessage = "Could not get VNF Descriptor of " + action.name;
            return {...state, error: errorMessage};
        }
    }
}

/* Root Reducer */

const initialState: StoreState = {
    sfcPackage: {
        vnfPackages: [],
        vnffgd: {},
        nsd: {},
    },
    vnfTemplates: [],
    userInterface: {
        error: "",
        drawingBoardState: {
            vnfdProperties: {
                numCPUs: "",
                memSize: "",
                diskSize: ""
            }
        }
    }
}

export function geneviz(state: StoreState = initialState, action: GenevizAction): StoreState {
    switch(action.type) {
        case UPLOAD_VNF_TEMPLATE:
        case DELETE_VNF_TEMPLATE:
            return {...state, vnfTemplates: vnfTemplates(state.vnfTemplates, action)};
        case ADD_VNF_TO_SFC:
        case REMOVE_VNF_FROM_SFC:
            return {...state, sfcPackage: sfcPackage(state.sfcPackage, action)};
        case ADD_ERROR_FAILED_TO_CREATE_VNFP:
        case EXTRACT_PROPERTIES_FROM_VNFD:
        case ADD_ERROR_FAILED_TO_EXTRACT_PROPERTIES_FROM_VNFD:
            return {...state, userInterface: userInterface(state.userInterface, action)};
        default:
            return state;
    }
}