import { GenevizAction } from '../actions';
import { StoreState, VNFPackage } from '../types/index';
import { ADD_VNF, REMOVE_VNF } from '../constants/index';

export function vnfs(state: VNFPackage[], action: GenevizAction): VNFPackage[] {
    switch(action.type) {
        case ADD_VNF: {
            let newState: VNFPackage[] = state.slice();
            newState.push(action.vnfPackage as VNFPackage);
            return newState;
        }
        case REMOVE_VNF: {
            return state.filter(vnf => vnf.uuid !== action.uuid);
        }
        default:
            return state;
    }
}

/* Root Reducer */

export function geneviz(state: StoreState, action: GenevizAction): StoreState {
    switch(action.type) {
        case ADD_VNF:
            return {...state, vnfs: vnfs(state.vnfs, action)};
        case REMOVE_VNF:
            return {...state, vnfs: vnfs(state.vnfs, action)};
        default:
            return state;
    }
}