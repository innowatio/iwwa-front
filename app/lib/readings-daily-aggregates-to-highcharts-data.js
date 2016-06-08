import {evaluateFormula} from "iwwa-formula-resolver";
import {addIndex, map, memoize} from "ramda";
import moment from "moment";

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
        const duration = moment(date.end).diff(date.start, "days");
        var data = [];
        for (var i = 0; i <= duration; i++) {
            const day = moment.utc(date.start).add({days: i});
            if (formula) {
                buildFormulaData(day, chartState, sortedAggregate, data, allSensors);
            } else {
                buildSimpleData(day, chartState, sortedAggregate, data);
            }
        }
        return data;
    }, chartsState);

    return chartData.map((arrayOfData, index) => ({
        data: arrayOfData,
        name: chartsState[index].name,
        unitOfMeasurement: chartsState[index].unitOfMeasurement
    }));
});

function buildSimpleData (day, chartState, sortedAggregate, data) {
    const {sensorId, measurementType, source} = chartState;
    const aggregate = sortedAggregate.get(
        `${sensorId}-${day.format("YYYY-MM-DD")}-${source.key}-${measurementType.key}`
    );
    if (aggregate) {
        const times = aggregate.get("measurementTimes").split(",");
        const values = aggregate.get("measurementValues").split(",");
        const measurement = mapIndexed((value, valueIndex) => {
            return [parseInt(times[valueIndex]), parseFloat(value)];
        }, values);
        data.push(...measurement);
    } else if (day.isBefore(moment.utc())) {
        data.push([day.startOf("day").valueOf(), 0]);
        data.push([day.endOf("day").valueOf(), 0]);
    }
}

function buildFormulaData (day, chartState, sortedAggregate, data, allSensors) {
    const {source, formula} = chartState;
    let sensorsData = [];
    formula.get("variables").forEach(sensorId => {
        let sensor = allSensors.get(sensorId);
        const aggregate = sortedAggregate.get(
            `${sensor.get("_id")}-${day.format("YYYY-MM-DD")}-${source.key}-${sensor.get("measurementType")}`
        );
        if (aggregate) {
            sensorsData.push({
                sensorId: sensorId,
                measurementTimes: aggregate.get("measurementTimes"),
                measurementValues: aggregate.get("measurementValues")
            });
        }
        //TODO what when there's no aggregate?
        // else if (day.isBefore(moment.utc())) {
        //     data.push([day.startOf("day").valueOf(), 0]);
        //     data.push([day.endOf("day").valueOf(), 0]);
        // }

    });
    console.log(formula.get("formula"));
    console.log(sensorsData);
    let result = evaluateFormula({formula: formula.get("formula")}, sensorsData);
    console.log(result);
}
