
exports.isDateEquivalent = function (props, propName) {
    var time = new Date(props[propName]).getTime();
    if (isNaN(time)) {
        return new Error("x must represent a date");
    }
};
