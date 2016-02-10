var R         = require("ramda");
var React     = require("react");
var bootstrap = require("react-bootstrap");

import {defaultTheme} from "lib/theme";

var Button = React.createClass({
    propTypes: {
        style: React.PropTypes.object
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        var button = (
            <bootstrap.Button {...this.props} />
        );
        return React.cloneElement(button, {
            style: R.merge({
                outline: "0px",
                outlineStyle: "none",
                outlineWidth: "0px"
            }, this.props.style || {})
        });
    }
});

module.exports = Button;
