let nextSensorId = 0;

function getBasicObject (type, id) {
    return {
        type: type,
        id: id
    };
}

export const addSensor = (sensor) => {
    return {
        type: "ADD_SENSOR",
        id: nextSensorId++,
        fields: {...sensor}
    };
};

export const editSensor = (sensor, id) => {
    return {
        type: "EDIT_SENSOR",
        id: id,
        fields: {...sensor}
    };
};

export const deleteSensor = (id) => getBasicObject("DELETE_SENSOR", id);

export const cloneSensor = (id) => {
    return {
        type: "CLONE_SENSOR",
        id: id,
        newId: nextSensorId++
    };
};

export const favoriteSensor = (id) => getBasicObject("FAVORITE_SENSOR", id);

export const monitorSensor = (id) => getBasicObject("MONITOR_SENSOR", id);

export const selectSensor = (sensor) => getBasicObject("SELECT_SENSOR", sensor.get("_id"));

export const combineSensor = () => {
    return {
        type: "COMBINE_SENSOR",
        newId: nextSensorId++
    };
};