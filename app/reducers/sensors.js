import {ADD_ITEM_TO_FORMULA, ADD_SENSOR_TO_WORK_AREA, SELECT_SENSOR} from "../actions/sensors";
import {getKeyFromCollection} from "lib/collection-utils";

let defaultState = {
    current: {
        formulaItems: []
    },
    selectedSensors: [],
    workAreaSensors: []
};

function cloneState (state) {
    return {
        current: {
            formulaItems: state.current.formulaItems.slice()
        },
        selectedSensors: state.selectedSensors.slice(),
        workAreaSensors: state.workAreaSensors.slice()
    };
}

export function sensors (state = defaultState, action) {
    var newState = cloneState(state);
    switch (action.type) {
        case ADD_ITEM_TO_FORMULA: {
            newState.current.formulaItems.push(action.payload);
            break;
        }
        case ADD_SENSOR_TO_WORK_AREA: {
            newState.workAreaSensors.push(action.payload);
            break;
        }
        case SELECT_SENSOR: {
            if (newState.selectedSensors.find((it) => {
                return getKeyFromCollection(it) === getKeyFromCollection(action.sensor);
            })) {
                newState.selectedSensors = newState.selectedSensors.filter(it => {
                    return getKeyFromCollection(it) !== getKeyFromCollection(action.sensor);
                });
            } else {
                newState.selectedSensors.push(action.sensor);
            }
            break;
        }
    }
    return newState;
}
