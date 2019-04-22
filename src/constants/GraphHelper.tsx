import { IEdge } from 'react-digraph';
import { VNFPackage } from 'src/types';

const findFirstEdge = (edges: IEdge[]) => {
    return edges.find(edge1 => {
        if (typeof edges.find(edge2 => {
            if(edge1.source == edge2.target){
                return true;
            }
            else {
                return false;
            }
        }) == 'undefined') {
            return true;
        }
        else {
            return false;
        }
    });
}

const getVNFName = (vnfPackages: VNFPackage[], uuid: string) => {
    return vnfPackages.find(vnfPackage => {
        if(vnfPackage.uuid == uuid){
            return true;
        }
        else {
            return false;
        }
    });
}

const getSFCPath = (vnfPackages: VNFPackage[], edges: IEdge[]) => {
    const totalLength = edges.length;
    let path: object[] = [];

    for(var i=0; i < totalLength; i++){
        const firstEdge = findFirstEdge(edges);
        if (typeof firstEdge != 'undefined') {
            if(i == totalLength - 1){
                // Last edge, so add both source and target
                path.push({ name: (getVNFName(vnfPackages, firstEdge.source) as VNFPackage).name, uuid: firstEdge.source});
                path.push({ name: (getVNFName(vnfPackages, firstEdge.target) as VNFPackage).name, uuid: firstEdge.target});
            }
            else {
                path.push({ name: (getVNFName(vnfPackages, firstEdge.source) as VNFPackage).name, uuid: firstEdge.source });
            }
            
            edges = edges.filter(edge => {
                if(edge.source == firstEdge.source && edge.target == firstEdge.target){
                    return false;
                }
                else {
                    return true;
                }
            });
        }
    }
    return path;
}

export { getSFCPath };