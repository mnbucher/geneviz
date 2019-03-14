import * as React from 'react';

export const VNF_NODE = 'vnfNode'; // Empty node type
export const CONNECTION_NODE = 'connectionNode';
export const STANDARD_EDGE = 'standardEdge';
export const EMPTY_EDGE = 'emptyEdge';

// Shapes

const VNFNodeShape = (
    <symbol viewBox="0 0 154 154" width="154" height="154" id="vnfNode">
        <circle cx="77" cy="77" r="76" />
    </symbol>
);

const ConnectionNodeShape = (
    <symbol viewBox="0 0 100 100" id="connectionNode">
        <circle cx="50" cy="50" r="45" />
    </symbol>
);

const EmptyEdgeShape = (
    <symbol viewBox="0 0 50 50" id="emptyEdge">
        <circle cx="25" cy="25" r="8" fill="currentColor" />
    </symbol>
);

const StandardEdgeShape = (
    <symbol viewBox="0 0 50 50" id="standardEdge">
        <rect transform="rotate(45)" x="27.5" y="-7.5" width="15" height="15" fill="currentColor" />
    </symbol>
);

export default {
    EdgeTypes: {
        standardEdge: {
            shape: StandardEdgeShape,
            shapeId: '#standardEdge',
        },
        emptyEdge: {
            shape: EmptyEdgeShape,
            shapeId: '#emptyEdge',
        }
    },
    NodeSubtypes: {},
    NodeTypes: {
        vnfNode: {
            shape: VNFNodeShape,
            shapeId: '#vnfNode',
            typeText: 'VNF'
        },
        connectionNode: {
            shape: ConnectionNodeShape,
            shapeId: '#connectionNode',
            typeText: 'Connection Point'
        }
    }
};