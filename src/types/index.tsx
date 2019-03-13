import { IGraphInput } from "react-digraph";

export interface SFCPackageState {
    vnfPackageState: VNFPackageState[];
    vnffgd: object;
    nsd: object;
}

export interface VNFPackageState {
    name: string;
    uuid: string;
}

export interface VNFTemplateState {
    name: string;
    fileBase64: string;
    uuid: string;
}

export interface VNFDPropertiesState {
    numCPUs: string;
    memSize: string;
    diskSize: string;
}

export interface GraphViewState {
    graph: IGraphInput;
    nodeKey: string;
    selected: object;
}

export interface DrawingBoardState {
    vnfdPropertiesState: VNFDPropertiesState;
    graphViewState: GraphViewState;
}

export interface UserInterfaceState {
    errorState: string;
    drawingBoardState: DrawingBoardState;
}

export interface StoreState {
    sfcPackageState: SFCPackageState;
    vnfTemplateState: VNFTemplateState[];
    userInterfaceState: UserInterfaceState;
}

export interface VNFDTO {
    fileBase64: string;
    uuid: string;
}