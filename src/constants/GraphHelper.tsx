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

const getVNFPackage = (vnfPackages: VNFPackage[], uuid: string) => {
    return vnfPackages.find(vnfPackage => {
        return vnfPackage.uuid == uuid;
    });
}

const isFoundInOtherList = (list1: string[], list2: string[]) => {
    let isRecommended: boolean = false;
    list1.forEach(element => {
        if (list2.includes(element)) {
            isRecommended = true;
        }
    });
    return isRecommended;
}

const getEdgeType = (vnfPackages: VNFPackage[], source: string, target: string) => {
    const sourceVNFPackage = getVNFPackage(vnfPackages, source);
    const targetVNFPackage = getVNFPackage(vnfPackages, target);
    if (typeof sourceVNFPackage !== 'undefined' && typeof targetVNFPackage !== 'undefined') {
        const sourceTargetRecommendation: string[] = sourceVNFPackage.vnfd['vnfd']['target_recommendation'];
        const sourceTargetCaution: string[] = sourceVNFPackage.vnfd['vnfd']['target_caution'];
        const targetServiceTypes: object[] = (targetVNFPackage.vnfd['vnfd']['service_types']);

        if (typeof sourceTargetRecommendation !== 'undefined' && typeof sourceTargetCaution !== 'undefined' && typeof targetServiceTypes !== 'undefined') {
            const targetServiceTypesAsList = targetServiceTypes.map(serviceType => {
                return serviceType['service_type'];
            });
            if (isFoundInOtherList(sourceTargetRecommendation, targetServiceTypesAsList)) {
                return 'recommendedEdge';
            }
            else if (isFoundInOtherList(sourceTargetCaution, targetServiceTypesAsList)) {
                return 'notRecommendedEdge';
            }
            else {
                return 'standardEdge';
            }
        }
        else {
            return 'standardEdge';
        }
    }
    else {
        return 'standardEdge';
    }
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

export { getSFCPath, getEdgeType };