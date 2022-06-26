/** @format */

import { v4 as uuid } from "uuid";

export function createNode(parentNodeId = "0") {
    const uid = uuid();
    return { id: uid, parentId: parentNodeId, isRoot: false, text: "I'm a childof " + parentNodeId, childIds: [], tasksIds: [] };
}

export function createTodoNode(parentNodeId = "0") {
    const uid = uuid();
    return { id: uid, isDone: false, isTodo: false, parentId: parentNodeId, isRoot: false, text: "I'm a childof " + parentNodeId, childIds: [], tasksIds: [] };
}

export function GetTagsAndStripFromString(str) {
    let match = null;
    let result = { "@": [], "#": [] };

    let rx = /\@([\w]+)/;
    match = str.match(rx);
    if (match) {
        console.log("match: ", match);
        str = str.replace(match[0], "");
        result["@"].push(match[0]);
        // e.target.value = "";
    }

    rx = /\#([\w]+)/;
    match = str.match(rx);
    if (match) {
        console.log("match: ", match);
        str = str.replace(match[0], "");
        result["#"].push(match[0]);
        // e.target.value = "";
    }

    return { str, result };
}
