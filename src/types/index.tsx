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

export interface StoreState {
    sfcPackage: SFCPackage;
    vnfTemplates: VNFTemplate[];
}