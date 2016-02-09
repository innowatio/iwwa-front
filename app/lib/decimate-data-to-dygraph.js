import {addIndex, all, identity, last, reduce} from "ramda";
import moment from "moment";

function isInRange (val1, val2) {
    return (
        val1 * 1.10 > val2 &&
        val1 * 0.90 < val2
    );
}

function areInRange (values1, values2) {
    const results = [];
    for (var i=0; i< values1.length; i++) {
        results.push(
            isInRange(values1[i], values2[i])
        );
    }
    return all(identity, results);
}

function getValues (dataPoint) {
    return dataPoint.slice(1).map(p => p[0]);
}

const indexedReduce = addIndex(reduce);

export default function decimate (dygraphData) {
    const length = dygraphData.length;
    return indexedReduce((acc, dataPoint, index) => {
        const needsToAdd = (
            index === 0 ||
            index === length - 1 ||
            !areInRange(getValues(last(acc)), getValues(dataPoint)) ||
            index % 24 === 12
        );
        if (needsToAdd) {
            acc.push(dataPoint);
        }
        // This is in case of two point of data with long temporal distance. If
        // I don't set the point to 0.01, graph is plotted with a oblique line.
        if (dygraphData[index + 1] && moment(dygraphData[index + 1][0]).diff(dygraphData[index][0], "days") > 5) {
            const mockPoint = [moment(dataPoint[0]).add({minutes: 5}).toDate(), [0.01], [0.01]];
            acc.push(mockPoint);
        }
        return acc;
    }, [], dygraphData);
}
