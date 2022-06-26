/** @format */

import { v4 as uuid } from "uuid";

import * as redux from "./features/nodes/nodesSlice";
import { addTagsArray, addPlacesArray } from "./features/tags/tagsSlice";

// const uid = uuid();
// return { id: uid, parentId: parentNodeId, isRoot: false, text: "I'm a childof " + parentNodeId, childIds: [], tasksIds: [] };
export function createNode(parentNodeId = "0", uid = uuid()) {
    return {
        id: uid,
        isDone: false,
        isTodo: false,
        isToday: false,
        parentId: parentNodeId,
        isRoot: false,
        text: "I'm a childof " + parentNodeId,
        childIds: [],
        tasksIds: [],
    };
}

export function createTodoNode(parentNodeId = "0", text = "") {
    let node = createNode(parentNodeId);
    node.isTodo = true;
    node.text = text;
    return node;
}

//some partitially duplicate code here, not generic even if it is tempting, there are only 2 types of tags and currently they need to be treated differently in redux and for easy accessin
export function GetTagsAndStripFromString(str) {
    let match = null;
    let result = { "@": [], "#": [] };
    let stripped = str;
    // improved from match = str.match(rx);

    let rx = /\@([\w]+)/g;

    while ((match = rx.exec(str)) !== null) {
        console.log("match: ", match);
        console.log("stripped: ", stripped);
        stripped = stripped.replace(match[0], "");
        result["@"].push(match[1]);
    }

    rx = /\#([\w]+)/g;

    while ((match = rx.exec(str)) !== null) {
        console.log("match: ", match);
        stripped = stripped.replace(match[0], "");
        result["#"].push(match[1]);
    }

    return { str: stripped, result };
}

//some partitially duplicate code here, but only temporarily, feature is still changing
export function processUpdateAndDispatch(id, str, dispatch) {
    let res = GetTagsAndStripFromString(str);
    //still some text left?
    if (res.str) {
        if (res.result["#"].length) dispatch(addTagsArray({ nodeId: id, tags: res.result["#"] }));

        if (res.result["@"].length) dispatch(addPlacesArray({ nodeId: id, places: res.result["@"] }));

        dispatch(redux.UpdateNodeText({ id: id, text: res.str }));

        return true;
    } else return false;
}

//some partitially duplicate code here, but only temporarily, feature is still changing
export function processNewAndDispatch(newNode, str, dispatch) {
    let res = GetTagsAndStripFromString(str);
    //still some text left?
    if (res.str) {
        if (res.result["#"].length) dispatch(addTagsArray({ nodeId: newNode.id, tags: res.result["#"] }));

        if (res.result["@"].length) dispatch(addPlacesArray({ nodeId: newNode.id, places: res.result["@"] }));

        newNode.text = res.str;

        dispatch(redux.SaveNewNode({ newNode }));

        return true;
    } else return false;
}

//gdk array = is.Array(name) ? name : [..name]. dann for each immer
export function createSpecialNode(name, parentId = 0) {
    let node = createNode(parentId, name);
    node.specialRole = name;
    node.text = name;
    return node;
}

//todo cleanup, empty-return flow nicht sehr logisch. gdk einzelne checken? auch gdk lieber createSpecialNode optional array annehmen lassen
export function checkGenerateSpecialNodes(nodesState) {
    let specialNodes = Object.values(nodesState).filter(node => node.specialRole);
    if (!specialNodes.length) {
        console.log("specialNodes missing, generatings...");
        specialNodes = ["inbox", "next", "someday", "projects"].map(str => createSpecialNode(str));
        return specialNodes;
    } else return [];
}
//gdk refactorem zu specialNodes["inbox"]  specialNodes.inbox  und  Object.values(specialNodes)

//todo cleanup, empty-return flow nicht sehr logisch. gdk einzelne checken? auch gdk lieber createSpecialNode optional array annehmen lassen
export function generateSpecialNodes(parentId) {
    const specialNodes = ["inbox", "today", "next", "someday", "projects"].map(str => createSpecialNode(str, parentId));
    return specialNodes;
}

// localStorage.setItem("user", JSON.stringify({ somearray: [{ iam: "cat" }, { iam: "dog" }] }));
// const stringifiedPerson = localStorage.getItem("user");
// const personAsObjectAgain = JSON.parse(stringifiedPerson);
// console.log("personAsObjectAgain", personAsObjectAgain);
