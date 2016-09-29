import {
    ADD_ROLE,
    REMOVE_ROLE,
    RESET_ROLES_GROUPS,
    SELECT_USER,
    TOGGLE_GROUP
} from "../actions/users";

import {addOrRemove} from "./utils";

const defaultState = {
    selectedUsers: [],
    selectedGroups: [],
    selectedRoles: []
};

function cloneState (state) {
    return {
        selectedUsers: state.selectedUsers.slice(),
        selectedGroups: state.selectedGroups.slice(),
        selectedRoles: state.selectedRoles.slice()
    };
}

export function users (state = defaultState, action) {
    var newState = cloneState(state);
    switch (action.type) {
        case ADD_ROLE: {
            newState.selectedRoles.push(action.payload);
            break;
        }
        case REMOVE_ROLE: {
            newState.selectedRoles.splice(newState.selectedRoles.indexOf(action.payload), 1);
            break;
        }
        case RESET_ROLES_GROUPS: {
            newState.selectedGroups = [];
            newState.selectedRoles = [];
            break;
        }
        case SELECT_USER: {
            const user = action.payload;
            newState.selectedUsers = addOrRemove(user, newState.selectedUsers, it => {
                return it.get("_id") === user.get("_id");
            });
            break;
        }
        case TOGGLE_GROUP: {
            const group = action.payload;
            newState.selectedGroups = addOrRemove(group, newState.selectedGroups, it => {
                return it === group;
            });
            break;
        }
    }
    return newState;
}