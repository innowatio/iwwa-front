var React  = require("react");
var Router = require("react-router");

var components = require("components");

var Chart = React.createClass({
    propTypes: {
        dataset: React.PropTypes.array
    },
    mixins: [Router.State],
    getInitialState: function () {
        return {
            selectedValue: "Contrattuale"
        };
    },
    changeSelectedValue: function (newSelectedValue) {
        this.setState({
            selectedValue: newSelectedValue
        });
    },
    render: function () {
        return (
            <div className="av-chart">
                <div className="av-chart-menu">
                    <components.ButtonGroupSelect
                        allowedValues={["Contrattuale", "Previsionale", "Reale"]}
                        onChange={this.changeSelectedValue}
                        value={this.state.selectedValue}
                    />
                </div>
                <div className="av-chart-body">
                    <components.TemporalLineChart coordinates={this.props.dataset}/>
                </div>
            </div>
        );
    }
});

module.exports = Chart;
