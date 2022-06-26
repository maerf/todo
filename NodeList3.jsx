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
import { useImmer } from "use-immer";
import { createNode, createTodoNode } from "../helpers";
import TextField from "@mui/material/TextField";

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

const RenderNode = ({ parentNodeId, onSelectedNodeChanged, nodes, setNodes }) => {
    let [selectedId, setSelectedId] = React.useState();
    let [selectedNode, setSelectedNode] = React.useState();
    // let [selectedNode, setSelectedNode] = useImmer();

    React.useEffect(() => {
        console.log("RenderNode nodes effect", nodes);
    }, [nodes]);

    React.useEffect(() => {
        setSelectedId(null);
        setSelectedNode(null);
        console.log("Set to zero");
    }, [parentNodeId]);

    const handleAddNodeClick = event => {
        event.stopPropagation();
        // console.log("handleAddNodeClick running:", event);
        // const newNode = { id: uuid(), test: "something3 ", nodes: [] };
        const newNode = createNode(parentNodeId);
        // statt setNodes(prevNodes => prevNodes.map(node => {node.id === parentNodeId ? prevNodes[parentNodeId]  }) ({ ...prevNodes, ...newNode }));
        // setNodes(prevNodes => ({ ...prevNodes, ...newNode, ...{...prevNodes[parentNodeId], prevNodes[parentNodeId].children }  }));
        setNodes(draft => {
            draft[newNode.id] = newNode;
            draft[parentNodeId].childIds.push(newNode.id);
        });

        console.log("newNode", newNode);

        // console.log(
        //     "prevNodes.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node)):\t"
        //     // nodes.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node))
        // );
        // setNodes(prevNodes => prevNodes.map(node => (node.id == parentNode.id ? { ...node, nodes: [...node.nodes, newNode] } : node)));
    };

    const handleNodeTextChange = e => {
        e.stopPropagation();
        // console.log("handleNodeTextChange running:", e);
        // setNodes(prevNodes => prevNodes.map(node => (node.id == parentNode.id ? { ...node, text: e.target.value } : node)));
    };

    const handleNodeListItemClick = (event, node, id) => {
        console.log("handleNodeListItemClick running, node:" + node + " id:" + id);
        event.stopPropagation();
        setSelectedId(id);
        if (onSelectedNodeChanged) {
            onSelectedNodeChanged(id);
        }
        setSelectedNode(node);
        console.log("New selected node:\t", node);
        console.log("New selected node id:", id);
        console.log("New selected node, sanity node[node.id]", nodes[node.id]);
    };

    function getChildNodes(parentId) {
        console.log("In getChildNodes, NODES is: ", nodes);
        const childs = Object.values(nodes).filter(node => node.parentId === parentId);
        console.log("getChildNodes called with " + parentId + " result:", childs);

        return childs;
    }

    const handleKeyDownAddTask = e => {
        if (e.target.value !== "" && e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();

            const newTodo = createTodoNode(parentNodeId);
            newTodo.text = e.target.value;

            //   setNodes(prevNodes => prevNodes.map(node => (node.id == parentNodeId ? { ...node, todos: [...(node.todos || []), newTodo] } : node)));

            setNodes(draft => {
                draft[newTodo.id] = newTodo;
                draft[newTodo.parentId].childIds.push(newTodo.id);
            });

            e.target.value = ""; // inputText.current.value = "";
        }
    };
    // console.log("XXX selectedNode", parentNode.id, selectedNode);

    return (
        <>
            <Box>
                <textarea onChange={handleNodeTextChange} value={nodes[parentNodeId]?.text || "nothing here"} />
                <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                    <List component='nav' aria-label='main mailbox folders'>
                        {console.log("nodes[parentNodeId]?.childIds", nodes[parentNodeId]?.childIds)}
                        {console.log("with parent node id:", parentNodeId)}
                        {nodes[parentNodeId]?.childIds?.map(childId => {
                            const node = nodes[childId];
                            console.log("node = nodes[childId] is:", node);
                            // console.log("getChildNodes(parentNodeId)?.map((node, index) => {" + "called with:" + parentNodeId, "node is:" + node);
                            return (
                                <ListItemButton key={node.id} selected={node.id === selectedId} onClick={event => handleNodeListItemClick(event, node, node.id)}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={node.text} />
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
                        <TextField onKeyDown={handleKeyDownAddTask} id='addTaskField' label='Add a Todo' placeholder='Add a Todo' defaultValue='' />
                    </List>
                </Box>
            </Box>
            {nodes[parentNodeId]?.childIds && selectedNode && (
                <>
                    <Divider orientation='vertical' flexItem />
                    <RenderNode parentNodeId={selectedId} nodes={nodes} setNodes={setNodes} />
                </>
            )}
        </>
    );
};

export default function NodeList({ nodes, setNodes }) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    //vue könnte direkt nodes.push (vs aber wie change db herausfinden wann upserten sollte)
    // const [nodes, setNodes] = React.useState([]);

    // createNode()
    // {
    //          const uid = uuid();
    //          let users[uid] = { id: uid, parentId:"", isRoot:true, test: "I'm a parent", childIds: [1], tasksIds: [] };
    //                     }

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
            <RenderNode parentNodeId='0' nodes={nodes} setNodes={setNodes} />
        </Box>
    );
}

/*
Without recursion? -> what I want to do:
<RenderNode parentNode="~root~" />
then again
<RenderNode parentNode="result of onSelectedNodeChanged of ^^parent^^" />
then again
<RenderNode parentNode="result of onSelectedNodeChanged of ^^parent^^" />
*/
