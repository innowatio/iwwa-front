var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");

var styles     = require("lib/styles");

var Dashboard = React.createClass({
    propTypes: {
    },
    render: function () {
        var widget1 = "/_assets/images/dashboard/widget1.png";
        var widget2 = "/_assets/images/dashboard/widget2.png";
        var widget3 = "/_assets/images/dashboard/widget3.png";

        return (
            <bootstrap.Grid>
                <bootstrap.Col lg={1} style={{textAlign: "center", width: "100%"}}>
                    {"Dashboards"}
                </bootstrap.Col>
                <bootstrap.Col lg={1} style={{textAlign: "center", width: "100%"}}>
                    <img
                        src={widget1}
                    />
                </bootstrap.Col>
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
