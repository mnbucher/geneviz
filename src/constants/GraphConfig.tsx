import * as React from 'react';

/*const EmptyNodeShape = (
    <symbol viewBox="0 0 100 100" width="154" height="154" id="emptyNode" key="0">
        <circle cx="77" cy="77" r="76"></circle>
    </symbol>
);*/

/*const CustomNodeShape = (
    <symbol viewBox="0 0 50 25" id="custom" key="0">
        <ellipse cx="50" cy="25" rx="50" ry="25"></ellipse>
    </symbol>
);*/

const EmptyNodeShape = (
    <symbol viewBox="0 0 100 100" id="emptyNode">
        <circle cx="50" cy="50" r="45"></circle>
    </symbol>
);

const CustomNodeShape = (
    <symbol viewBox="0 0 100 100" id="customNode">
        <circle cx="50" cy="50" r="45"></circle>
    </symbol>
);




/*const EmptyEdgeShape = (
    <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
        <circle cx="25" cy="25" r="8" fill="currentColor"> </circle>
    </symbol>
)*/

const EmptyEdgeShape = (
    <symbol viewBox="0 0 50 50" id="emptyEdge">
        <circle cx="25" cy="25" r="8" fill="currentColor"></circle>
    </symbol>
);

const CustomEdgeShape = (
    <symbol viewBox="0 0 50 50" id="customEdge">
        <rect transform="rotate(45)" x="27.5" y="-7.5" width="15" height="15" fill="currentColor" />
    </symbol>
);

export default {
    NodeTypes: {
        emptyNode: { // required to show empty nodes
            typeText: "Empty Node",
            shapeId: "#emptyNode", // relates to the type property of a node
            shape: EmptyNodeShape
        },
        customNode: { // required to show empty nodes
            typeText: "Custom Node",
            shapeId: "#customNode", // relates to the type property of a node
            shape: CustomNodeShape
        }
    },
    NodeSubtypes: {},
    EdgeTypes: {
        emptyEdge: {  // required to show empty edges
            shapeId: "#emptyEdge",
            shape: EmptyEdgeShape
        },
        customEdge: {
            shapeId: "#customEdge",
            shape: CustomEdgeShape
        }
    }
}