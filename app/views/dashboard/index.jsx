var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");
var colors     = require("lib/colors");

var Dashboard = React.createClass({
    propTypes: {
    },
    render: function () {
        var widget1 = "/_assets/images/dashboard/widget4.png";
        var widget2 = "/_assets/images/dashboard/widget2.png";
        var widget3 = "/_assets/images/dashboard/widget3.png";

        return (
            <bootstrap.Grid>
                <components.Spacer direction="h" size={32} />
                <bootstrap.Col
                    lg={1}
                    style={{textAlign: "center", width: "100%", fontSize: "20pt", color: colors.primary}}
                >
                    {"Dashboards"}
                </bootstrap.Col>
                <components.Spacer direction="h" size={32} />
                <bootstrap.Col lg={1} style={{textAlign: "center", width: "100%"}}>
                    <img
                        src={widget1}
                        style={{width: "80%"}}
                    />
                </bootstrap.Col>
                <components.Spacer direction="h" size={32} />
                <bootstrap.Col lg={2} style={{textAlign: "center", width: "100%"}}>
                    <img
                        src={widget2}
                    />
                    <img
                        src={widget3}
                    />
                </bootstrap.Col>
            </bootstrap.Grid>
        );
    }
});

module.exports = Radium(Dashboard);
