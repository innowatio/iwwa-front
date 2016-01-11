import {memoize, map, range, unnest, isEmpty, reduce, path, last, isNil, maxBy} from "ramda";

/*
    objFromDB: {
        _id: sensorId-day,
        sensorId: innowatio sensor string,
        day: "YYYY-MM-DD",
        measurements: {
            "activeEnergy": JSON string of array,
            "reactiveEnergy": JSON string of array,
            "maxPower": JSON string of array
        }
    }
*/
var convertByVariables = memoize(function (measure, variables, startOfTime) {
    var mLength;
    const fiveMinutesInMS = measure.get("measurementsDeltaInMs");
    const startOfDayInMS = startOfTime ?
        startOfTime:
        new Date(measure.get("day")).getTime();
    const measuresArray = map(variable => {
        const m = measure.getIn(["measurements", variable]) ?
            measure
                .getIn(["measurements", variable])
                .split(",")
                .map(n => parseFloat(n)) :
            [0.01];
        mLength = m.length;
        var lastNotNull = 0.01;
        return range(0, mLength).map(idx => {
            if (!isNaN(m[idx])) {
                lastNotNull = m[idx] || 0.01;
                return m[idx] || 0.01;
            } else {
                return lastNotNull;
            }
        });
    }, variables);
    const toDateTime = (index) => (
        startOfDayInMS + (index * fiveMinutesInMS)
    );
    const isInRange = (val1, val2) => (
        val1 * 1.10 > val2 &&
        val1 * 0.90 < val2
    );
    const getValue = (idx, ...vals) => {
        return [
            new Date(toDateTime(idx)),
            ...vals.map(val => [val])
        ];
    };
    const needsToAdd = (val, prevVal, idx) => {
        return val && (
            // Add the first
            idx === 0 ||
            // Add the last
            idx === mLength - 1 ||
            // Add out of range values
            !isInRange(prevVal, val) ||
            // Add every even hour
            idx % 24 === 12
        );
    };
    return reduce((acc, num) => {
        const needsTo = measuresArray.reduce((need, m, midx) => {
            return need || needsToAdd(
                m[num],
                path([midx + 1, 0], last(acc)),
                num
            );
        }, false);
        return needsTo ? (
            acc.concat([getValue(
                num,
                ...measuresArray.map(m => m[num])
            )])
        ) : acc;
    }, [], range(0, mLength));
});

export function convertBySensorsAndVariable (measures, sensors, variables, dateFilter) {
    var measuresBySensor = sensors.map((sensorId, index) => {
        return unnest(measures
            .filter(measure => measure.get("sensorId") === sensorId)
            .filter(measure => {
                if (isEmpty(dateFilter)) {
                    return true;
                }
                const dateMeasure = moment(measure.get("day"), "YYYY-MM-DD").valueOf();
                return (
                    dateFilter.start <= dateMeasure &&
                    dateFilter.end > dateMeasure
                );
            })
            .sortBy(measure => measure.get("day"))
            .map(measure => convertByVariables(measure, [variables[index]]))
            .toArray()
        );
    });
    if (measuresBySensor.length === 1) {
        return measuresBySensor[0];
    }
    return mergeCoordinates(measuresBySensor[0] || [], measuresBySensor[1] || []);
}

export function convertByDatesAndVariable (measures, sensorId, variable, dates) {
    const period = dates.period;
    var measuresBySensor = dates.map((date, index) => {
        return unnest(measures
            .filter(measure => measure.get("sensorId") === sensorId[0])
            .filter(measure => {
                const dateMeasure = moment(measure.get("day"), "YYYY-MM-DD").valueOf();
                return (new Date(date.start).getTime() <= dateMeasure && new Date(date.end).getTime() > dateMeasure);
            })
            .sortBy(measure => measure.get("day"))
            .map(measure => {
                const dayStart = moment(measure.get("day")).valueOf() - moment(date.start).valueOf();
                return convertByVariables(measure, [variable], dayStart);
            })
            .toArray());
    });
    return mergeCoordinates(measuresBySensor[0] || [], measuresBySensor[1] || []);
}

function mergeCoordinates (coordinate1, coordinate2) {
    /*
        f(a,b) => c

        a = [[[date1, [n01, dev01]], [date02, [n02, dev02]], ... ]
        b = [[[date1, [n11, dev11]], [date12, [n12, dev12]], ... ]
        c = [[[date1, [n01, dev01], [n11, dev11]], [date02, [n02, dev02], [n12, dev12]], ...]
    */
    var maxCriteria = function (a) {
        return !isNil(a) ? a.length : null;
    };
    var maxCoordinate = maxBy(maxCriteria, coordinate1, coordinate2);
    var minCoordinate = maxCoordinate === coordinate1 ? coordinate2 : coordinate1;

    return maxCoordinate.map(function (value, index) {
        var toConcat = [NaN];
        if (minCoordinate.length > index) {
            toConcat = minCoordinate[index][1];
        }
        if (coordinate1 === maxCoordinate) {
            return value.concat([toConcat]);
        } else {
            return [value[0], toConcat].concat([value[1]]);
        }
    });
}
