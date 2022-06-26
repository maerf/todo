/** @format */

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
//Drag+Drop
import { DragDropContext } from "react-beautiful-dnd";
//toolkit-nodes
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import CheckboxList from "./components/CheckboxList.jsx";
import ClippedDrawer from "./components/ClippedDrawer";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import ColumnMode from "./components/ColumnMode";
import { ControllableStates } from "./components/ControllableStates";
import ListView from "./components/ListView";
import NodeList3 from "./components/NodeList3";
import NodesTesting from "./components/NodesTesting";

import * as redux from "./features/nodes/nodesSlice";
// import { SpecialNodes } from "./features/nodes/nodesSlice";

import * as helpers from "./helpers";

export default function App() {
    const dispatch = useDispatch();

    const nodes = useSelector(state => state.nodes);

    const handleOnDragEnd = dropResult => {
        // const { destination, source, draggableId } = dropResult;
        console.log("onDragEnd result", dropResult);
        dispatch(redux.processDragDrop(dropResult));
    };

    return (
        <Box>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <ClippedDrawer>
                    <Routes>
                        <Route path='/inbox' element={<ListView parentId='inbox' droppableId='inbox' />} />
                        <Route path='/notes' element={<NodeList3 />} />
                        <Route path='/tasks/today' element={<ListView parentId='today' droppableId='today' />} />
                        <Route path='/tasks/next' element={<ListView parentId='next' droppableId='next' />} />
                        <Route path='/tasks/someday' element={<ListView parentId='someday' droppableId='someday' />} />
                        <Route path='/tag/:tag' element={<ListView droppableId='location-tags.tag' />} />
                        <Route path='/place/:place' element={<ListView droppableId='location-places.place' />} />
                        <Route path='/checkbox' element={<CheckboxList />} />
                        <Route path='/test2' element={<ControllableStates />} />
                        <Route path='/ndtest' element={<NodesTesting />} />
                        <Route path='/columnMode' element={<ColumnMode />} />
                        <Route path='*' element={<Navigate to='/tasks/today' replace />} />
                    </Routes>
                </ClippedDrawer>
            </DragDropContext>
        </Box>
    );
}
