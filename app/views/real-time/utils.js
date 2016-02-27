import {List, Map} from "immutable";
import {filter, isNil} from "ramda";

import {allSensorsDecorator} from "lib/sensors-decorators";

export function decorateMeasure (sensor, theme) {
    // return an Immutable list for avoid subsequent `.flatten` mismatch
    return List(filter(
        function (value) {
            return !isNil(value);
        },
        allSensorsDecorator(theme).map(decoratorObject => {
            const decorator = Map(decoratorObject);
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
