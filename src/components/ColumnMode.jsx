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

import ListView from "./ListView";

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

export default function ColumnMode({ children, setNodes, onEndEdit, nodes, nodeIdEditing, node, onListItemMenuClick }) {
    return (
        <>
            <Box sx={{ height: "100vh", display: "flex", border: "1px solid black", bgcolor: "background.paper" }}>
                <Box>
                    <ListView isColumnMode parentId='inbox' droppableId='inbox' />
                </Box>
                <Divider orientation='vertical' flexItem />
                <Box>
                    <ListView isColumnMode parentId='today' droppableId='today' />
                </Box>
                <Divider orientation='vertical' flexItem />
                <Box>
                    {/* <InboxView isColumnMode isToday location='tasks.next' droppableId='isToday' /> */}
                    <ListView isColumnMode parentId='next' droppableId='next' />
                    {/* droppableId='location-tasks.nextToday' */}
                </Box>
                <Divider orientation='vertical' flexItem />
                <Box>
                    <ListView isColumnMode parentId='someday' droppableId='someday' />
                </Box>
                <Divider orientation='vertical' flexItem />
                <Box>{/* <InboxView droppableId='location-places.place'  /> */}</Box>
                <Divider orientation='vertical' flexItem />
                <Box>{/* <InboxView droppableId='location-tags.tag'  /> */}</Box>
            </Box>
        </>
    );
}
