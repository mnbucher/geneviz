import {
    GenevizAction,
    SFCAction,
    UserInterfaceAction,
    GraphAction,
    DrawingBoardAction,
    TemplateAction,
} from '../actions';
import {
    DrawingBoardState,
    GraphViewState,
    SFCPackageState,
    StoreState,
    UserInterfaceState, VNFDPropertiesState
} from '../types/index';
import {
    DELETE_VNF_TEMPLATE,
    SET_VNFD_PROPERTIES,
    SET_EDGES,
    SET_NODES,
    SELECT_NODE_OR_EDGE,
    SET_VNF_PACKAGES,
    SET_X_OFFSET,
    RESET_VNFD_PROPERTIES,
    SET_VNFD,
    HANDLE_SFC_POPUP,
    HANDLE_VNFD_POPUP,
    SET_NSD_PROPERTIES,
    SET_GRAPH,
    HANDLE_VNF_LIST,
    ADD_VNF_TEMPLATE,
    ADD_SFC_TEMPLATE,
    DELETE_SFC_TEMPLATE,
    SET_BC_PROPERTIES,
    SET_SFC_VALIDATION_STATUS
} from '../constants/index';
import {INode} from "react-digraph";

export function templates(state: StoreState, action: TemplateAction): StoreState {
    switch (action.type) {
        case ADD_VNF_TEMPLATE: {
            let newVNFTemplates = state.vnfTemplates.slice();
            newVNFTemplates.push(action.vnfTemplate);
            return {...state, vnfTemplates: newVNFTemplates};
        }
        case DELETE_VNF_TEMPLATE: {
            return {...state, vnfTemplates: state.vnfTemplates.filter(template => template.uuid !== action.uuid)};
        }
        case ADD_SFC_TEMPLATE: {
            let newSFCTemplates = state.sfcTemplates.slice();
            newSFCTemplates.push(action.sfcTemplate);
            return {...state, sfcTemplates: newSFCTemplates};
        }
        case DELETE_SFC_TEMPLATE : {
            return {...state, sfcTemplates: state.sfcTemplates.filter(template => template.uuid !== action.uuid)};
        }
        case SET_SFC_VALIDATION_STATUS: {
            return {...state, sfcTemplates: state.sfcTemplates.map(template => { 
                if (template.uuid == action.uuid) {
                    template.validationStatus = action.status
                    return template;
                }
                else {
                    return template;
                }
             })};
        }
        default:
            return state;
    }
}

export function sfcPackage(state: SFCPackageState, action: SFCAction): SFCPackageState {
    switch (action.type) {
        case SET_VNF_PACKAGES: {
            return {...state, vnfPackages: action.vnfPackages};
        }
        case SET_NSD_PROPERTIES: {
            return {...state, nsd: action.nsd};
        }
        case SET_VNFD: {
            console.log(action);
            const newVNFPackages = state.vnfPackages.map(vnfPackage => {
                if(vnfPackage.uuid == action.uuid){
                    vnfPackage.vnfd = action.vnfd;
                    return vnfPackage;
                }
                return vnfPackage;
            });
            return {...state, vnfPackages: newVNFPackages};
        }
        case SET_BC_PROPERTIES: {
            return {...state, bc: action.bc};
        }
        default:
            return state;
    }
}

export function graphView(state: GraphViewState, action: GraphAction): GraphViewState {
    switch (action.type) {
        case SET_EDGES: {
            const newGraph = {... state.graph, edges: action.edges};
            return {...state, graph: newGraph};
        }
        case SET_NODES: {
            const newGraph = {... state.graph, nodes: action.nodes};
            return {...state, graph: newGraph};
        }
        case SET_GRAPH: {
            console.log(state.graph);
            const newGraph = {... state.graph, edges: action.edges, nodes: action.nodes, selected: {} as INode};
            console.log(newGraph);
            return {...state, graph: newGraph};
        }
        case SELECT_NODE_OR_EDGE: {
            return {... state, selected: action.selected};
        }
        case SET_X_OFFSET: {
            return {... state, xOffset: action.xOffset};
        }
        default:
            return state;
    }
}

export function drawingBoard(state: DrawingBoardState, action: DrawingBoardAction): DrawingBoardState {
    switch (action.type){
        case SET_VNFD_PROPERTIES: {
            return {...state, vnfdPropertiesState: action.vnfdProperties};
        }
        case RESET_VNFD_PROPERTIES: {
            const resettedProperties: VNFDPropertiesState = {
                numCPUs: "",
                memSize: "",
                diskSize: "",
                uuid: "",
                name: ""
            }
            return {...state, vnfdPropertiesState: resettedProperties};
        }
        case SET_EDGES:
        case SET_NODES:
        case SET_GRAPH: 
        case SELECT_NODE_OR_EDGE:
        case SET_X_OFFSET:
            return {...state, graphViewState: graphView(state.graphViewState, action)};
        default:
            return state;
    }
}

export function userInterface(state: UserInterfaceState, action: UserInterfaceAction): UserInterfaceState {
    switch (action.type) {
        case HANDLE_SFC_POPUP:
            return {...state, showSFCPopup: action.showSFCPopup}
        case HANDLE_VNFD_POPUP:
            return {...state, showVNFDPopup: action.showVNFDPopup}
        case HANDLE_VNF_LIST:
            return {...state, showVNFList: action.showVNFList}
        case SET_VNFD_PROPERTIES:
        case RESET_VNFD_PROPERTIES:
        case SET_EDGES:
        case SET_NODES:
        case SET_GRAPH:
        case SELECT_NODE_OR_EDGE:
        case SET_X_OFFSET:
            return {...state, drawingBoardState: drawingBoard(state.drawingBoardState, action)};
        default:
            return state;
    }
}

const initialState: StoreState = {
    sfcPackageState: {
        vnfPackages: [],
        nsd: {
            name: "",
            vendor: "",
            version: "1.0"
        },
        bc: {
            storeOnBC: false,
            address: "",
            privateKey: ""
        }
    },
    vnfTemplates: [],
    sfcTemplates: [],
    userInterfaceState: {
        drawingBoardState: {
            vnfdPropertiesState: {
                numCPUs: "",
                memSize: "",
                diskSize: "",
                uuid: "",
                name: ""
            },
            graphViewState: {
                graph: {
                    nodes: [],
                    edges: []
                },
                nodeKey: 'id',
                selected: {} as INode,
                xOffset: 500
            },
        },
        showSFCPopup: false,
        showVNFDPopup: false,
        showVNFList: true
    }
}

export function geneviz(state: StoreState = initialState, action: GenevizAction): StoreState {
    switch (action.type) {
        case ADD_VNF_TEMPLATE:
        case DELETE_VNF_TEMPLATE:
        case ADD_SFC_TEMPLATE:
        case DELETE_SFC_TEMPLATE:
        case SET_SFC_VALIDATION_STATUS:
            return templates(state, action);
        case SET_VNF_PACKAGES:
        case SET_NSD_PROPERTIES:
        case SET_VNFD:
        case SET_BC_PROPERTIES:
            return {...state, sfcPackageState: sfcPackage(state.sfcPackageState, action)};
        case SET_VNFD_PROPERTIES:
        case RESET_VNFD_PROPERTIES:
        case SET_EDGES:
        case SET_NODES:
        case SET_GRAPH:
        case SELECT_NODE_OR_EDGE:
        case SET_X_OFFSET:
        case HANDLE_SFC_POPUP:
        case HANDLE_VNFD_POPUP:
        case HANDLE_VNF_LIST:
            return {...state, userInterfaceState: userInterface(state.userInterfaceState, action)};
        default:
            return state;
    }
}