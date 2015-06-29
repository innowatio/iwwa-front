var React = require("react");
var components = require("components");

var Chart = React.createClass({
    propTypes: {
        dataset: React.PropTypes.array
    },
    render: function () {
        return (
            <div className="av-chart">
                <div className="av-chart-menu">
                    Qui ci vanno le opzioni
                </div>
                <div className="av-chart-body">
                    <components.TemporalLineChart coordinates={this.props.dataset}/>
                </div>
            </div>
        );
    }
});

module.exports = Chart;
