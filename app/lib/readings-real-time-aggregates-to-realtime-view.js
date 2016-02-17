import {Map, List} from "immutable";
import {filter, isNil} from "ramda";

export const decorators = [
    Map({
        key: "co2",
        icon: "co2",
        type: "co2",
        unit: "ppm"
    }),
    Map({
        key: "humidity",
        icon: "humidity",
        type: "thl",
        unit: "g/m3"
    }),
    Map({
        key: "illuminance",
        icon: "lightbulb",
        type: "thl",
        unit: "lx"
    }),
    Map({
        key: "temperature",
        icon: "thermometer",
        type: "thl",
        unit: "°C"
    }),
    Map({
        key: "activeEnergy",
        type: "pod",
        unit: "kWh"
    }),
    Map({
        key: "maxPower",
        type: "pod",
        unit: "kW"
    }),
    Map({
        key: "reactiveEnergy",
        type: "pod",
        unit: "kVARh"
    }),
    Map({
        key: "activeEnergy",
        type: "pod-anz",
        unit: "kWh"
    }),
    Map({
        key: "maxPower",
        type: "pod-anz",
        unit: "kW"
    }),
    Map({
        key: "reactiveEnergy",
        type: "pod-anz",
        unit: "kVARh"
    })
];

export function decorateMeasure (sensor) {
    // return an Immutable list for avoid subsequent `.flatten` mismatch
    return List(filter(
        function (value) {
            return !isNil(value);
        },
        decorators.map(decorator => {
            if (decorator.get("type") === sensor.get("type")) {
                return decorator.merge(
                    sensor
                    .set("key", sensor.get("id") + "-" + decorator.get("key"))
                    .set("keyType", decorator.get("key"))
                );
            }
        })
    ));
}

export function addValueToMeasures (sensors, measures) {
    return sensors.map(function (sensor) {
        const PATH = [sensor.get("id"), "measurements", sensor.get("keyType")];
        return sensor.merge({
            value: measures.getIn(PATH) || undefined
        });
    });
}
