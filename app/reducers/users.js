import {
    ADD_ROLE,
    REMOVE_ROLE,
    RESET_ROLES_GROUPS,
    SELECT_USER,
    SELECT_USER_TO_CLONE,
    TOGGLE_CLONE,
    TOGGLE_GROUP
} from "../actions/users";

import {addOrRemove} from "./utils";

const defaultState = {
    cloneMode: false,
    selectedGroups: [],
    selectedRoles: [],
    selectedUsers: [],
    selectedUsersToClone: []
};

function cloneState (state) {
    return {
        cloneMode: state.cloneMode,
        selectedGroups: state.selectedGroups.slice(),
        selectedRoles: state.selectedRoles.slice(),
        selectedUsers: state.selectedUsers.slice(),
        selectedUsersToClone: state.selectedUsersToClone.slice()
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
            onSelectUser(action.payload, newState, "selectedUsers");
            break;
        }
        case SELECT_USER_TO_CLONE: {
            onSelectUser(action.payload, newState, "selectedUsersToClone");
            break;
        }
        case TOGGLE_CLONE: {
            newState.cloneMode = !newState.cloneMode;
            newState.selectedUsersToClone = [];
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

function onSelectUser (user, state, field) {
    state[field] = addOrRemove(user, state[field], it => {
        return it.get("_id") === user.get("_id");
    });
}