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

//When Task-Item
import Checkbox from "@mui/material/Checkbox";

import { Draggable } from "react-beautiful-dnd";
import { createNode, createTodoNode, GetTagsAndStripFromString } from "../helpers";

//I know it's not a good idea to have several components directly change the state
//but data structure might change with amount of implemented features in this short project
export default function NodeListItem({ index, onTodoToggle, setNodes, onEndEdit, nodes, nodeIdEditing, node, onSetMenuContext, onMenuIconClick }) {
    const [menuContext, setMenuContext] = useState(null);
    const [nodeForEditing, setNodeForEditing] = useState(null);

    const inboxInput = useRef();

    function handleMakeSubtask() {
        console.log("make subtask clicked");
    }

    return (
        <Draggable draggableId={node.id} index={index}>
            {provided => (
                <Box key={node.id} display='flex' flexDirection='column' {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <ListItem>
                        {node.isTodo && (
                            <ListItemIcon>
                                <Checkbox edge='start' onClick={e => onTodoToggle(e, node, node.id)} checked={node.isDone} tabIndex={-1} disableRipple />
                            </ListItemIcon>
                        )}

                        {!node.isTodo && (
                            <ListItemIcon>
                                <StickyNote2OutlinedIcon />
                            </ListItemIcon>
                        )}
                        {/*{index % 2 === 0 ?   <NotesOutlinedIcon /> : <MailIcon />} */}
                        <ListItemText primary={node.text} sx={{ flexGrow: 1 }} />
                        <IconButton
                            onClick={e => {
                                handleMakeSubtask(e);
                            }}
                            sx={{ p: "10px" }}
                            aria-label='directions'>
                            <MailIcon />
                        </IconButton>
                        <IconButton
                            onClick={e => {
                                onMenuIconClick(e);
                                onSetMenuContext(node);
                            }}
                            sx={{ p: "10px" }}
                            aria-label='directions'>
                            <MoreVertIcon />
                        </IconButton>
                    </ListItem>

                    {/* <ListItemButton dense sx={{}}>
                                    <ListItemText primary='>Tasks.Next' />
                                </ListItemButton> */}
                </Box>
            )}
        </Draggable>
    );
}
