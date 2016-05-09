import {addIndex, map, memoize} from "ramda";
import moment from "moment";

const mapIndexed = addIndex(map);

export default memoize(function readingsDailyAggregatesToHighchartsData (aggregates, chartsState) {
    
    if (aggregates.isEmpty()) {
        return [{
            data: []
        }];
    }

    const sortedAggregate = aggregates.sortBy(x => x.get("day"));
    const chartData = map(chartState => {
        const {sensorId, date, measurementType, source} = chartState;
        const duration = moment(date.end).diff(date.start, "days");
        var data = [];
        for (var i = 0; i <= duration; i++) {
            const day = moment.utc(date.start).add({days: i});
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
        return data;
    }, chartsState);

    return chartData.map(data => ({data}));
});