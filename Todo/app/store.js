/** @format */

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import nodesReducer from "../features/nodes/nodesSlice";
import tagsReducer from "../features/tags/tagsSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        nodes: nodesReducer,
        tags: tagsReducer,
    },
});
