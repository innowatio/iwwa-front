import {isEmpty, reduce, range, keys} from "ramda";
import moment from "moment";

import {Map} from "immutable";

function filterByDate (measure, dateFilter) {
    if (isEmpty(dateFilter)) {
        return true;
    }
    const dateMeasure = moment(measure.get("day"), "YYYY-MM-DD").valueOf();
    return (dateFilter.start <= dateMeasure && dateFilter.end > dateMeasure);
}
function arrayToReturn (measureObject, sensors, variables) {
    const date = keys(measureObject);
    return reduce((acc, singleData) => {
        const arrayFirstData = [
            new Date(parseInt(singleData)),
            [measureObject[singleData][`${sensors[0]}-${variables[0]}`] || 0.01]
        ];
        const finalArray = variables[1] ? arrayFirstData.concat([[measureObject[singleData][`${sensors[1]}-${variables[1]}`] || 0.01]]) : arrayFirstData;
        return acc.concat([finalArray]);
    }, [], date.sort());
}
function measuresDateObject (measures, sensorVariables) {
    return measures.reduce((accMeasure, measure) => {
        const sensorId = measure.get("sensorId");
        const deltaInMS = measure.get("measurementsDeltaInMs");
        const startOfDayInMS = moment(measure.get("day"), "YYYY-MM-DD").valueOf();
        const m = measure.getIn(["measurements", sensorVariables[sensorId]]) ?
            measure
                .getIn(["measurements", sensorVariables[sensorId]])
                .split(",")
                .map(n => parseFloat(n)) :
            [0.01];
        var mLength = m.length;
        return {
            ...accMeasure,
            ...reduce((acc, idx) => {
                const data = startOfDayInMS + (idx * deltaInMS);
                const type = sensorVariables[sensorId];
                if (!isNaN(m[idx])) {
                    return {
                        ...acc,
                        [data]: {
                            ...accMeasure[data],
                            [`${sensorId}-${type}`]: m[idx] || 0.01
                        }
                    };
                }
                return acc;
            }, {}, range(0, mLength))
        };
    }, {});
}
function filterAndMergeMeasures (measures, sensors, variables, dateFilter) {
    return sensors.reduce((acc, sensor, index) => {
        return {
            ...acc,
            mergedMeasures: acc.mergedMeasures.merge(
                measures
                    .filter(measure => measure.get("sensorId") === sensor)
                    // .filter(measure => measure.get("source") === source)
                    .filter(measure => filterByDate(measure, dateFilter))
            ),
            sensorVariables: {
                ...acc.sensorVariables,
                [sensor]: variables[index]
            }
        };
    }, {mergedMeasures: Map(), sensorVariables: []});
}
export function convertBySensorsAndVariable (measures, sensors, variables, dateFilter) {
    const measuresMerged = filterAndMergeMeasures(measures, sensors, variables, dateFilter);
    console.log("START M");
    const measuresDateAggregate = measuresDateObject(measuresMerged.mergedMeasures, measuresMerged.sensorVariables);
    console.log("END M");
    console.log(measuresDateAggregate);
    console.log("START F");
    const returnArray = arrayToReturn(measuresDateAggregate, sensors, variables);
    console.log("END F");
    console.log(returnArray);
    return returnArray;

}
