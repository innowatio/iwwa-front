import Immutable, {Map} from "immutable";

import {COLLECTIONS_CHANGE} from "../actions/collections";
import {
    SENSOR_CREATION_SUCCESS,
    SENSOR_DELETE_SUCCESS,
    SENSOR_UPDATE_SUCCESS
} from "../actions/sensors";


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
        default:
            return state;
    }
}
