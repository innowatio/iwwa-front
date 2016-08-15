import {
    SELECT_USER
} from "../actions/users";

import {addOrRemove} from "./utils";

const defaultState = {
    selectedUsers: []
};

function cloneState (state) {
    return {
        selectedUsers: state.selectedUsers.slice()
    };
}

export function users (state = defaultState, action) {
    var newState = cloneState(state);
    switch (action.type) {
        case SELECT_USER: {
            let user = action.payload;
            newState.selectedUsers = addOrRemove(user, newState.selectedUsers, it => {
                return it.get("_id") === user.get("_id");
            });
            break;
        }
    }
    return newState;
}