var R = require("ramda");

var isArrayOfNumbers = function (thing) {
    return (
        R.is(Array, thing) &&
        thing.reduce(function (isNumber, element) {
            if (!isNumber) {
                return isNumber;
            }
            return R.is(Number, element);
        }, true)
    );
};

exports.DygraphCoordinate = function (props, propName) {
    var prop = props[propName];
    var x = prop[0];
    var ys = prop.slice(1);
    if (!R.is(Date, x)) {
        return new Error(propName + "[0] must be a date");
    }
    return ys.reduce(function (error, y, index) {
        if (error) {
            return error;
        }
        return (
            isArrayOfNumbers(y) && y.length === 2 ?
            null :
            new Error(propName + "[" + index + "] must be a 2-tuple of numbers")
        );
    }, null);
};
