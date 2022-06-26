/** @format */

import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import InboxIcon from "@mui/icons-material/Inbox";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

import { v4 as uuid } from "uuid";

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        right: 10,
        top: 0,
        border: `none`,
        padding: "0 0px",
        color: "black",
        backgroundColor: "transparent",
    },
}));
//2px solid ${theme.palette.background.paper}

const RenderNode = ({ parentNode, onSelectedNodeChanged, nodes, setNodes }) => {
    let [selectedId, setSelectedId] = React.useState();
    let [selectedNode, setSelectedNode] = React.useState();

    // React.useEffect(() => {
    //     console.log("selectedNode effect", selectedNode);
    // }, [selectedNode]);

    const handleNodeTextChange = e => {
        e.stopPropagation();
        // console.log("handleNodeTextChange running:", e);
        setNodes(prevNodes => prevNodes.map(node => (node.id == parentNode.id ? { ...node, text: e.target.value } : node)));
    };

    const handleAddNodeClick = event => {
        event.stopPropagation();
        // console.log("handleAddNodeClick running:", event);
        const newNode = { id: uuid(), test: "something3 ", nodes: [] };
        console.log(
            "prevNodes.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node)):\t",
            nodes.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node))
        );

        setNodes(prevNodes => prevNodes.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node)));
    };

    const handleNodeListItemClick = (event, node, id) => {
        console.log("handleNodeListItemClick running:");
        event.stopPropagation();
        setSelectedId(id);
        if (onSelectedNodeChanged) {
            onSelectedNodeChanged(id);
        }
        setSelectedNode(node);
        console.log("New node:\t", node);

        //  console.log("handleNodeListItemClick child", nodes[]);
    };
    console.log("XXX selectedNode", parentNode.id, selectedNode);

    return (
        <>
            <Box>
                <textarea onChange={handleNodeTextChange} value={parentNode.text || "nothing here"} />
                <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                    <List component='nav' aria-label='main mailbox folders'>
                        {parentNode.nodes?.map((node, index) => {
                            return (
                                <ListItemButton key={node.id} selected={node.id === selectedId} onClick={event => handleNodeListItemClick(event, node, node.id)}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Inbox' />
                                    {/* <ListItemIcon>
                                     4<TaskIcon />
                                     <ArrowForwardIosIcon />
                                     </ListItemIcon> */}
                                </ListItemButton>
                            );
                        })}
                    </List>
                    <Divider />
                    <List component='nav' aria-label='secondary mailbox folder'>
                        <ListItemButton onClick={event => handleAddNodeClick(event)}>
                            <ListItemText primary='Add node' />
                        </ListItemButton>
                    </List>
                </Box>
            </Box>
            {parentNode.nodes && selectedNode && (
                <>
                    <Divider orientation='vertical' flexItem />
                    <RenderNode parentNode={selectedNode} nodes={nodes} setNodes={setNodes} />
                </>
            )}
        </>
    );
};

export default function NodeList() {
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

    console.log("loggin nodes", nodes);

    const handleAddClick = event => {
        // nodes.push({ test: "something2", nodes: [] });
        // setNodes(...nodes, { test: "something2", nodes: [] });
        setNodes(prevNodes => [...prevNodes, { id: uuid(), test: "something2 ", nodes: [] }]);
    };
    const handleAddClick2 = event => {
        // nodes.push({ test: "something2", nodes: [] });
        // setNodes(...nodes, { test: "something2", nodes: [] });
        setNodes(prevNodes => [...prevNodes, { id: uuid(), test: "something2", nodes: [] }]);
    };

    // let currentNode;

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        // currentNode = nodes[index];
        // console.log("currentNode", currentNode);
    };

    const handleSubClick = (event, index) => {
        event.stopPropagation();
        event.preventDefault();
        console.log("subclick index:", index);
    };

    // const getNode(){
    //     nodes[index];
    // }

    // const RenderNode = node => {
    //     return (
    //         <Box>
    //             <textarea onChange={handleTextChange} value={nodes[selectedIndex]?.text || "nothing"} />
    //             <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
    //                 <List component='nav' aria-label='main mailbox folders'>
    //                     {nodes[selectedIndex]?.nodes?.map((node, index) => {
    //                         return (
    //                             <ListItemButton key={index} selected={selectedIndex === index} onClick={event => handleListItemClick(event, index)}>
    //                                 <ListItemIcon>
    //                                     <InboxIcon />
    //                                 </ListItemIcon>
    //                                 <ListItemText primary='Inbox' />
    //                                 {/* <ListItemIcon>
    //                             4<TaskIcon />
    //                             <ArrowForwardIosIcon />
    //                         </ListItemIcon> */}
    //                             </ListItemButton>
    //                         );
    //                     })}
    //                 </List>
    //                 <Divider />
    //                 <List component='nav' aria-label='secondary mailbox folder'>
    //                     <ListItemButton onClick={event => handleAddClick2(event)}>
    //                         <ListItemText primary='Add node' />
    //                     </ListItemButton>
    //                 </List>
    //             </Box>
    //         </Box>
    //     );
    // };

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
        <Box sx={{ display: "flex", border: "1px solid black", bgcolor: "background.paper" }}>
            <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                <List component='nav' aria-label='main mailbox folders'>
                    {nodes.map((node, index) => {
                        return (
                            <ListItemButton key={index} selected={selectedIndex === index} onClick={event => handleListItemClick(event, index)}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary={node.test} />

                                {/* <IconButton onClick={event => handleSubClick(event, index)} edge='end' aria-label='comments'>
                                    <CommentIcon />
                                </IconButton> */}

                                {/* <IconButton onClick={event => handleSubClick(event, index)} edge='end' aria-label='comments'>
                                    <StyledBadge color='secondary' badgeContent={1000} max={99}>
                                        <CheckSharpIcon />
                                    </StyledBadge>
                                </IconButton> */}

                                <ListItemIcon>
                                    <ArrowForwardIosIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        );
                    })}
                </List>
                <Divider />
                <List component='nav' aria-label='secondary mailbox folder'>
                    <ListItemButton onClick={event => handleAddClick(event)}>
                        <ListItemText primary='Add node' />
                    </ListItemButton>
                </List>
            </Box>
            <Divider orientation='vertical' flexItem />
            {nodes[selectedIndex] && <RenderNode onSelectedNodeChanged={node => console.log("node changed, new node:", node)} parentNode={nodes[selectedIndex]} nodes={nodes} setNodes={setNodes} />}
        </Box>
    );
}

/*
what I want to do:
<RenderNode parentNode="result of onSelectedNodeChanged of parent" />
then again
<RenderNode parentNode="result of onSelectedNodeChanged of parent" />
then again
<RenderNode parentNode="result of onSelectedNodeChanged of parent" />
*/
