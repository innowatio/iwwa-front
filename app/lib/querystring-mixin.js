var Immutable = require("immutable");
var R         = require("ramda");
var React     = require("react");
var Router    = require("react-router");

var defaultTransformer = {
    parse: R.identity,
    stringify: R.identity
};

var isTransformer = function (thing) {
    return (
        thing &&
        R.is(Function, thing.parse) &&
        R.is(Function, thing.stringify)
    );
};

var isSyntheticEvent = function (thing) {
    return (
        thing &&
        R.is(Function, thing.preventDefault) &&
        R.is(Function, thing.stopPropagation)
    );
};

var isEmpty = function (iterable) {
    return (
        R.is(Immutable.Iterable, iterable) ?
        iterable.isEmpty() :
        R.isEmpty(iterable)
    );
};

module.exports = R.merge(Router.Navigation, {
    propTypes: R.merge(Router.Navigation.propTypes, {
        location: React.PropTypes.object.isRequired
    }),
    bindToQueryParameter: function (name, transformer, defaultValue) {
        var self = this;
        /*
        *   Both transformer and defaultValue are optional, figure out the
        *   correct assignments
        */
        defaultValue = isTransformer(transformer) ? defaultValue : transformer;
        transformer = isTransformer(transformer) ? transformer : defaultTransformer;
        /*
        *   Get the query parameter value. We assume we have access to the
        *   location props passed by react-router
        */
        var queryValue = R.path(["location", "query", name], this.props);
        /*
        *   Return the props which will be attached to an input component. The
        *   input must adhere to the convention of taking value as the current
        *   input value and calling onChange with the new value or an event
        *   TODO specify better
        */
        var value = transformer.parse(queryValue);
        return {
            value: (
                R.isNil(value) || isEmpty(value) ?
                defaultValue :
                value
            ),
            onChange: function (eventOrNewValue) {
                /*
                *   Support both passing the value directly to the onChange
                *   handler or passing a SyntheticEvent
                */
                var newValue = (
                    isSyntheticEvent(eventOrNewValue) ?
                    eventOrNewValue.target.value :
                    eventOrNewValue
                );
                var newQueryValue = transformer.stringify(newValue);
                /*
                *   replaceWith is defined as we merged with our mixin
                *   react-router's Navigation mixin
                */
                self.replaceWith(
                    self.props.location.pathname,
                    R.assoc(name, newQueryValue, self.props.location.query)
                );
            }
        };
    }
});
