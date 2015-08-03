var R         = require("ramda");
var React     = require("react");
var Router    = require("react-router");

module.exports = R.merge(Router.Navigation, {
    propTypes: {
        location: React.PropTypes.object.isRequired
    },
    bindToQueryParameter: function (name, transformer) {
        /*
        *   transformer must be an object with the following shape:
        *       {
        *           parse: function (string -> any),
        *           stringify: function (any -> string)
        *       }
        */
        var self = this;
        /*
        *   Get the query parameter value. We assume we have access to the
        *   location props passed by react-router
        */
        var queryValue = R.path(["location", "query", name], self.props);
        /*
        *   Return the props which will be attached to an input component. The
        *   input must adhere to the convention of taking value as the current
        *   input value and calling onChange with the new value.
        */
        return {
            value: transformer.parse(queryValue),
            onChange: function (newValue) {
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
