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

import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

import { v4 as uuid } from "uuid";
import TextField from "@mui/material/TextField";
import MenuIcon from "@mui/icons-material/Menu";

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

export default function NodeList2() {
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    //vue könnte direkt nodes.push (vs aber wie change db herausfinden wann upserten sollte)
    const [nodes, setNodes] = React.useState([]);
    const [project, setProjects] = React.useState([]);

    const task = { isDone: false, title: "fix bug", isToday: true };

    React.useEffect(() => {
        const tempNodes = [];
        let node1 = { id: uuid(), test: "something", nodes: [], tasks: [] };
        let node2 = { id: uuid(), test: "something more there is here, really a lot actually wow", nodes: [], tasks: [] };
        let node3 = {
            id: uuid(),
            test: "something more there is here, really a lot actually wow",
            tasks: [{ id: uuid(), isDone: false, title: "do something", isToday: false }],
            nodes: [
                { id: uuid(), test: "wow I'm a deep node", nodes: [], tasks: [{ id: uuid(), isDone: false, title: "fix bug", isToday: true }] },
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

    //ask: one-side parentNode, other side direct access to setNodes and nodes, best "db" access structure for this
    const RenderNode = ({ parentNode, onSelectedNodeChanged }) => {
        let [selectedId, setSelectedId] = React.useState();
        let [selectedNode, setSelectedNode] = React.useState();

        React.useEffect(() => {
            console.log("selectedNode effect", selectedNode);
        }, [selectedNode]);

        const handleNodeTextChange = e => {
            e.stopPropagation();
            console.log("handleNodeTextChange running:", e);
            setNodes(prevNodes => prevNodes.map(node => (node.id == parentNode.id ? { ...node, text: e.target.value } : node)));
        };

        const handleAddNodeClick = event => {
            event.stopPropagation();
            console.log("handleAddNodeClick running:", event);
            const newNode = { id: uuid(), test: "something3 ", nodes: [] };
            setNodes(prevNodes => prevNodes.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node)));
        };

        const handleNodeListItemClick = (event, node, id) => {
            console.log("handleNodeListItemClick running:", event);
            event.stopPropagation();
            setSelectedId(id);
            if (onSelectedNodeChanged) onSelectedNodeChanged(id);
            console.log("before set", node);
            setSelectedNode(node);
            console.log("selected id", id);
        };

        const handleKeyDownAddTask = e => {
            if (e.keyCode == 13 && e.shiftKey == false) {
                e.preventDefault();
                const newTodo = { id: uuid(), isDone: false, title: e.target.value, isToday: true };
                setNodes(prevNodes => prevNodes.map(node => (node.id == parentNode.id ? { ...node, todos: [...(node.todos || []), newTodo] } : node)));

                e.target.value = ""; // inputText.current.value = "";
            }
        };

        // console.log("selectedNode", selectedNode);

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
                            {parentNode.nodes && <Divider />}
                            {parentNode.todos?.map((todo, index) => {
                                return (
                                    <ListItem
                                        key={todo.id}
                                        selected={todo.id === selectedId}
                                        onClick={event => handleNodeListItemClick(event, todo, todo.id)}
                                        secondaryAction={
                                            <IconButton edge='end' aria-label='comments'>
                                                <CommentIcon />
                                            </IconButton>
                                        }
                                        disablePadding>
                                        <ListItemButton dense>
                                            <ListItemIcon>
                                                <Checkbox edge='start' checked={todo.isDone} tabIndex={-1} disableRipple />
                                            </ListItemIcon>
                                            <ListItemText primary={todo.title} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>

                        <Divider />
                        <List component='nav' aria-label='secondary mailbox folder'>
                            <ListItemButton onClick={event => handleAddNodeClick(event)}>
                                <ListItemText primary='Add node' />
                            </ListItemButton>
                            <TextField onKeyDown={handleKeyDownAddTask} id='addTaskField' label='Add a Todo' defaultValue='' />
                        </List>
                    </Box>
                </Box>
                {parentNode.nodes && selectedNode && (
                    <>
                        <Divider orientation='vertical' flexItem />
                        <RenderNode parentNode={selectedNode} />
                    </>
                )}
            </>
        );
    };

    //origion listitem vor checkbox einbau
    //  <ListItemButton key={todo.id} selected={todo.id === selectedId} onClick={event => handleNodeListItemClick(event, todo, todo.id)}>
    //                                     <ListItemIcon>
    //                                         <TaskIcon />
    //                                     </ListItemIcon>
    //                                     <ListItemText primary={todo.title} />
    //                                     {/* <ListItemIcon>
    //                             4<TaskIcon />
    //                             <ArrowForwardIosIcon />
    //                         </ListItemIcon> */}
    //                                 </ListItemButton>

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
            {nodes[selectedIndex] && <RenderNode onSelectedNodeChanged={node => console.log("node changed, new node:", node)} parentNode={nodes[selectedIndex]} />}
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
