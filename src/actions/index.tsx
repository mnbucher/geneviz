import * as constants from '../constants';
import { VNFPackage } from "../types";

// Actions only describe what happened, but don't describe how the application's state changes.

// Action Types

export interface AddVNF {
    type: constants.ADD_VNF;
}

export interface RemoveVNF {
    type: constants.REMOVE_VNF;
}

export type GenevizAction = AddVNF | RemoveVNF;

// Action Creators

export function addVNF(node: VNFPackage) {
    return {
        type: constants.ADD_VNF,
        node
    }
}

export function removeVNF(node: VNFPackage) {
    return {
        type: constants.ADD_VNF,
        node
    }
}