/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = { tags: {}, places: {} };

export const tagsSlice = createSlice({
    name: "tags",
    initialState,
    reducers: {
        // increment: state => {
        //     // Redux Toolkit allows us to write "mutating" logic in reducers. It
        //     // doesn't actually mutate the state because it uses the Immer library,
        //     // which detects changes to a "draft state" and produces a brand new
        //     // immutable state based off those changes
        //     state.value += 1;
        // },
        // decrement: state => {
        //     state.value -= 1;
        // },
        addTagsArray: (state, action) => {
            console.log("action:", action);
            action.payload.tags.forEach(tag => {
                if (state.tags[tag]) state.tags[tag][action.payload.nodeId] || state.tags[tag].push(action.payload.nodeId);
                else state.tags[tag] = [action.payload.nodeId];
            });
        },

        addPlacesArray: (state, action) => {
            console.log("action:", action);
            action.payload.places.forEach(tag => {
                if (state.places[tag]) state.places[tag][action.payload.nodeId] || state.places[tag].push(action.payload.nodeId);
                else state.places[tag] = [action.payload.nodeId];
            });
        },
    },
});

// Action creators are generated for each case reducer function
export const { addTagsArray, addPlacesArray } = tagsSlice.actions; // increment, decrement,

export default tagsSlice.reducer;
