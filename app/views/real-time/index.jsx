var Radium = require("radium");
var React  = require("react");

var Gauge  = require("components/").Gauge;

var RealTime = React.createClass({
    propTypes: {},
    render: function () {
        return (
            <Gauge value={90}/>
        );
    }
});

module.exports = Radium(RealTime);
