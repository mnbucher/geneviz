import * as React from 'react';

export const VNF_NODE = 'vnfNode'; // Empty node type
export const CONNECTION_NODE = 'connectionNode';
export const STANDARD_EDGE = 'standardEdge';
export const EMPTY_EDGE = 'emptyEdge';

// Shapes

const VNFNodeShape = (
    <symbol viewBox="0 0 154 154" width="154" height="154" id="vnfNode">
        <circle cx="77" cy="77" r="76" />
        <circle cx="10" cy="10" r="10" id="vnfNodeVNFDButton"/>
    </symbol>
);

const StandardEdgeShape = (
    <symbol viewBox="0 0 50 50" id="standardEdge">
        <circle cx="25" cy="25" r="8" fill="currentColor" />
    </symbol>
);

const RecommendedEdgeShape = (
    <symbol viewBox="0 0 50 50" id="recommendedEdge">
        <circle cx="25" cy="25" r="8" fill="#00ff00" />
    </symbol>
);

const NotRecommendedEdgeShape = (
    <symbol viewBox="0 0 50 50" id="notRecommendedEdge">
        <circle cx="25" cy="25" r="8" fill="#ff0000" />
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