import axios from "axios";
import UUID from "uuid-js";
import {Types} from "lib/dnd-utils";

export const ADD_ITEM_TO_FORMULA = "ADD_ITEM_TO_FORMULA";
export const ADD_SENSOR_TO_WORK_AREA = "ADD_SENSOR_TO_WORK_AREA";
export const FILTER_SENSORS = "FILTER_SENSORS";
export const GET_FORMULA_ITEMS = "GET_FORMULA_ITEMS";
export const REMOVE_ITEM_FROM_FORMULA = "REMOVE_ITEM_FROM_FORMULA";
export const RESET_FORMULA_ITEMS = "RESET_FORMULA_ITEMS";
export const SELECT_SENSOR = "SELECT_SENSOR";

const MONITORING_TYPE = "custom-monitoring";

function getBasicObject (type, payload) {
    return {
        type: type,
        payload: payload
    };
}

function getSensorObj (collectionItem) {
    return addMonitoringAttrs({
        "name": (collectionItem.get("name") ? collectionItem.get("name") : collectionItem.get("_id")),
        "description": collectionItem.get("description"),
        "unitOfMeasurement": collectionItem.get("unitOfMeasurement"),
        "formula": collectionItem.get("formula"),
        "tags": collectionItem.get("tags"),
        "siteId": collectionItem.get("siteId"),
        "userId": collectionItem.get("userId"), 
        "parentSensorId": collectionItem.get("parentSensorId")
    });
}

function addMonitoringAttrs (sensor) {
    sensor.id = UUID.create().hex;
    sensor.type = MONITORING_TYPE;
    sensor.virtual = true;
    return sensor;
}

function insertSensor (requestBody, dispatch) {
    var endpoint = "http://" + WRITE_API_HOST + "/sensors";
    let sensor = addMonitoringAttrs(requestBody);
    axios.post(endpoint, sensor)
        .then(() => dispatch({
            type: "SENSOR_CREATION_SUCCESS"
        }))
        .catch(() => dispatch({
            type: "SENSOR_CREATION_FAIL"
        }));
}

function buildFormula (formulaItems) {
    //TODO
    let formula = "";
    formulaItems.forEach((item) => {
        switch (item.type) {
            case Types.SENSOR: {
                formula += item.sensor.get("_id");
                break;
            }
            case Types.OPERATOR: {
                formula += item.operator;
                break;
            }
        }
    });
    return formula;
}

export const addItemToFormula = (item) => getBasicObject(ADD_ITEM_TO_FORMULA, item);

export const removeItemFromFormula = (index) => getBasicObject(REMOVE_ITEM_FROM_FORMULA, index);

export const addSensorToWorkArea = (sensor) => getBasicObject(ADD_SENSOR_TO_WORK_AREA, sensor);

export const addSensor = (sensor, formulaItems) => {
    sensor.formula = buildFormula(formulaItems);
    return dispatch => {
        dispatch({
            type: "ADDING_SENSOR"
        });
        insertSensor(sensor, dispatch);
    };
};

export const cloneSensors = (sensors) => {
    return dispatch => {
        dispatch({
            type: "CLONING_SENSORS"
        });
        sensors.forEach((el) => {
            var sensor = getSensorObj(el);
            sensor.name = "Copia di " + sensor.name;
            insertSensor(sensor, dispatch);
        });
    };
};

export const deleteSensors = (sensors) => {
    return dispatch => {
        dispatch({
            type: "DELETING_SENSORS"
        });
        sensors.forEach((sensor) => {
            if (sensor.get("type") === MONITORING_TYPE) {
                var endpoint = "http://" + WRITE_API_HOST + "/sensors/" + sensor.get("_id");
                console.log("endpoint: ");
                console.log(endpoint);
                axios.delete(endpoint)
                    .then(() => dispatch({
                        type: "SENSOR_DELETE_SUCCESS"
                    }))
                    .catch(() => dispatch({
                        type: "SENSOR_DELETE_FAIL"
                    }));
            }
        });
    };
};

export const editSensor = (sensorData, formulaItems, sensor) => {
    let id = sensor.get("_id");
    if (sensor.get("type") === MONITORING_TYPE) {
        sensorData.formula = buildFormula(formulaItems);
        //TODO
        return {
            type: "EDIT_SENSOR",
            id: id,
            fields: {...sensorData}
        };
    } else {
        sensorData.parentSensorId = id;
        return addSensor(sensorData, formulaItems);
    }
};

export const favoriteSensor = (id) => getBasicObject("FAVORITE_SENSOR", id);

export const filterSensors = (payload) => getBasicObject(FILTER_SENSORS, payload);

export const getFormulaItems = () => getBasicObject(GET_FORMULA_ITEMS);

export const resetFormulaItems = (resetWorkArea) => getBasicObject(RESET_FORMULA_ITEMS, resetWorkArea);

export const monitorSensor = (id) => getBasicObject("MONITOR_SENSOR", id);

export const selectSensor = (sensor) => getBasicObject(SELECT_SENSOR, sensor);
