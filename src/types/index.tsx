export interface SFCP {
    vnffgd: object;
    nsd: object;
}

export interface StoreState {
    sfcp: SFCP;
    vnfs: VNFPackage[];
}

export interface VNFPackage {
    name: string;
}