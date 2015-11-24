var Radium = require("radium");
var React  = require("react");

var Gauge  = require("components/").Gauge;

var RealTime = React.createClass({
    propTypes: {},
    render: function () {
        return (
            <Gauge
                maximum={100}
                minimum={0}
                value={50}
            />
        );
    }
});

module.exports = Radium(RealTime);
