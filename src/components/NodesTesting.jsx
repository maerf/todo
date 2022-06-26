/** @format */

import * as React from "react";

import ListItemButton from "@mui/material/ListItemButton";
import _ from "lodash";

import { v4 as uuid } from "uuid";

export default function NodesTesting() {
    const [nodes, setNodes] = React.useState([]);

    React.useEffect(() => {
        const tempNodes = [];
        let node1 = { id: uuid(), test: "something", nodes: [] };
        let node2 = { id: uuid(), test: "something more there is here, really a lot actually wow", nodes: [] };
        let node3 = {
            id: uuid(),
            test: "something more there is here, really a lot actually wow",
            nodes: [
                { id: uuid(), test: "wow I'm a deep node", nodes: [] },
                {
                    id: uuid(),
                    test: "another deep node with something more there is here, really a lot actually wow",
                    nodes: [
                        { id: uuid(), test: "wow I'm a deep node", nodes: [] },
                        { id: uuid(), test: "another deep node with something more there is here, really a lot actually wow", nodes: [] },
                    ],
                },
            ],
        };
        tempNodes.push(node1, node2, node3);
        setNodes(tempNodes);
        console.log("nodes effect", nodes);
    }, []);

    React.useEffect(() => {
        console.log("Nodes effect", nodes);
    }, [nodes]);

    // const updateNodes = nodes => {
    //     nodes?.forEach(node => {
    //         // 1. search for a match
    //         if (node.id == parentNode.id) {
    //             return (node.nodes = [...(node.nodes || []), newNode]);
    //         } else return updateNodes(node.nodes);
    //         // If match: Update Node
    //         // 2. Else call updatedNodes() on the subnode array
    //     });
    // };

    const newNode = { id: uuid(), test: "something3 ", nodes: [] };

    const search = (tree, target) => {
        if (tree.id === target) {
            return tree;
        }

        for (const child of tree.nodes) {
            const found = search(child, target);

            if (found) {
                return found;
            }
        }
    };

    // ((resNode) => {

    // })(search({nodes})();

    const updateNodes3 = nodeArray => {
        nodeArray?.forEach(node => {
            // 1. search for a match
            if (node.id === nodes[2].nodes[1].nodes[0].id) {
                return "aids";
            } else return updateNodes2(node.nodes);
            // If match: Update Node
            // 2. Else call updatedNodes() on the subnode array
        });
    };

    const updateNodes2 = nodeArray => {
        nodeArray?.forEach(node => {
            // 1. search for a match
            if (node.id === nodes[2].nodes[1].nodes[0].id) {
                return "aids";
            } else return updateNodes2(node.nodes);
            // If match: Update Node
            // 2. Else call updatedNodes() on the subnode array
        });
    };

    const handleAddNodeClick = event => {
        event.stopPropagation();
        console.log("handleAddNodeClick running:", event);
        console.log("updateNotes result", updateNodes2(_.cloneDeep(nodes)));
        // setNodes(prevNodes => _.cloneDeep(prevNodes).map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node)));
        setNodes(prevNodes => _.cloneDeep(prevNodes));
        //.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node)));
    };

    return <ListItemButton onClick={event => handleAddNodeClick(event)}>Add node</ListItemButton>;
}
