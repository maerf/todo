/** @format */

import { useState, useRef, useEffect } from "react";
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
export default function TaskView({ setNodes, nodes, location }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuContext, setMenuContext] = useState(null);

    useEffect(() => {
        console.log("menuContext changed", menuContext);
    }, [menuContext]);

    const open = Boolean(anchorEl);
    const handleListItemMenuClick = event => {
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

    const handleMenuSendToInbox = () => {
        setNodes(draft => {
            draft[menuContext.id].location = "inbox";
        });
        setAnchorEl(null);
    };

    //note: @teach's: in order to keep the state flat, I manually keep track of parent-child relationships
    function addEnty() {
        console.log("addentry:", inboxInput.current.value);

        const newNode = createNode(0);
        newNode.location = location;
        newNode.text = inboxInput.current.value;
        setNodes(draft => {
            draft[newNode.id] = newNode;
            draft[0].childIds.push(newNode.id);
        });
        console.log("newNode", newNode);

        inboxInput.current.value = "";
    }

    return (
        <Box sx={{ display: "flex" }}>
            {/* <CssBaseline /> */}
            {/* <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
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
            {/* sx={{ flexGrow: 1, p: 3 }} */}
            <Box sx={{ backgroundColor: "red" }}>
                <Paper onKeyDown={handleKeyDown} sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 500 }}>
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
                <Box>
                    {Object.values(nodes)
                        .filter(node => node.location === location)
                        .map((node, index) => (
                            <Box key={node.id} display='flex' flexDirection='column'>
                                <ListItem>
                                    <ListItemIcon>
                                        <StickyNote2OutlinedIcon />
                                    </ListItemIcon>
                                    {/*{index % 2 === 0 ?   <NotesOutlinedIcon /> : <MailIcon />} */}
                                    <ListItemText primary={node.text} sx={{ flexGrow: 1 }} />
                                    <IconButton
                                        onClick={e => {
                                            handleListItemMenuClick(e);
                                            setMenuContext(node);
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
                        ))}
                </Box>
            </Box>
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}>
                <MenuItem onClick={handleMenuSendToInbox}>Move to Inbox</MenuItem>
                <MenuItem onClick={handleMenuSendToTasks}>Move to Tasks</MenuItem>
                <MenuItem onClick={handleClose}>delete</MenuItem>
            </Menu>
        </Box>
    );
}
