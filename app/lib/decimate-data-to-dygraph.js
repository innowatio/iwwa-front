import {addIndex, all, identity, last, reduce} from "ramda";

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
        return acc;
    }, [], dygraphData);
}
