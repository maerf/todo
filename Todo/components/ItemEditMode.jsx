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

//Edit Item
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

//I know it's not a good idea to have several components directly change the state
//but data structure might change with amount of implemented features in this short project
export default function ItemEditMode({ setNodes, onEndEdit, nodes, nodeIdEditing, node, onListItemMenuClick }) {
    const [menuContext, setMenuContext] = useState(null);
    const [nodeForEditing, setNodeForEditing] = useState(null);

    useEffect(() => {
        console.log("menuContext changed", menuContext);
    }, [menuContext]);

    const handleClose = () => {
        // console.log("anchorEl:", anchorEl);
        // setAnchorEl(null);
    };

    const inboxInput = useRef();

    const handleKeyDown = e => {
        if (e.keyCode == 13) {
            e.preventDefault();
            // console.log("handleKeyDown :", e.target.value);
            // inboxInput.current.value = "";
            UpdateEnty();
        }
    };

    function createNode(parentNodeId = "0") {
        const uid = uuid();
        return { id: uid, parentId: parentNodeId, isRoot: false, text: "I'm a childof " + parentNodeId, childIds: [], tasksIds: [] };
    }

    const handleMenuSendToTasks = () => {
        setNodes(draft => {
            draft[menuContext.id].location = "tasks.next";
        });
    };

    const handleMenuEdit = () => {
        setNodeForEditing(menuContext.id);
    };

    //note: @teach's: in order to keep the state flat, I manually keep track of parent-child relationships
    function addEnty() {
        console.log("addentry:", inboxInput.current.value);

        const newNode = createNode(0);
        newNode.location = "inbox";
        newNode.text = inboxInput.current.value;
        setNodes(draft => {
            draft[newNode.id] = newNode;
            draft[0].childIds.push(newNode.id);
        });
        console.log("newNode", newNode);

        inboxInput.current.value = "";
    }

    function handleSave() {
        UpdateEnty();
    }

    function UpdateEnty(nodeId, text) {
        console.log("UpdateEnty:", inboxInput.current.value);

        let str = inboxInput.current.value;
        let match = null;
        // if (str.contains(`\\`)) {

        let rx = /\@([\w]+)/;
        match = str.match(rx);
        if (match) {
            console.log("match: ", match);
            str = str.replace(match[0], "");
            // e.target.value = "";
        }

        rx = /\#([\w]+)/;
        match = str.match(rx);
        if (match) {
            console.log("match: ", match);
            str = str.replace(match[0], "");
            // e.target.value = "";
        }

        setNodes(draft => {
            draft[nodeIdEditing].text = str;
            //draft[0].childIds.push(newNode.id);
        });

        inboxInput.current.value = "";
        onEndEdit();
    }

    const handleTextChange = e => {
        console.log("current text", e.target.value);
        let str = e.target.value;
        let match = null;
        // if (str.contains(`\\`)) {

        // let rx = /\@([\w]+)/;
        // match = str.match(rx);
        // if (match) {
        //     console.log("match: ", match);
        //     // str.replace(match[0], "");
        //     // e.target.value = "";
        // }

        // rx = /\#([\w]+)/;
        // match = str.match(rx);
        // if (match) {
        //     console.log("match: ", match);
        //     // str.replace(match[0], "");
        //     // e.target.value = "";
        // }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Paper onKeyDown={handleKeyDown} sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}>
                {/* <IconButton sx={{ p: "10px" }} aria-label='menu'>
                        <MenuIcon />
                    </IconButton> */}
                <InputBase onChange={handleTextChange} inputRef={inboxInput} defaultValue={node.text} sx={{ ml: 1, flex: 1 }} placeholder='Add an item ... ' inputProps={{ "aria-label": "Add item to inbox" }} />
                {/* <IconButton sx={{ p: "10px" }} aria-label='search'>
                        <SearchIcon />
                    </IconButton> */}
                <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />

                <IconButton onClick={handleSave} sx={{ p: "10px" }} aria-label='directions'>
                    <DoneOutlinedIcon />
                </IconButton>
                {/* <IconButton
                    onClick={e => {
                        onListItemMenuClick(e, node);
                    }}
                    sx={{ p: "10px" }}
                    aria-label='directions'>
                    <MoreVertIcon />
                </IconButton> */}

                {/* <IconButton onClick={addEnty} sx={{ p: "10px" }} aria-label='directions'>
                    <AddBoxIcon />
                </IconButton> */}
                {/* <ListItemButton dense sx={{}}>
                                    <ListItemText primary='>Tasks.Next' />
                                </ListItemButton> */}
            </Paper>
            {/* <Box>
                {Object.values(nodes)
                    .filter(node => node.location == "inbox")
                    .map((node, index) => (
                        <Box key={node.id} display='flex' flexDirection='column'>
                            <ListItem>
                                <ListItemIcon>
                                    <StickyNote2OutlinedIcon />
                                </ListItemIcon>{" "}
                                <ListItemText primary={node.text} sx={{ flexGrow: 1 }} />
                                <IconButton
                                    onClick={e => {
                                        onListItemMenuClick(e, node);
                                    }}
                                    sx={{ p: "10px" }}
                                    aria-label='directions'>
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItem>
                        </Box>
                    ))}
            </Box> */}
        </Box>
    );
}
