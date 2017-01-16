import Immutable from "immutable";
import {evaluateFormula} from "iwwa-formula-resolver";
import {addIndex, filter, map, memoize} from "ramda";
import moment from "lib/moment";

const mapIndexed = addIndex(map);

export default memoize(function readingsDailyAggregatesToHighchartsData (aggregates, chartsState, allSensors) {

    if (aggregates.isEmpty()) {
        return [{
            data: []
        }];
    }

    const sortedAggregate = aggregates.sortBy(x => x.get("day"));
    const chartData = map(chartState => {
        const {date, formula} = chartState;
        const elapsedStart = moment(date.start).subtract(1, "days");
        const elapsedEnd = moment(date.end).add(1, "days");
        const duration = elapsedEnd.diff(elapsedStart, "days");
        var data = [];
        for (var i = 0; i <= duration; i++) {
            if (formula) {
                buildFormulaData(elapsedStart, chartState, sortedAggregate, data, allSensors);
            } else {
                buildSimpleData(elapsedStart, chartState, sortedAggregate, data);
            }
            elapsedStart.add({days: 1});
        }
        return data;
    }, chartsState);

    return chartData.map((arrayOfData, index) => ({
        data: arrayOfData,
        name: chartsState[index].name,
        unitOfMeasurement: chartsState[index].unitOfMeasurement,
        aggregationType: chartsState[index].aggregationType
    }));
});

function buildSimpleData (day, chartState, sortedAggregate, data) {
    const {sensorId, measurementType, source} = chartState;
    const aggregate = sortedAggregate.get(
        `${sensorId}-${day.format("YYYY-MM-DD")}-${source.key}-${measurementType.key}`
    );
    populateData(data, day, aggregate, () => {
        return getMeasurement(aggregate, chartState.date);
    });
}

function buildFormulaData (day, chartState, sortedAggregate, data, allSensors) {
    const {source, formula} = chartState;
    let sensorsData = [];
    let hasSomeAggregates = false;
    formula.get("variables").forEach(sensorId => {
        let sensor = allSensors.get(sensorId);
        const aggregate = sortedAggregate.get(
            `${sensor.get("_id")}-${day.format("YYYY-MM-DD")}-${source.key}-${sensor.get("measurementType")}`
        );
        sensorsData.push({
            sensorId: sensorId,
            measurementTimes: aggregate ? aggregate.get("measurementTimes") : "",
            measurementValues: aggregate ? aggregate.get("measurementValues"): ""
        });
        hasSomeAggregates = hasSomeAggregates || aggregate;
    });
    populateData(data, day, hasSomeAggregates, () => {
        let result = evaluateFormula({formula: formula.get("formula")}, sensorsData);
        return getMeasurement(Immutable.fromJS(result), chartState.date);
    });
}

function populateData (data, day, condition, populateFunc) {
    if (condition) {
        data.push(...populateFunc());
    } else if (day.isBefore(moment())) {
        data.push([day.startOf("day").valueOf(), 0]);
        data.push([day.endOf("day").valueOf(), 0]);
    }
}

function getMeasurement (aggregate, date) {
    const times = aggregate.get("measurementTimes").split(",");
    const values = aggregate.get("measurementValues").split(",");
    return filter(el => el, mapIndexed((value, valueIndex) => {
        const time = parseInt(times[valueIndex]);
        if (time >= date.start && time <= date.end) {
            return [time, parseFloat(value)];
        }
    }, values));
}
