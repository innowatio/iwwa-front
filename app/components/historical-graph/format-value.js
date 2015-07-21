module.exports = function formatValue (value) {
    return (
        value && value.toArray ?
        value.toArray() :
        [value, 0]
    );
};
