import axios from "axios";
import UUID from "uuid-js";

import {WRITE_API_ENDPOINT} from "lib/config";
import {Types} from "lib/dnd-utils";
import {getSensorId, getSensorLabel, operatorToFormula} from "lib/sensors-utils";
import {getBasicObject} from "./utils";

export const ADD_ITEM_TO_FORMULA = "ADD_ITEM_TO_FORMULA";
export const ADD_SENSOR_TO_WORK_AREA = "ADD_SENSOR_TO_WORK_AREA";
export const FILTER_SENSORS = "FILTER_SENSORS";
export const GET_FORMULA_ITEMS = "GET_FORMULA_ITEMS";
export const REMOVE_ITEM_FROM_FORMULA = "REMOVE_ITEM_FROM_FORMULA";
export const REMOVE_SENSOR_FROM_WORK_AREA = "REMOVE_SENSOR_FROM_WORK_AREA";
export const RESET_FORMULA_ITEMS = "RESET_FORMULA_ITEMS";
export const RESET_WORK_AREA_SENSORS = "RESET_WORK_AREA_SENSORS";
export const SELECT_SENSOR = "SELECT_SENSOR";
export const SENSOR_CREATION_SUCCESS = "SENSOR_CREATION_SUCCESS";
export const SENSOR_DELETE_SUCCESS = "SENSOR_DELETE_SUCCESS";
export const SENSOR_UPDATE_SUCCESS = "SENSOR_UPDATE_SUCCESS";

function getSensorObj (collectionItem) {
    return addMonitoringAttrs({
        "name": getSensorLabel(collectionItem),
        "description": collectionItem.get("description"),
        "unitOfMeasurement": collectionItem.get("unitOfMeasurement"),
        "aggregationType": collectionItem.get("aggregationType"),
        "formulas": collectionItem.get("formulas"),
        "primaryTags": collectionItem.get("primaryTags"),
        "tags": collectionItem.get("tags"),
        "siteId": collectionItem.get("siteId"),
        "userId": collectionItem.get("userId"),
        "parentSensorId": collectionItem.get("parentSensorId")
    });
}

function addMonitoringAttrs (sensor) {
    sensor._id = undefined;
    if (sensor.unitOfMeasurement instanceof Object) {
        sensor.unitOfMeasurement = sensor.unitOfMeasurement.value;
    }
    if (sensor.aggregationType instanceof Object) {
        sensor.aggregationType = sensor.aggregationType.value;
    }
    sensor.id = UUID.create().hex;
    sensor.createdByUser = true;
    sensor.virtual = true;
    return sensor;
}

function insertSensor (requestBody, dispatch) {
    var endpoint = "http://" + WRITE_API_ENDPOINT + "/sensors";
    let sensor = addMonitoringAttrs(requestBody);
    axios.post(endpoint, sensor)
        .then(() => dispatch({
            type: SENSOR_CREATION_SUCCESS,
            payload: requestBody
        }))
        .catch(() => dispatch({
            type: "SENSOR_CREATION_FAIL"
        }));
}

function buildFormulas (formulaItems) {
    if (formulaItems && formulaItems.length > 0) {
        let formula = "";
        let variables = new Set();
        formulaItems.forEach((item) => {
            switch (item.type) {
                case Types.SENSOR: {
                    const sensorId = typeof item.sensor === "string" ? item.sensor : getSensorId(item.sensor);
                    formula += sensorId;
                    variables.add(sensorId);
                    break;
                }
                case Types.OPERATOR: {
                    formula += operatorToFormula[item.operator];
                    break;
                }
                case Types.NUMBER: {
                    formula += item.number;
                    break;
                }
            }
        });
        return [{
            formula: formula,
            start: "1970-01-01T00:00:00.000Z",
            end: "3000-01-01T00:00:00.000Z",
            variables: Array.from(variables),
            measurementType: []
        }];
    }
}

export const addItemToFormula = (item) => getBasicObject(ADD_ITEM_TO_FORMULA, item);

export const removeItemFromFormula = (index) => getBasicObject(REMOVE_ITEM_FROM_FORMULA, index);

export const addSensorToWorkArea = (sensor) => getBasicObject(ADD_SENSOR_TO_WORK_AREA, sensor);

export const removeSensorFromWorkArea = (sensorId) => getBasicObject(REMOVE_SENSOR_FROM_WORK_AREA, sensorId);

export const addSensor = (sensor, formulaItems) => {
    sensor.formulas = buildFormulas(formulaItems);
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
            sensor.formulas = buildFormulas([{
                type: Types.SENSOR,
                sensor: el
            }]);
            insertSensor(sensor, dispatch);
        });
    };
};

export const deleteSensors = (sensors) => {
    return dispatch => {
        dispatch({
            type: "DELETING_SENSORS"
        });
        sensors.forEach(sensor => {
            if (sensor.get("createdByUser")) {
                let id = sensor.get("_id");
                var endpoint = "http://" + WRITE_API_ENDPOINT + "/sensors/" + id;
                axios.delete(endpoint)
                    .then(() => dispatch({
                        type: SENSOR_DELETE_SUCCESS,
                        payload: id
                    }))
                    .catch(() => dispatch({
                        type: "SENSOR_DELETE_FAIL"
                    }));
            }
        });
    };
};

function callEditSensor (sensorData, sensorId) {
    return dispatch => {
        dispatch({
            type: "UPDATING_SENSOR"
        });
        var endpoint = "http://" + WRITE_API_ENDPOINT + "/sensors/" + sensorId;
        axios.put(endpoint, sensorData)
            .then(() => dispatch({
                type: SENSOR_UPDATE_SUCCESS,
                payload: {sensorData, sensorId}
            }))
            .catch(() => dispatch({
                type: "SENSOR_UPDATE_FAIL"
            }));
    };
}

export const editSensor = (sensorData, formulaItems, sensor) => {
    if (sensor.get("createdByUser")) {
        let id = sensor.get("_id");
        sensorData.formulas = buildFormulas(formulaItems);
        sensorData.id = id;
        sensorData.createdByUser = true;
        sensorData.virtual = true;
        sensorData.parentSensorId = sensor.get("parentSensorId");
        return callEditSensor(sensorData, id);
    } else {
        sensorData.parentSensorId = getSensorId(sensor);
        sensorData.formulas = buildFormulas([{
            type: Types.SENSOR,
            sensor: sensor
        }]);
        return dispatch => {
            dispatch({
                type: "OVERRIDING_SENSOR"
            });
            insertSensor(sensorData, dispatch);
        };
    }
};

export const favoriteSensor = (id) => getBasicObject("FAVORITE_SENSOR", id);

export const filterSensors = (payload) => getBasicObject(FILTER_SENSORS, payload);

export const getFormulaItems = () => getBasicObject(GET_FORMULA_ITEMS);

export const resetFormulaItems = (resetWorkArea) => getBasicObject(RESET_FORMULA_ITEMS, resetWorkArea);

export const resetWorkAreaSensors = () => getBasicObject(RESET_WORK_AREA_SENSORS);

export const monitorSensor = (id) => getBasicObject("MONITOR_SENSOR", id);

export const selectSensor = (sensor) => getBasicObject(SELECT_SENSOR, sensor);
