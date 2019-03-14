import { IGraphInput } from "react-digraph";

export interface SFCPackageState {
    vnfPackages: VNFPackage[];
    vnffgd: object;
    nsd: object;
}

export interface VNFPackage {
    name: string;
    uuid: string;
}

export interface VNFTemplate {
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
    vnfTemplates: VNFTemplate[];
    userInterfaceState: UserInterfaceState;
}

export interface VNFDTO {
    fileBase64: string;
    uuid: string;
}