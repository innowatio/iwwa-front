import axios from "axios";

export const FILTER_SENSORS = "FILTER_SENSORS";
export const SELECT_SENSOR = "SELECT_SENSOR";
export const SENSOR_CREATION_FAIL = "SENSOR_CREATION_FAIL";
export const SENSOR_CREATION_SUCCESS = "SENSOR_CREATION_SUCCESS";
export const SENSOR_SAVING = "SENSOR_SAVING";


let nextSensorId = 0;

function getBasicObject (type, id) {
    return {
        type: type,
        id: id
    };
}

function getSensorObj (collectionItem) {
    //TODO mettere id vero
    return {
        "id": nextSensorId,
        "name": (collectionItem.get("name") ? collectionItem.get("name") : collectionItem.get("_id")),
        "type": "custom-monitoring",
        "description": collectionItem.get("description"),
        "unitOfMeasurement": collectionItem.get("unitOfMeasurement"),
        "virtual": true,
        "formula": collectionItem.get("formula"),
        "tags": collectionItem.get("tags"),
        "siteId": collectionItem.get("siteId"),
        "userId": collectionItem.get("userId")
    };
}

function insertSensor (requestBody) {
    return dispatch => {
        dispatch({
            type: SENSOR_SAVING
        });
        //TODO capire perché non entra
        console.log("endpoint: ");
        var endpoint = WRITE_BACKEND_HOST + "/sensors";
        console.log(endpoint);
        axios.post(endpoint, requestBody)
            .then(() => dispatch({
                type: SENSOR_CREATION_SUCCESS
            }))
            .catch(() => dispatch({
                type: SENSOR_CREATION_FAIL
            }));
    };
}

export const addSensor = (sensor) => {
    insertSensor(sensor);
};

export const editSensor = (sensor, id) => {
    return {
        type: "EDIT_SENSOR",
        id: id,
        fields: {...sensor}
    };
};

export const deleteSensor = (id) => getBasicObject("DELETE_SENSOR", id);

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

export const favoriteSensor = (id) => getBasicObject("FAVORITE_SENSOR", id);

export const filterSensors = (payload) => {
    return {
        type: FILTER_SENSORS,
        payload: payload
    };
};

export const monitorSensor = (id) => getBasicObject("MONITOR_SENSOR", id);

export const selectSensor = (sensor) => {
    return {
        type: SELECT_SENSOR,
        sensor: sensor
    };
};
