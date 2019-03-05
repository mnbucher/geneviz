import * as constants from '../constants';
import { VNFPackage } from "../types";

// Actions only describe what happened, but don't describe how the application's state changes.

// Action Types

export interface AddVNF {
    type: constants.ADD_VNF;
    vnfPackage: VNFPackage;
}

export interface RemoveVNF {
    type: constants.REMOVE_VNF;
    uuid: string;
}

type VNFAction = AddVNF | RemoveVNF;

export type GenevizAction = VNFAction;

// Action Creators

export function addVNF(vnfPackage: VNFPackage) {
    return {
        type: constants.ADD_VNF,
        vnfPackage: vnfPackage
    }
}

export function removeVNF(uuid: string) {
    return {
        type: constants.REMOVE_VNF,
        uuid: uuid
    }
}