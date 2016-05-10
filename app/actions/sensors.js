import axios from "axios";
import UUID from "uuid-js";
import {Types} from "lib/dnd-utils";

export const ADD_ITEM_TO_FORMULA = "ADD_ITEM_TO_FORMULA";
export const ADD_SENSOR_TO_WORK_AREA = "ADD_SENSOR_TO_WORK_AREA";
export const FILTER_SENSORS = "FILTER_SENSORS";
export const GET_FORMULA_ITEMS = "GET_FORMULA_ITEMS";
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
    return {
        "id": UUID.create(),
        "name": (collectionItem.get("name") ? collectionItem.get("name") : collectionItem.get("_id")),
        "type": MONITORING_TYPE,
        "description": collectionItem.get("description"),
        "unitOfMeasurement": collectionItem.get("unitOfMeasurement"),
        "virtual": true,
        "formula": collectionItem.get("formula"),
        "tags": collectionItem.get("tags"),
        "siteId": collectionItem.get("siteId"),
        "userId": collectionItem.get("userId"), 
        "parentSensorId": collectionItem.get("parentSensorId")
    };
}

function insertSensor (requestBody) {
    return dispatch => {
        dispatch({
            type: "SENSOR_SAVING"
        });
        //TODO capire perché non entra
        console.log("endpoint: ");
        var endpoint = WRITE_API_HOST + "/sensors";
        console.log(endpoint);
        axios.post(endpoint, requestBody)
            .then(() => dispatch({
                type: "SENSOR_CREATION_SUCCESS"
            }))
            .catch(() => dispatch({
                type: "SENSOR_CREATION_FAIL"
            }));
    };
}

function deleteSensor (sensorId) {
    return dispatch => {
        dispatch({
            type: "SENSOR_DELETING"
        });
        //TODO verificare che entri
        var endpoint = WRITE_API_HOST + "/sensors/$" + sensorId;
        console.log("endpoint: ");
        console.log(endpoint);
        axios.delete(endpoint)
            .then(() => dispatch({
                type: "SENSOR_DELETE_SUCCESS"
            }))
            .catch(() => dispatch({
                type: "SENSOR_DELETE_FAIL"
            }));
    };
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

export const addSensorToWorkArea = (sensor) => getBasicObject(ADD_SENSOR_TO_WORK_AREA, sensor);

export const addSensor = (sensor, formulaItems) => {
    sensor.formula = buildFormula(formulaItems);
    insertSensor(sensor);
};

export const cloneSensors = (sensors) => {
    sensors.forEach((el) => {
        var sensor = getSensorObj(el);
        sensor.name = "Copia di " + sensor.name;
        insertSensor(sensor);
    });
    return {
        type: "CLONING_SENSORS"
    };
};

export const deleteSensors = (sensors) => {
    sensors.forEach((sensor) => {
        if (sensor.get("type") === MONITORING_TYPE) {
            deleteSensor(sensor.get("_id"));
        }
    });
    return {
        type: "DELETING_SENSORS"
    };
};

export const editSensor = (sensor, formulaItems, id) => {
    if (sensor.get("type") === MONITORING_TYPE) {
        sensor.formula = buildFormula(formulaItems);
        return {
            type: "EDIT_SENSOR",
            id: id,
            fields: {...sensor}
        };
    } else {
        sensor.parentSensorId = id;
        addSensor(sensor, formulaItems);
    }
};

export const favoriteSensor = (id) => getBasicObject("FAVORITE_SENSOR", id);

export const filterSensors = (payload) => getBasicObject(FILTER_SENSORS, payload);

export const getFormulaItems = () => getBasicObject(GET_FORMULA_ITEMS);

export const resetFormulaItems = (resetWorkArea) => getBasicObject(RESET_FORMULA_ITEMS, resetWorkArea);

export const monitorSensor = (id) => getBasicObject("MONITOR_SENSOR", id);

export const selectSensor = (sensor) => getBasicObject(SELECT_SENSOR, sensor);
