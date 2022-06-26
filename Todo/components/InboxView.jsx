/** @format */

import { useState, useRef, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import TextField from "@mui/material/TextField";

import { Link as RouterLink } from "react-router-dom";
import { Link as MaterialLink } from "@mui/material/Link";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotesIcon from "@mui/icons-material/Notes";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import PrimarySearchAppBar from "./PrimarySearchAppBar";

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import ListItemButton from "@mui/material/ListItemButton";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import AddBoxIcon from "@mui/icons-material/AddBox";
import { v4 as uuid } from "uuid";

//List:
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

//Menu:
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import ItemEditMode from "./ItemEditMode";
import NodeListItem from "./NodeListItem";
// import NodeEditor from "./components/NodeEditor";
import { useSelector, useDispatch } from "react-redux";

import { createNode, createTodoNode, GetTagsAndStripFromString } from "../helpers";

import { addTagsArray } from "../features/tags/tagsSlice";

//Drag+Drop
import { DragDropContext, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

//I know it's not a good idea to have several components directly change the state
//but data structure might change with amount of implemented features in this short project
export default function InboxView({ droppableId, setNodes, nodes }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuContext, setMenuContext] = useState(null);
    const [nodeIdEditing, setNodeIdEditing] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("menuContext changed", menuContext);
    }, [menuContext]);

    useEffect(() => {
        setTimeout(() => {
            droppableId = droppableId;
        }, 2000);
    }, []);

    const open = Boolean(anchorEl);
    const handleOnMenuIconClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        console.log("anchorEl:", anchorEl);
        setAnchorEl(null);
    };

    const inboxInput = useRef();

    const handleKeyDown = e => {
        if (e.keyCode == 13) {
            e.preventDefault();
            addEnty();
            // console.log("todos :", e.target.value);
            // inboxInput.current.value = "";
        }
    };

    function createNode(parentNodeId = "0") {
        const uid = uuid();
        return { id: uid, parentId: parentNodeId, isRoot: false, text: "I'm a parent", childIds: [], tasksIds: [] };
    }

    const handleMenuSendToTasks = () => {
        setNodes(draft => {
            draft[menuContext.id].location = "tasks.next";
        });
        setAnchorEl(null);
    };

    const handleMenuEdit = () => {
        setNodeIdEditing(menuContext.id);
        console.log("NodeIdEditing:", nodeIdEditing);
        handleClose();
    };

    function handleSetMenuContext(node) {
        setMenuContext(node);
    }

    //note: @teach's: in order to keep the state flat, I manually keep track of parent-child relationships
    function addEnty() {
        console.log("addentry:", inboxInput.current.value);

        //str = res.str;

        const newNode = createNode(0);

        let res = GetTagsAndStripFromString(inboxInput.current.value);
        console.log("GetTagsAndStripFromString", res);

        newNode.location = "inbox";
        newNode.text = res.str;

        if (res.result["@"].length) dispatch(addTagsArray({ nodeId: newNode, tags: res.result["@"] }));

        setNodes(draft => {
            draft[newNode.id] = newNode;
            draft[0].childIds.push(newNode.id);
        });
        console.log("newNode", newNode);

        inboxInput.current.value = "";
    }

    function handleMakeSubtask() {}

    function handleTodoToggle(e, todo) {
        console.log("Handle toggle:", todo);
    }

    return (
        <Box sx={{ display: "flex", height: "100vh", backgroundColor: "green" }}>
            {/*  <CssBaseline /> <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
                        A lot todo{" "}
                    </Typography>

                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder='Search…' inputProps={{ "aria-label": "search" }} />
                    </Search>
                </Toolbar>
            </AppBar> */}

            <Box component='main'>
                {/* sx={{ flexGrow: 1, p: 3 }} */}
                {/* <Toolbar /> */}
                <Paper onKeyDown={handleKeyDown} sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}>
                    {/* <IconButton sx={{ p: "10px" }} aria-label='menu'>
                        <MenuIcon />
                    </IconButton> */}
                    <InputBase inputRef={inboxInput} sx={{ ml: 1, flex: 1 }} placeholder='Add an item ... ' inputProps={{ "aria-label": "Add item to inbox" }} />
                    {/* <IconButton sx={{ p: "10px" }} aria-label='search'>
                        <SearchIcon />
                    </IconButton> */}
                    <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
                    <IconButton onClick={addEnty} sx={{ p: "10px" }} aria-label='directions'>
                        <AddBoxIcon />
                    </IconButton>
                </Paper>

                <Droppable droppableId={droppableId}>
                    {provided => (
                        <Box ref={provided.innerRef} {...provided.droppableProps}>
                            {/* {console.log("Inboxview nodes pre rendering: ", Object.values(nodes))} */}
                            {Object.values(nodes)
                                .filter(node => node.location == "inbox")
                                .map((node, index) => {
                                    // console.log("Inboxview nodeIdEditing", nodeIdEditing);
                                    // console.log("Inboxview node.id", node.id);
                                    // return <p key={node.id}>Test</p>;
                                    if (node.id === nodeIdEditing)
                                        return (
                                            <ItemEditMode
                                                index={index}
                                                onEndEdit={() => {
                                                    setNodeIdEditing(null);
                                                }}
                                                key={node.id}
                                                nodes={nodes}
                                                nodeIdEditing={nodeIdEditing}
                                                setNodes={setNodes}
                                                node={node}
                                            />
                                        ); // <Paper>{node.text}</Paper>;

                                    if (node.id !== nodeIdEditing) return <NodeListItem onTodoToggle={handleTodoToggle} index={index} onSetMenuContext={handleSetMenuContext} onMenuIconClick={handleOnMenuIconClick} key={node.id} nodes={nodes} setNodes={setNodes} node={node} />;
                                })}
                            {provided.placeholder}
                            <Menu
                                id='basic-menu'
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}>
                                <MenuItem onClick={handleMenuSendToTasks}>Move to Tasks</MenuItem>
                                <MenuItem onClick={handleClose}>delete</MenuItem>
                                <MenuItem onClick={handleMenuEdit}>edit</MenuItem>
                            </Menu>
                            {/*Movin the menue here made the inbox be fully orange in height*/}
                        </Box>
                    )}
                </Droppable>
            </Box>
            {/* <Divider orientation='vertical' flexItem /> */}
            {/*box was sx={{ flexGrow: 1, p: 3 }}*/}
            {/* <Box sx={{ backgroundColor: "green", paddingTop: "50px" }}> */}
            {/* {nodeForEditing && <NodeEditor nodes={nodes} setNodes={setNodes} />}. first line? */}
            {/* <br /> */}
            {/* first line? <br /> */}
            {/* first line? */}
            {/* </Box> */}
        </Box>
    );
}
