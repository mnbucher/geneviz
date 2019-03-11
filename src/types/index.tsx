export interface SFCPackage {
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

export interface VNFDTO {
    fileBase64: string;
    uuid: string;
}

export interface VNFDProperties {
    numCPUs: string;
    memSize: string;
    diskSize: string;
}

export interface DrawingBoardState {
    vnfdProperties: VNFDProperties;
}

export interface UserInterface {
    error: string;
    drawingBoardState: DrawingBoardState;
}

export interface StoreState {
    sfcPackage: SFCPackage;
    vnfTemplates: VNFTemplate[];
    userInterface: UserInterface;
}