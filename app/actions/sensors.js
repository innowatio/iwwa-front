import axios from "axios";
import UUID from "uuid-js";

import {Types} from "lib/dnd-utils";
import {getSensorId} from "lib/sensors-utils";

import {WRITE_API_ENDPOINT} from "lib/config";

export const ADD_ITEM_TO_FORMULA = "ADD_ITEM_TO_FORMULA";
export const ADD_SENSOR_TO_WORK_AREA = "ADD_SENSOR_TO_WORK_AREA";
export const FILTER_SENSORS = "FILTER_SENSORS";
export const GET_FORMULA_ITEMS = "GET_FORMULA_ITEMS";
export const REMOVE_ITEM_FROM_FORMULA = "REMOVE_ITEM_FROM_FORMULA";
export const REMOVE_SENSOR_FROM_WORK_AREA = "REMOVE_SENSOR_FROM_WORK_AREA";
export const RESET_FORMULA_ITEMS = "RESET_FORMULA_ITEMS";
export const SELECT_SENSOR = "SELECT_SENSOR";
export const SENSOR_DELETE_SUCCESS = "SENSOR_DELETE_SUCCESS";

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
    var endpoint = "http://" + WRITE_API_ENDPOINT + "/sensors";
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

export const removeSensorFromWorkArea = (index) => getBasicObject(REMOVE_SENSOR_FROM_WORK_AREA, index);

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
            //TODO iniettare una finta formula altrimenti si perde l'id del sensore vero (farlo anche per l'edit sensore originale)
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
                type: "SENSOR_UPDATE_SUCCESS"
            }))
            .catch(() => dispatch({
                type: "SENSOR_UPDATE_FAIL"
            }));
    };
}

export const editSensor = (sensorData, formulaItems, sensor) => {
    let type = sensor.get("type");
    if (type === MONITORING_TYPE) {
        let id = sensor.get("_id");
        sensorData.formula = buildFormula(formulaItems);
        sensorData.id = id;
        sensorData.type = type;
        sensorData.virtual = true;
        sensorData.parentSensorId = sensor.get("parentSensorId");
        console.log(sensorData);
        return callEditSensor(sensorData, id);
    } else {
        sensorData.parentSensorId = getSensorId(sensor);
        return addSensor(sensorData, formulaItems);
    }
};

export const favoriteSensor = (id) => getBasicObject("FAVORITE_SENSOR", id);

export const filterSensors = (payload) => getBasicObject(FILTER_SENSORS, payload);

export const getFormulaItems = () => getBasicObject(GET_FORMULA_ITEMS);

export const resetFormulaItems = (resetWorkArea) => getBasicObject(RESET_FORMULA_ITEMS, resetWorkArea);

export const monitorSensor = (id) => getBasicObject("MONITOR_SENSOR", id);

export const selectSensor = (sensor) => getBasicObject(SELECT_SENSOR, sensor);
