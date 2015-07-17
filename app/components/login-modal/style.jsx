var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");


var StyleLogin = React.createClass({
    render: function () {
        return (
            <Radium.Style
                rules={{
                    ".form-group": {
                        marginBottom: "-1px"
                    },
                    ".input-group": {
                        opacity: 0.7
                    },
                    ".input-password": {
                        marginBottom: "40px",
                        borderTopLeftRadius: 0
                    },
                    ".form-signin-email": {
                        borderBottomRightRadius: 0
                    },
                    ".form-signin-psw": {
                        borderTopRightRadius: 0
                    },
                    ".access-button": {
                        background: colors.primary
                    },
                    ".access-button:hover": {
                        background: colors.buttonHover
                    },
                    ".access-button:active": {
                        background: colors.buttonHover
                    }
                }}
            />
        );
    },
});

module.exports = Radium(StyleLogin);
