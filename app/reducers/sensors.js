import {SELECT_SENSOR} from "../actions/sensors";
import {getKeyFromCollection} from "lib/collection-utils";

let defaultState = {
    selectedSensors: []
};

function cloneState (state) {
    return {
        selectedSensors: state.selectedSensors.slice()
    };
}

// function findSensor (sensors, id) {
//     return sensors.find(t => {
//         return t.id === id;
//     });
// }

// function sortSensors (state) {
//     return state.sort(function (a, b) {
//         if (a.favorite)
//             return -1;
//         if (b.favorite)
//             return 1;
//         return 0;
//     });
// }

// function sensor (state = null, {type, fields, id}) {
//     switch (type) {
//         case "ADD_SENSOR":
//             return {
//                 id: id,
//                 fields: fields
//             };
//         case "EDIT_SENSOR":
//             if (state.id !== id) {
//                 return state;
//             }
//             return {
//                 fields: fields,
//                 id: id,
//                 favorite: state.favorite,
//                 monitoring: state.monitoring
//             };
//         default:
//             return state;
//     }
// }

export function sensors (state = defaultState, action) {
    var newState;
    // var found;
    switch (action.type) {
        // case "EDIT_SENSOR": {
        //     newState = cloneState(state);
        //     newState.allSensors = state.allSensors.map(t =>
        //         sensor(t, action)
        //     );
        //     return newState;
        // }
        // case "DELETE_SENSOR": {
        //     newState = cloneState(state);
        //     newState.allSensors = state.allSensors.filter(t => {
        //         return t.id !== action.id;
        //     });
        //     return newState;
        // }
        // case "CLONE_SENSOR": {
        //     newState = cloneState(state);
        //     var toClone = findSensor(newState.allSensors, action.id);
        //     var cloned = {
        //         id: action.newId,
        //         fields: {
        //             ...toClone.fields
        //         }
        //     };
        //     cloned.fields.name += " (cloned)";
        //     newState.allSensors.push(cloned);
        //     return newState;
        // }
        // case "FAVORITE_SENSOR": {
        //     newState = cloneState(state);
        //     found = findSensor(newState.allSensors, action.id);
        //     found.favorite = !found.favorite;
        //     newState.allSensors = sortSensors(newState.allSensors);
        //     return newState;
        // }
        // case "MONITOR_SENSOR": {
        //     newState = cloneState(state);
        //     found = findSensor(newState.allSensors, action.id);
        //     found.monitoring = !found.monitoring;
        //     newState.allSensors = sortSensors(newState.allSensors);
        //     return newState;
        // }
        case SELECT_SENSOR: {
            newState = cloneState(state);
            if (newState.selectedSensors.find((it) => {
                return getKeyFromCollection(it) === getKeyFromCollection(action.sensor);
            })) {
                newState.selectedSensors = newState.selectedSensors.filter(it => {
                    return getKeyFromCollection(it) !== getKeyFromCollection(action.sensor);
                });
            } else {
                newState.selectedSensors.push(action.sensor);
            }
            return newState;
        }
        default: {
            newState = cloneState(state);
            // newState.allSensors = sortSensors(newState.allSensors);
            return newState;
        }
    }
}
