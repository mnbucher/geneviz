import * as React from 'react';

const VNFNodeShape = (
    <symbol viewBox="0 0 200 200" width="200" height="200" id="vnfNode">
        <rect x="2" y="2" width="196" height="196" rx="30"  ry="30"/>
    </symbol>
);

const StandardEdgeShape = (
    <symbol viewBox="0 0 50 50" id="standardEdge">
        <circle cx="25" cy="25" r="8" fill="currentColor" />
    </symbol>
);

const RecommendedEdgeShape = (
    <symbol viewBox="0 0 50 50" id="recommendedEdge">
        <circle cx="25" cy="25" r="10" fill="#1ba576" />
    </symbol>
);

const NotRecommendedEdgeShape = (
    <symbol viewBox="0 0 50 50" id="notRecommendedEdge">
        <circle cx="25" cy="25" r="10" fill="#d2625e" />
    </symbol>
);

export default {
    EdgeTypes: {
        standardEdge: {
            shape: StandardEdgeShape,
            shapeId: '#standardEdge',
        },
        recommendedEdge: {
            shape: RecommendedEdgeShape,
            shapeId: '#recommendedEdge',
        },
        notRecommendedEdge: {
            shape: NotRecommendedEdgeShape,
            shapeId: '#notRecommendedEdge'
        }
    },
    NodeSubtypes: {},
    NodeTypes: {
        vnfNode: {
            shape: VNFNodeShape,
            shapeId: '#vnfNode',
            typeText: 'VNF'
        }
    }
};