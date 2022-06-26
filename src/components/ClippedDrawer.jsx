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

import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
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

import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";

import { useSelector, useDispatch } from "react-redux";
import { replaceNodes } from "../features/nodes/nodesSlice";
import { increment } from "../features/counter/counterSlice";
import { addTagsArray } from "../features/tags/tagsSlice";

import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

//for temporary backup-button
import { store } from "../app/store";
import { debounce } from "debounce";
import { saveSnapshot } from "../app/browser-storage";

const drawerWidth = 240;

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

export default function ClippedDrawer({ children, onColumnsMode }) {
    const [tasksDrawerOpen, setTasksDrawerOpen] = useState(true);

    const location = useLocation();
    const { pathname } = location;

    let tags = useSelector(state => state.tags);
    let places = useSelector(state => state.places);
    const dispatch = useDispatch();

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        console.log("handleDrawerToggle ran, current state: ", mobileOpen);
    };

    useEffect(() => {}, []);

    useEffect(() => {
        console.log("tags changed (useEffect)", tags);
    }, [tags]);

    const handleTasksDrawerClick = () => {
        setTasksDrawerOpen(!tasksDrawerOpen);
    };

    const handleClickSave = () => {
        console.log("handleClickSave runs");
    };

    const drawerContent = (
        <>
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
                <List>
                    <ListItem component={RouterLink} to='/inbox' selected={pathname === "/inbox"} button>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary='Inbox' />
                    </ListItem>
                    <Divider />
                    <ListItem component={RouterLink} to='/notes' selected={pathname === "/notes"} button>
                        <ListItemIcon>
                            <NotesIcon />
                        </ListItemIcon>
                        <ListItemText primary='Notes (beta)' />
                    </ListItem>
                    <Divider />
                    {/* <ListItem component={RouterLink} to='/testB' button>
                            <ListItemIcon>
                                <TaskAltIcon />
                                  <FormatListBulletedIcon /> 
                            </ListItemIcon>
                            <ListItemText primary='Todos' />
                        </ListItem> */}
                    <ListItemButton onClick={handleTasksDrawerClick}>
                        <ListItemIcon>
                            <TaskAltIcon />
                        </ListItemIcon>
                        <ListItemText primary='Todos' />
                        {tasksDrawerOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={tasksDrawerOpen} timeout='auto' unmountOnExit>
                        <List component='div' disablePadding>
                            <ListItemButton component={RouterLink} to='/tasks/today' selected={pathname === "/tasks/today"} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary='Today' />
                            </ListItemButton>
                            <ListItemButton component={RouterLink} to='/tasks/next' selected={pathname === "/tasks/next"} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='Next' />
                            </ListItemButton>
                            <ListItemButton component={RouterLink} to='/tasks/someday' selected={pathname === "/tasks/someday"} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Someday "} />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
                <Divider />
                {/* <List>
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Projects"} />
                    </ListItem>
                </List>
                <Divider /> */}

                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <TagOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Tags"} />
                    </ListItem>
                    {Object.keys(tags.tags).map((text, index) => (
                        <ListItem component={RouterLink} to={"/tag/" + text} selected={"/tag/" + text === location.pathname} button key={"#" + text}>
                            <ListItemText inset primary={"#" + text} />
                        </ListItem>
                    ))}
                    {/* {["#fun", "#code", "#job"].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemText inset primary={text} />
                            </ListItem>
                        ))} */}
                </List>

                <Divider />

                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <AlternateEmailOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Places"} />
                    </ListItem>
                    {/* {["@home", "@office", "@city"].map((text, index) => ( */}
                    {Object.keys(tags.places).map((text, index) => (
                        <ListItem
                            component={RouterLink}
                            to={"/place/" + text}
                            button
                            key={"@" + text}
                            selected={"/place/" + text === location.pathname}>
                            <ListItemText inset primary={"@" + text} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <CssBaseline />
            <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleDrawerToggle}
                        edge='start'
                        // sx={{
                        //     marginRight: 5,
                        //     ...(open && { display: "none" }),
                        // }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
                        A lot todo
                    </Typography>

                    {/* <Button
                        onClick={debounce(() => {
                            saveSnapshot(store.getState());
                        }, 800)}
                        variant='contained'
                        endIcon={<SaveIcon />}>
                        Bak
                    </Button> */}

                    <Button
                        component={RouterLink}
                        to={location.pathname.includes("columnMode") ? "/inbox" : "/columnMode"}
                        onClick={onColumnsMode}
                        variant='contained'
                        endIcon={<ViewColumnOutlinedIcon />}>
                        {location.pathname.includes("columnMode") ? "End Column Mode" : "Column Mode"}
                    </Button>

                    {/* <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder='Search…' inputProps={{ "aria-label": "search" }} />
                    </Search> */}
                </Toolbar>
            </AppBar>
            <Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label='main nav drawer'>
                <Drawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}>
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant='permanent'
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                    open>
                    {drawerContent}
                </Drawer>
            </Box>

            {/* backgroundColor: "orange", */}
            <Box component='main' sx={{ width: "100%", height: "100%", marginTop: "64px" }}>
                {/*sx={{ flexGrow: 1, p: 3 }}*/}
                {children}
            </Box>
        </Box>
    );
}
