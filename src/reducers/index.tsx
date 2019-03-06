import { GenevizAction, VNFTemplateAction, SFCAction } from '../actions';
import {SFCPackage, StoreState, VNFPackage, VNFTemplate} from '../types/index';
import {UPLOAD_VNF_TEMPLATE, DELETE_VNF_TEMPLATE, ADD_VNF_TO_SFC, REMOVE_VNF_FROM_SFC} from '../constants/index';

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

        }
        default:
            return state;
    }
}

/* Root Reducer */

export function geneviz(state: StoreState, action: GenevizAction): StoreState {
    switch(action.type) {
        case UPLOAD_VNF_TEMPLATE:
        case DELETE_VNF_TEMPLATE:
            return {...state, vnfTemplates: vnfTemplates(state.vnfTemplates, action)};
        case ADD_VNF_TO_SFC:
        case REMOVE_VNF_FROM_SFC:
            return {...state, sfcPackage: sfcPackage(state.sfcPackage, action)};
        default:
            return state;
    }
}