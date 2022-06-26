/** @format */

const KEY = "redux";
export function loadState() {
    try {
        const serializedState = localStorage.getItem(KEY);
        if (!serializedState) return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
}

export async function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(KEY, serializedState);
    } catch (e) {
        // Ignore
    }
}

export async function saveSnapshot(state) {
    console.log("saveSnapshot runs: ");
    try {
        const serializedState = JSON.stringify(state);
        console.log("saveSnapshot state: ", serializedState);
        localStorage.setItem(KEY + new Date().toJSON(), serializedState);
    } catch (e) {
        console.log("saveSnapshot error: ", e);
    }
}
