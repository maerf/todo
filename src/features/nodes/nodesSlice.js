/** @format */

import { unstable_useEnhancedEffect } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import ItemEditMode from "../../components/ItemEditMode";
import * as helpers from "../../helpers";

const todoRootId = "todoRoot";
const specialNodes = helpers.generateSpecialNodes(todoRootId);
const forSomeday = ["promotion", "this", "that"].map(text => helpers.createTodoNode(specialNodes[3].id, text));
const forNext = ["try deeply nested entries in notes "].map(text => helpers.createTodoNode(specialNodes[2].id, text));

//data structure is temporary as I'm looking into cloud sync via firebase or aws and as I'm adding new feature like drag and drop combine
//the structure is prepared for other fetures like a different handling "today"
const initialState = {
    0: { id: "0", parentId: "root", isRoot: true, text: "I'm the root, parent of 1", childIds: [todoRootId, "1"], tasksIds: [] },
    [todoRootId]: { id: todoRootId, parentId: "0", isRoot: false, text: "Todo-Folders", childIds: specialNodes.map(node => node.id) },
    1: { id: "1", parentId: "0", isRoot: false, text: "Parent of 2, Child of 0", childIds: ["2"], tasksIds: [] },
    2: { id: "2", parentId: "1", isRoot: false, text: "I'm a child of 1, Parent of 3", childIds: [3], tasksIds: [] },
    3: { id: "3", parentId: "2", isRoot: false, isTodo: true, text: "I'm child of 2 and a Todo", childIds: [], tasksIds: [] },
    [specialNodes[0].id]: { ...specialNodes[0], childIds: [6] },
    [specialNodes[1].id]: { ...specialNodes[1], childIds: [4, 8, 9, 10] },
    [specialNodes[2].id]: { ...specialNodes[2], childIds: [7, 5, ...forNext.map(node => node.id)] },
    [specialNodes[3].id]: { ...specialNodes[3], childIds: forSomeday.map(node => node.id) },
    [specialNodes[4].id]: specialNodes[4],
    4: { id: "4", parentId: specialNodes[1].id, isRoot: false, isTodo: true, text: "Interview Manuel", childIds: [], tasksIds: [] },
    5: {
        id: "5",
        parentId: specialNodes[2].id,
        isTodo: true,
        text: "interview many candiates",
        childIds: [],
    },
    6: {
        id: "6",
        parentId: specialNodes[0].id,
        isTodo: true,
        text: "thanks for looking",
        childIds: [],
    },
    7: {
        id: "7",
        parentId: specialNodes[2].id,
        isTodo: true,
        text: "Hire Manuel",
        childIds: [],
    },
    8: {
        id: "8",
        parentId: specialNodes[1].id,
        isTodo: true,
        text: "test mobile view in narrow browser",
        childIds: [],
    },
    9: {
        id: "9",
        parentId: specialNodes[1].id,
        isTodo: true,
        text: "try reordering todos",
        childIds: [],
    },
    10: {
        id: "10",
        parentId: specialNodes[1].id,
        isTodo: true,
        text: "drag between lists in column mode",
        childIds: [],
    },
};
forSomeday.forEach(node => (initialState[node.id] = node));
forNext.forEach(node => (initialState[node.id] = node));

export const nodesSlice = createSlice({
    name: "nodes",
    initialState,
    reducers: {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes

        replaceNodes: (state, action) => {
            state = action.payload;
        },

        changeLocation: (state, action) => {
            state = action.payload;
            state[action.payload.id].location = action.payload.newLocation;
        },

        setIsTodayAndLocationNext: (state, { payload }) => {
            state[payload.id].isToday = payload.isToday;
            state[payload.id].location = "tasks.next";
        },

        deleteNode: (state, { payload }) => {
            const parentId = state[payload.id].parentId;
            state[parentId].childIds = state[parentId].childIds.filter(id => id !== payload.id);
            delete state[payload.id];
        },

        moveToSomeday: (state, { payload }) => {
            state[payload.id].location = "someday";
            state[payload.id].isToday = false;
        },

        SaveNewNode: (state, { payload }) => {
            console.log("saving new node with newNode:", payload.newNode);
            state[payload.newNode.id] = payload.newNode;
            state[payload.newNode.parentId].childIds.push(payload.newNode.id);
        },

        UpdateNodeText: (state, { payload }) => {
            state[payload.id].text = payload.text;
            console.log("updated with this text:", payload.text);
            console.log("update text with id:", payload.id);
        },

        toggleType: (state, { payload }) => {
            state[payload.id].isTodo = state[payload.id].isTodo === undefined ? false : !state[payload.id].isTodo;
        },

        toggleIsDone: (state, { payload }) => {
            state[payload.id].isDone = !state[payload.id].isDone;
        },

        toggleIsToday: (state, { payload }) => {
            state[payload.id].isToday = !state[payload.id].isToday;
        },

        processDragDrop: (state, { payload: { source, destination, draggableId } }) => {
            // source.droppableId === destination.droppableId && source.index === destination.index
            const regex = /tag-|place-|isToday/;

            //checks if source or destination are "folders" which require special treatment, like today or tags, they are only represented as a folder for ux purposes, they are more like generated views, for example an item can have multiple tags, and the folder "today" just includes all the nodes that have the isToday flag set to true.
            //this otherwise great drag and drop library only uses a string as identifier for source and destination, no object reference, so a little workaround is needed, I preppend the node id with keywords to easily accomodate functionality for special folders

            if (regex.test(source.droppableId) || regex.test(source.droppableId)) {
                //leaving those undroppable at this point
                return;
            }

            //search position anew? more robust
            const [removed] = state[source.droppableId].childIds.splice(source.index, 1);

            //gdk nicht "removed" verwenden, mehr robust wäre direkt draggableId
            state[destination.droppableId].childIds.splice(destination.index, 0, removed);
            state[draggableId].parentId = destination.droppableId;

            // if (payload.destination.droppableId === "isToday") state[payload.draggableId].isToday = true;
            // // else if(droppableId...)
            // else state[payload.draggableId].location = payload.destination.droppableId.replace("location-", ""); // !state[payload.newNode.id].isToday;
        },

        checkSpecialNodesExist: (state, { payload }) => {
            const specialNodes = state.filter(node => node.specialRole);
            if (specialNodes.length > 0) return;
            else state[payload.newNode.id].isToday = !state[payload.newNode.id].isToday;
        },

        changeParentNode: (state, { payload: { id, newParentId } }) => {
            console.log("trying changeParentNode with:", state[id]);
            const oldParentId = state[id].parentId;
            console.log("oldParentId", oldParentId);
            const oldIndex = state[oldParentId].childIds.indexOf(oldParentId);
            console.log("oldIndex", oldIndex);
            const [removed] = state[oldParentId].childIds.splice(oldIndex, 1);
            if (removed.length === 0) console.log("Error: changeParentNode didn't remove an element from the parent's array");
            console.log("removed", removed);

            state[id].parentId = newParentId;
            state[newParentId].childIds.push(id);
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    changeParentNode,
    checkSpecialNodesExist,
    processDragDrop,
    toggleIsToday,
    toggleIsDone,
    toggleType,
    UpdateNodeText,
    SaveNewNode,
    moveToSomeday,
    deleteNode,
    setIsTodayAndLocationNext,
    replaceNodes,
    changeLocation,
} = nodesSlice.actions; // increment, decrement,

export { specialNodes as SpecialNodes };

export default nodesSlice.reducer;
