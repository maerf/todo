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

import * as helper from "../helpers";

import { addTagsArray, addPlacesArray } from "../features/tags/tagsSlice";

//Drag+Drop
import { DragDropContext, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

import { useParams } from "react-router-dom";

//redux nodes
import { useSelector, useDispatch } from "react-redux";
import * as redux from "../features/nodes/nodesSlice";

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

//InboxView is currently not only used for the Inbox but for all kinds of list. To be renamed ... NodeListView?
export default function ListView({ parentId, isColumnMode, location, isToday, droppableId }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuContext, setMenuContext] = useState(null);
    const [nodeIdEditing, setNodeIdEditing] = useState(null);

    const dispatch = useDispatch();
    let tags = useSelector(state => state.tags);
    let nodes = useSelector(state => state.nodes);

    let params = useParams();

    if (params.tag) {
        console.log("tag found:", tags.tags[params.tag]);
    }

    if (params.place) {
        console.log("place found:", tags.places[params.place]);
    }

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
        }
    };

    const handleMenuSendToTasks = () => {
        dispatch(redux.changeLocation({ id: menuContext.id, location: "tasks.next" }));

        setAnchorEl(null);
    };

    const handleMenuSendToInbox = () => {
        dispatch(redux.changeLocation({ id: menuContext.id, location: "inbox" }));
        setAnchorEl(null);
    };

    const handleMenuChangeParent = newParentId => {
        dispatch(redux.changeParentNode({ id: menuContext.id, newParentId }));
        setAnchorEl(null);
    };

    const handleMenuShowInToday = () => {
        dispatch(redux.setIsTodayAndLocationNext({ id: menuContext.id, isToday: true }));

        setAnchorEl(null);
    };
    const handleMenuDontShowInToday = () => {
        dispatch(redux.setIsTodayAndLocationNext({ id: menuContext.id, isToday: false }));

        setAnchorEl(null);
    };

    const handleMenuDelete = () => {
        dispatch(redux.deleteNode({ id: menuContext.id }));
        setAnchorEl(null);
    };

    const toggleIsToday = () => {
        dispatch(redux.toggleIsToday({ id: menuContext.id }));

        setAnchorEl(null);
    };

    const handleMenuMoveToSomeday = () => {
        dispatch(redux.moveToSomeday({ id: menuContext.id }));
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

    //note: in order to keep the state flat as is recommended, I manually keep track of parent-child relationships instead of using references
    function addEnty() {
        if (inboxInput.current.value) {
            console.log("addentry:", inboxInput.current.value);
            const newNode = helper.createTodoNode(parentId || 0);
            let res = helper.GetTagsAndStripFromString(inboxInput.current.value);
            newNode.text = res.str;

            newNode.isToday = isToday || false;
            console.log("addEnty location:", location);
            console.log("GetTagsAndStripFromString", res);

            if (res.result["#"].length) dispatch(addTagsArray({ nodeId: newNode, tags: res.result["#"] }));

            if (res.result["@"].length) dispatch(addPlacesArray({ nodeId: newNode, places: res.result["@"] }));

            dispatch(redux.SaveNewNode({ newNode }));

            console.log("newNode", newNode);

            inboxInput.current.value = "";
        }
    }

    function handleMakeEditable(nodeId) {
        console.log("handleMakeEditable nodeId", nodeId);
        setNodeIdEditing(nodeId);
    }

    function handleTypeToggle() {
        dispatch(redux.toggleType({ id: menuContext.id }));
        setAnchorEl(null);
    }

    function handleTodoToggle(e, node, nodeId) {
        console.log("Handle toggle e:", e);
        dispatch(redux.toggleIsDone({ id: nodeId }));
        setAnchorEl(null);
        console.log("Handle toggle:", node);
    }

    let customAddTo = "Add to: ??";
    const howToTags = " ...  try something #react @office";
    if (isToday) {
        customAddTo = "Add to: Today";
    } else customAddTo = "Add to: " + (parentId ? parentId : "??");
    const addToPlaceholder = isColumnMode ? customAddTo : "Add an item " + howToTags;

    //a bit big but no point refactoring it now, as features are changing with cloud integration
    function filterItems() {
        //for the today "folder", get all the task with isToday, that are not in the inbox)
        if (parentId && isToday) return Object.values(nodes).filter(node => node.isToday && node.parentId !== "inbox");
        //to keep the state in redux as is recommended, I'm not storing nested objects, only an array of childIds, this array is also used for drag and drop order persistence
        //standard case for all nodes except today, tags and places
        else if (parentId) return nodes[parentId]?.childIds?.map(id => nodes[id]);
        //older way storing nodes via a location-property
        else if (location)
            return Object.values(nodes).filter(node => {
                if (location && !isToday) return node.location === location;
                if (location && isToday) return node.location === location && node.isToday;
                if (parentId && !isToday) return;
                else if (isToday) {
                    if (node.location === location && node.isToday) return true;
                    else return false;
                } else return false;
            });
        else if (params.tag) return tags.tags[params.tag];
        else if (params.place) return tags.places[params.place];
    }
    return (
        // <Box sx={{ display: "flex", height: "100vh", justifyContent: "center", paddingTop: "10px" }}>
        <Container sx={{ paddingTop: "10px", height: "100%" }}>
            {/* <Box component='main'> */}
            <Paper onKeyDown={handleKeyDown} sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
                {}
                <InputBase
                    inputRef={inboxInput}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={addToPlaceholder}
                    inputProps={{ "aria-label": "Add item to inbox" }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
                <IconButton onClick={addEnty} sx={{ p: "10px" }} aria-label='directions'>
                    <AddBoxIcon />
                </IconButton>
            </Paper>
            <Droppable droppableId={droppableId} isCombineEnabled={false}>
                {provided => (
                    <Box sx={{ marginTop: "10px", height: "100%" }} ref={provided.innerRef} {...provided.droppableProps}>
                        {filterItems().map((node, index) => {
                            if (node.id === nodeIdEditing)
                                return (
                                    <ItemEditMode
                                        index={index}
                                        onEndEdit={() => {
                                            setNodeIdEditing(null);
                                        }}
                                        key={node.id}
                                        nodeIdEditing={nodeIdEditing}
                                        node={node}
                                    />
                                );

                            if (node.id !== nodeIdEditing)
                                return (
                                    <NodeListItem
                                        onTodoToggle={handleTodoToggle}
                                        index={index}
                                        onMakeEditableClick={handleMakeEditable}
                                        onSetMenuContext={handleSetMenuContext}
                                        onMenuIconClick={handleOnMenuIconClick}
                                        key={node.id}
                                        node={node}
                                    />
                                );
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
                            {parentId !== "inbox" && <MenuItem onClick={() => handleMenuChangeParent("inbox")}>Move to Inbox</MenuItem>}
                            {parentId !== "today" && <MenuItem onClick={() => handleMenuChangeParent("today")}>Move to Today</MenuItem>}
                            {parentId !== "next" && <MenuItem onClick={() => handleMenuChangeParent("next")}>Move to Next</MenuItem>}
                            {parentId !== "someday" && <MenuItem onClick={() => handleMenuChangeParent("someday")}>Move to Someday</MenuItem>}
                            {/* {!isToday && <MenuItem onClick={handleMenuShowInToday}>Show in Today</MenuItem>} */}
                            {/* <MenuItem onClick={handleMenuDontShowInToday}>Don't Show in Today</MenuItem> */}
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem onClick={handleMenuEdit}>edit</MenuItem>
                            <MenuItem onClick={handleTypeToggle}>toggle type</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleMenuDelete}>delete</MenuItem>
                        </Menu>
                    </Box>
                )}
            </Droppable>
            {/* </Box> */}
        </Container>
        // {/* </Box> */}
    );
}
