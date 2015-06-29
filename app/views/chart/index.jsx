var React = require("react");
var components = require("components");

var Chart = React.createClass({
    render: function () {
        return (
            <div className="av-chart">
                <div className="av-chart-menu">
                    Qui ci vanno le opzioni
                </div>
                <div className="av-chart-body">
                    <components.LineChart />
                </div>
            </div>
        );
    }
});

module.exports = Chart;
