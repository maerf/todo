/** @format */

import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";

import InboxIcon from "@mui/icons-material/Inbox";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DraftsIcon from "@mui/icons-material/Drafts";
import TaskIcon from "@mui/icons-material/Task";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { v4 as uuid } from "uuid";

export default function SubeNodeList({ node }) {
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    //vue könnte direkt nodes.push (vs aber wie change db herausfinden wann upserten sollte)
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
                { id: uuid(), test: "another deep node with something more there is here, really a lot actually wow", nodes: [] },
            ],
        };
        tempNodes.push(node1, node2, node3);
        setNodes(tempNodes);
        console.log("nodes effect", nodes);
    }, []);

    console.log(nodes);

    const handleAddClick = event => {
        // nodes.push({ test: "something2", nodes: [] });
        // setNodes(...nodes, { test: "something2", nodes: [] });
        setNodes([...nodes, { id: uuid(), test: "something2 ", nodes: [] }]);
    };
    const handleAddClick2 = event => {
        // nodes.push({ test: "something2", nodes: [] });
        // setNodes(...nodes, { test: "something2", nodes: [] });
        setNodes([...nodes, { id: uuid(), test: "something2", nodes: [] }]);
    };

    let currentNode;

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        currentNode = node.nodes[index];
        console.log("currentNode", currentNode);
    };

    const handleSubClick = (event, index) => {
        event.stopPropagation();
        event.preventDefault();
        console.log("subclick index:", index);
    };

    // const getNode(){
    //     nodes[index];
    // }

    const renderSubNodes = node => {};

    const handleTextChange = e => {
        console.log("current text", e.target.value);
        if (nodes) {
            console.log(
                "setting nodes to:",
                nodes.map((node, index) => {
                    return index == selectedIndex ? { ...node, text: e.target.value } : node;
                })
            );
            setNodes(
                nodes.map((node, index) => {
                    return index == selectedIndex ? { ...node, text: e.target.value } : node;
                })
            );
        }
    };

    return (
        <>
            <Box sx={{ display: "flex", border: "1px solid black", bgcolor: "background.paper" }}>
                <textarea onChange={handleTextChange} value={nodes[selectedIndex]?.text || "nothing"} />
                <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                    <List component='nav' aria-label='main mailbox folders'>
                        {nodes[selectedIndex]?.nodes?.map((node, index) => {
                            return (
                                <ListItemButton key={index} selected={selectedIndex === index} onClick={event => handleListItemClick(event, index)}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={node.test} />
                                    <ListItemIcon>
                                        4<TaskIcon />
                                    </ListItemIcon>
                                    <IconButton onClick={event => handleSubClick(event, index)} edge='end' aria-label='comments'>
                                        <CommentIcon />
                                    </IconButton>
                                    <ArrowForwardIosIcon disabled />
                                </ListItemButton>
                            );
                        })}
                    </List>
                    <Divider />
                    <List component='nav' aria-label='secondary mailbox folder'>
                        <ListItemButton onClick={event => handleAddClick2(event)}>
                            <ListItemText primary='Add node' />
                        </ListItemButton>
                    </List>
                </Box>
            </Box>
        </>
    );
}
