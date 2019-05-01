import {IEdge, IGraphInput, INode} from "react-digraph";
import { SFCValidationStatus } from 'src/constants';

export interface SFCPackageState {
    vnfPackages: VNFPackage[];
    nsd: NSDPropertiesState;
    bc: BCPropertiesState;
}

export interface VNFPackage {
    name: string;
    uuid: string;
    vnfd: object;
}

export interface NSDPropertiesState {
    name: string;
    vendor: string;
    version: string;
}

export interface BCPropertiesState {
    storeOnBC: boolean;
    address: string;
    privateKey: string;
}

export interface VNFTemplate {
    name: string;
    fileBase64: string;
    uuid: string;
}

export interface SFCTemplate {
    name: string;
    fileBase64: string;
    uuid: string;
    validationStatus: SFCValidationStatus
}

export interface VNFDPropertiesState {
    numCPUs: string;
    memSize: string;
    diskSize: string;
    uuid: string;
    name: string;
}

export interface GraphViewState {
    graph: IGraphInput;
    nodeKey: string;
    selected: INode | IEdge;
    xOffset: number;
}

export interface DrawingBoardState {
    vnfdPropertiesState: VNFDPropertiesState;
    graphViewState: GraphViewState;
}

export interface UserInterfaceState {
    notification: string;
    drawingBoardState: DrawingBoardState;
    showSFCPopup: boolean;
    showVNFDPopup: boolean;
    showVNFList: boolean;
}

export interface StoreState {
    sfcPackageState: SFCPackageState;
    vnfTemplates: VNFTemplate[];
    sfcTemplates: SFCTemplate[];
    userInterfaceState: UserInterfaceState;
}

export interface VNFPackageDTO {
    fileBase64: string;
    uuid: string;
    vnfName: string;
}

export interface SFCPackageDTO {
    vnfPackages: object;
    path: object[];
    nsd: NSDPropertiesState;
    bc: BCPropertiesState;
}