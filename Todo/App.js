/** @format */

import logo from "./logo.svg";
import "./App.css";

import { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import Link from "@mui/material/Link";
import ProTip from "./components/ProTip";
import CheckboxList from "./components/CheckboxList.jsx";
import { ControllableStates } from "./components/ControllableStates";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import ClippedDrawer from "./components/ClippedDrawer";

import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import NodeList from "./components/NodeList";
import NodeList2 from "./components/NodeList2";
import NodesTesting from "./components/NodesTesting";
import NodeListOli from "./components/NodeListOli";
import NodeListOli2 from "./components/NodeListOli2";
import InboxView from "./components/InboxView";
import TasksView from "./components/TaskView";

import NodeList3 from "./components/NodeList3";

import { useImmer } from "use-immer";
import { v4 as uuid } from "uuid";

//Drag+Drop
import { DragDropContext, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />;

export default function App() {
    // localStorage.setItem("user", JSON.stringify({ somearray: [{ iam: "cat" }, { iam: "dog" }] }));
    // const stringifiedPerson = localStorage.getItem("user");
    // const personAsObjectAgain = JSON.parse(stringifiedPerson);
    // console.log("personAsObjectAgain", personAsObjectAgain);

    const [nodes, setNodes] = useImmer([]);
    const [tags, setTags] = useImmer([]);

    useEffect(() => {
        const nodes = {
            0: { id: "0", parentId: "root", isRoot: true, text: "I'm the root, parent of 1", childIds: ["1"], tasksIds: [] },
            1: { id: "1", parentId: "0", isRoot: false, text: "Parent of 2, Child of 0", childIds: ["2"], tasksIds: [] },
            2: { id: "2", parentId: "1", isRoot: false, text: "I'm a child of 1, Parent of 3", childIds: [3], tasksIds: [] },
            3: { id: "3", parentId: "2", isRoot: false, isTodo: true, text: "I'm child of 2 and a Todo", childIds: [], tasksIds: [] },
        };

        const tags = {
            fun: { id: "fun", nodeIds: ["1"], tasksIds: [] },
            code: { id: "code", nodeIds: ["2"], tasksIds: [] },
            work: { id: "work", nodeIds: [], tasksIds: [] },
        };

        setNodes(nodes);
        setTags(tags);
        console.log("useEffect[], logging nodes:", nodes);
    }, []);

    const onDragEnd = result => {
        const { destination, source, draggableId } = result;
        console.log("onDragEnd result", result);
        // TODO: reorder our column
    };

    return (
        <Box>
            {/* container war, made content of inboxview centered (list items etc), weird.
            Container maxWidth='sm' war */}
            {/* <Box sx={{ my: 4 }}> */}
            {/* <Typography variant='h4' component='h1' gutterBottom> */}
            {/* <ResponsiveDrawer /> */}
            {/* */}

            <DragDropContext onDragEnd={onDragEnd}>
                <ClippedDrawer nodes={nodes} setNodes={setNodes}>
                    <Routes>
                        {/* <Route path='/' element={<NodeList />} /> */}
                        {/* <Route path='/layout' element={<ClippedDrawer />} /> */}
                        <Route path='/inbox' element={<InboxView droppableId='location.inbox' nodes={nodes} setNodes={setNodes} />} />
                        <Route path='/tasks/next' element={<TasksView location='tasks.next' nodes={nodes} setNodes={setNodes} />} />
                        <Route path='/' element={" "} />
                        <Route path='/checkbox' element={<CheckboxList />} />
                        <Route path='/test1' element={<ProTip />} /> {/* render={() => <div> Page inbox</div>} */}
                        <Route path='/test2' element={<ControllableStates />} />
                        <Route path='/NodeList2' element={<NodeList2 />} />
                        <Route path='/ndtest' element={<NodesTesting />} />
                        <Route path='/nodeListOli' element={<NodeListOli />} />
                        <Route path='/nodeListOli2' element={<NodeListOli2 />} />
                        <Route path='/notes' element={<NodeList3 nodes={nodes} setNodes={setNodes} />} />
                    </Routes>
                </ClippedDrawer>
            </DragDropContext>

            {/* <Link to='/testB'>home</Link> <Link to='/'>home</Link> <Link to='/test1'>test1</Link> <Link to='/test2'>test2</Link>
                    <Link to='/NodeList2'>NodeList2</Link> <Link to='/ndtest'>ndTest</Link> <Link to='/nodeListOli'>nodeListOli</Link>
                    <Link to='/nodeListOli2'>nodeListOli2</Link>*/}

            {/* <Copyright /> */}
            {/* </Typography> */}
            {/* </Box> */}
        </Box>
    );
}

function Copyright() {
    return (
        <Typography variant='body2' color='text.secondary' align='center'>
            {"Copyright © "}

            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}
