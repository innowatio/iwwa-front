
const operatorMapping = {
    "+" : "add",
    "-" : "minus",
    "x" : "delete",
    "%" : "divide"
};

function swap (json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

export const formulaToOperator = operatorMapping;
export const operatorToFormula = swap(operatorMapping);