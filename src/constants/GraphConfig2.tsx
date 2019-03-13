// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*
  Example config for GraphView component
*/
import * as React from 'react';

export const NODE_KEY = 'id'; // Key used to identify nodes

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
export const VNF_NODE = 'vnfNode'; // Empty node type
export const CONNECTION_NODE = 'connectionNode';
export const STANDARD_EDGE = 'standardEdge';
export const EMPTY_EDGE = 'emptyEdge';

export const nodeTypes = [VNF_NODE, CONNECTION_NODE];
export const edgeTypes = [STANDARD_EDGE, EMPTY_EDGE];


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
            typeText: 'None'
        },
        connectionNode: {
            shape: ConnectionNodeShape,
            shapeId: '#connectionNode',
            typeText: 'None'
        }
    }
};