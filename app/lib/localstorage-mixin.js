var getLocalStorage = function (instance) {
    return {
        get: function (key) {
            return localStorage[key];
        },
        set: function (key, value) {
            localStorage[key] = value;
            instance.setState({
                localStorage: getLocalStorage(instance)
            });
        }
    };
};

module.exports = {
    getInitialState: function () {
        return {
            localStorage: getLocalStorage(this)
        };
    }
};
