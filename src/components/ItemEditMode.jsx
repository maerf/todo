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

//reduxify nodes
import { useSelector, useDispatch } from "react-redux";
import * as redux from "../features/nodes/nodesSlice";
import * as helper from "../helpers";

export default function ItemEditMode({ onEndEdit, nodeIdEditing, node, onListItemMenuClick }) {
    const [menuContext, setMenuContext] = useState(null);
    const [nodeForEditing, setNodeForEditing] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("menuContext changed", menuContext);
    }, [menuContext]);

    const inboxInput = useRef();

    const handleKeyDown = e => {
        if (e.keyCode == 13) {
            e.preventDefault();
            UpdateEnty();
        }
    };

    function handleSave() {
        UpdateEnty();
    }

    function UpdateEnty() {
        let str = inboxInput.current.value;
        console.log("UpdateEnty before fail id:" + node.id + " string: " + str);
        let success = helper.processUpdateAndDispatch(node.id, str, dispatch);

        if (success) inboxInput.current.value = "";
        onEndEdit();
    }

    const handleTextChange = e => {
        console.log("current text", e.target.value);
        let str = e.target.value;
        let match = null;
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Paper onKeyDown={handleKeyDown} sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
                <InputBase
                    onChange={handleTextChange}
                    inputRef={inboxInput}
                    defaultValue={node.text}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder='Add an item ... '
                    inputProps={{ "aria-label": "Add item to inbox" }}
                />

                <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />

                <IconButton onClick={handleSave} sx={{ p: "10px" }} aria-label='directions'>
                    <DoneOutlinedIcon />
                </IconButton>
            </Paper>
        </Box>
    );
}
