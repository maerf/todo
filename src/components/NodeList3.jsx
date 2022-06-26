/** @format */

import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";

import InboxIcon from "@mui/icons-material/Inbox";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

import { v4 as uuid } from "uuid";
import { useImmer } from "use-immer";
import * as helper from "../helpers";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";

import IconButton from "@mui/material/IconButton";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

//reduxify nodes
import { useSelector, useDispatch } from "react-redux";
import * as redux from "../features/nodes/nodesSlice";

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

//RenderNode/RenderNodeList has grown sort of inpedendly as an experiement in recursively called components, code sharing between the "inboxview" nodelist ist not optimized
const RenderNode = ({ parentNodeId, onSelectedNodeChanged }) => {
    const dispatch = useDispatch();
    let tags = useSelector(state => state.tags);
    let nodes = useSelector(state => state.nodes);

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

    //pre-redux-toolkit, no longer called. just here for apprecation of how much easier things are now with immer/redux-toolkit
    const handleAddNodeClick = event => {
        event.stopPropagation();
        // console.log("handleAddNodeClick running:", event);
        // const newNode = { id: uuid(), test: "something3 ", nodes: [] };
        const newNode = helper.createNode(parentNodeId);
        newNode.location = nodes[parentNodeId].location;
        // newNode.isToday = isToday || false;
        // statt setNodes(prevNodes => prevNodes.map(node => {node.id === parentNodeId ? prevNodes[parentNodeId]  }) ({ ...prevNodes, ...newNode }));
        // setNodes(prevNodes => ({ ...prevNodes, ...newNode, ...{...prevNodes[parentNodeId], prevNodes[parentNodeId].children }  }));
        // setNodes(draft => {
        //     draft[newNode.id] = newNode;
        //     draft[parentNodeId].childIds.push(newNode.id);
        // });

        helper.processNewAndDispatch(newNode.id);

        console.log("newNode", newNode);
    };

    const handleNodeTextChange = e => {
        //todo: not implemented
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
        console.log("New selected node, sanity check node[node.id]", nodes[node.id]);
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

            const newNode = helper.createTodoNode(parentNodeId);
            newNode.location = nodes[parentNodeId].location;

            if (helper.processNewAndDispatch(newNode, e.target.value, dispatch)) e.target.value = "";
            //   setNodes(prevNodes => prevNodes.map(node => (node.id == parentNodeId ? { ...node, todos: [...(node.todos || []), newTodo] } : node)));
        }
    };

    const handleKeyDownAddNote = e => {
        if (e.target.value !== "" && e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();

            //   setNodes(prevNodes => prevNodes.map(node => (node.id == parentNodeId ? { ...node, todos: [...(node.todos || []), newTodo] } : node)));

            const newNode = helper.createNode(parentNodeId);
            newNode.location = nodes[parentNodeId].location;

            if (helper.processNewAndDispatch(newNode, e.target.value, dispatch)) e.target.value = "";
        }
    };

    return (
        <>
            <Box>
                <textarea id='noteText' onChange={handleNodeTextChange} value={nodes[parentNodeId]?.text || "nothing here"} />
                <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                    <List component='nav' aria-label='main mailbox folders'>
                        {console.log("nodes[parentNodeId]?.childIds", nodes[parentNodeId]?.childIds)}
                        {console.log("with parent node id:", parentNodeId)}
                        {nodes[parentNodeId]?.childIds?.map(childId => {
                            const node = nodes[childId];
                            console.log("node = nodes[childId] is:", node);
                            // console.log("getChildNodes(parentNodeId)?.map((node, index) => {" + "called with:" + parentNodeId, "node is:" + node);
                            return (
                                <ListItem
                                    key={node.id}
                                    selected={node.id === selectedId}
                                    onClick={event => handleNodeListItemClick(event, node, node.id)}
                                    secondaryAction={
                                        node?.childIds.length ? (
                                            <IconButton edge='end' aria-label='comments'>
                                                <ArrowForwardIosIcon />
                                            </IconButton>
                                        ) : undefined
                                    }
                                    disablePadding>
                                    <ListItemButton dense>
                                        <ListItemIcon>
                                            {node.specialRole || node.id === "todoRoot" ? (
                                                // <FolderOutlinedIcon />
                                                // <InboxIcon />
                                                <TaskAltIcon />
                                            ) : (
                                                <>
                                                    {node.isTodo ? (
                                                        <Checkbox
                                                            edge='start'
                                                            checked={node.isDone}
                                                            onClick={() => {
                                                                dispatch(redux.toggleIsDone({ id: node.id }));
                                                            }}
                                                            tabIndex={-1}
                                                            disableRipple
                                                        />
                                                    ) : (
                                                        <StickyNote2OutlinedIcon />
                                                    )}
                                                </>
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={node.text} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                    <Divider />
                    <List component='nav' aria-label='secondary mailbox folder'>
                        <ListItem>
                            <TextField
                                onKeyDown={handleKeyDownAddNote}
                                id='addTaskNode'
                                label='Add a Note'
                                placeholder='Add a Note'
                                defaultValue=''
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                onKeyDown={handleKeyDownAddTask}
                                id='addTaskField'
                                label='Add a Todo'
                                placeholder='Add a Todo'
                                defaultValue=''
                            />
                        </ListItem>
                    </List>
                </Box>
            </Box>
            {nodes[parentNodeId]?.childIds && selectedNode && (
                <>
                    <Divider orientation='vertical' flexItem />
                    <RenderNode parentNodeId={selectedId} />
                </>
            )}
        </>
    );
};

export default function NodeList({}) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const dispatch = useDispatch();
    let tags = useSelector(state => state.tags);
    let nodes = useSelector(state => state.nodes);

    return (
        <Box sx={{ height: "100vh", display: "flex", border: "1px solid black", bgcolor: "background.paper" }}>
            <RenderNode parentNodeId='0' />
        </Box>
    );
}

/*
Without recursion? 
<RenderNode parentNode="~root~" />
then again
<RenderNode parentNode="result of onSelectedNodeChanged of ^^parent^^" />
then again
<RenderNode parentNode="result of onSelectedNodeChanged of ^^parent^^" />
*/
