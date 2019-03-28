import {IEdge, IGraphInput, INode} from "react-digraph";

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
    vnfd: object;
    vnfdPropertiesState: VNFDPropertiesState;
    graphViewState: GraphViewState;
}

export interface UserInterfaceState {
    notification: string;
    drawingBoardState: DrawingBoardState;
}

export interface StoreState {
    sfcPackageState: SFCPackageState;
    vnfTemplates: VNFTemplate[];
    userInterfaceState: UserInterfaceState;
}

export interface VNFDTO {
    file_base_64: string;
    uuid: string;
    vnf_name: string;
}

export interface SFCPackageDTO {
    vnf_packages: object;
    vnffgd: object;
    nsd_name: string;
}