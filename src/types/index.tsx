export interface SFCP {
    vnffgd: object;
    nsd: object;
}

export interface VNFPackage {
    name: string;
    vnfd: object;
    fileBase64: string;
    uuid: string;
}

export interface StoreState {
    sfcp: SFCP;
    vnfs: VNFPackage[];
}