import Immutable, {Map} from "immutable";

import {COLLECTIONS_CHANGE} from "../actions/collections";
import {FAVORITE_INSERTION_SUCCESS} from "../actions/monitoring-chart";
import {
    SENSOR_CREATION_SUCCESS,
    SENSOR_DELETE_SUCCESS,
    SENSOR_UPDATE_SUCCESS
} from "../actions/sensors";
import {
    ACTIVE_STATUS_UPDATE_SUCCESS,
    CHANGE_USER_PARENT_SUCCESS,
    CLONE_USER_SUCCESS,
    GROUPS_ASSIGNMENT_SUCCESS,
    SENSORS_ASSIGNMENT_SUCCESS,
    USER_DELETE_SUCCESS
} from "../actions/users";


export function collections (state = Map(), {type, payload}) {
    switch (type) {
        case COLLECTIONS_CHANGE:
            return payload;
        case SENSOR_CREATION_SUCCESS: {
            payload._id = payload.id;
            return state.setIn(["sensors", payload.id], Immutable.fromJS(payload));
        }
        case SENSOR_DELETE_SUCCESS:
            return state.deleteIn(["sensors", payload]);
        case SENSOR_UPDATE_SUCCESS:
            return state.mergeIn(["sensors", payload.sensorId], payload.sensorData);
        case FAVORITE_INSERTION_SUCCESS: {
            payload._id = payload.id;
            return state.setIn(["favorite-charts", payload.id], Immutable.fromJS(payload));
        }
        case ACTIVE_STATUS_UPDATE_SUCCESS:
        case CHANGE_USER_PARENT_SUCCESS:
        case CLONE_USER_SUCCESS:
        case GROUPS_ASSIGNMENT_SUCCESS:
        case SENSORS_ASSIGNMENT_SUCCESS:
        case USER_DELETE_SUCCESS: {
            return state.mergeIn(["users", payload._id], payload);
        }
        default:
            return state;
    }
}
