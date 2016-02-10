var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");

var components   = require("components");
var assetsPathTo = require("lib/assets-path-to");
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var Dashboard = React.createClass({
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        var widget1 = assetsPathTo("images/dashboard/widget4.png");
        var widget2 = assetsPathTo("images/dashboard/widget2.png");
        var widget3 = assetsPathTo("images/dashboard/widget3.png");

        return (
            <div>
                <div style={styles(this.getTheme()).titlePage}>
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px", width: "100%"}}>
                        {""}
                    </div>
                </div>
                <bootstrap.Grid>
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
            </div>
        );
    }
});

module.exports = Radium(Dashboard);
