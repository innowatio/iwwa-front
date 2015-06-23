var React     = require("react");
var bootstrap = require("react-bootstrap");

var Login = React.createClass({
    login: function () {
        console.log("Do Login");
    },
    render: function () {
        return (
            <div className="av-login">
                <bootstrap.Button onClick={this.login}>
                    {"Login"}
                </bootstrap.Button>
            </div>
        );
    }
});

module.exports = Login;
