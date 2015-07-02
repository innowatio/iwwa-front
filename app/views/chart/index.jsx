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
            selectedValueGroupSelect: "Contrattuale",
            selectedValueDropdownSite: "Coin",
            selectedValueDropdownInterestMisure: "Corrente",
            selectedValueDropdownExport: "Jpg"
        };
    },
    changeSelectedValueGroupSelect: function (newSelectedValueGroupSelect) {
        this.setState({
            selectedValueGroupSelect: newSelectedValueGroupSelect
        });
    },
    changeSelectedValueDropdownSite: function (newSelectedValueDropdownSite) {
        this.setState({
            selectedValueDropdownSite: newSelectedValueDropdownSite
        });
    },
    changeSelectedValueDropdownInterestMisure: function (newSelectedValueDropdownInterestMisure) {
        this.setState({
            selectedValueDropdownInterestMisure: newSelectedValueDropdownInterestMisure
        });
    },
    changeSelectedValueDropdownExport: function (newSelectedValueDropdownExport) {
        this.setState({
            selectedValueDropdownExport: newSelectedValueDropdownExport
        });
    },
    render: function () {
        return (
            <div className="av-chart">
                <div className="av-chart-menu">
                    <components.ButtonGroupSelect
                        allowedValues={["Contrattuale", "Previsionale", "Reale"]}
                        onChange={this.changeSelectedValueGroupSelect}
                        value={this.state.selectedValueGroupSelect}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={["Csv", "Jpg", "Png"]}
                        onChange={this.changeSelectedValueDropdownExport}
                        title={"Export"}
                        value={this.state.selectedValueDropdownExport}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={[ "Coin", "Griante", "Iperal Fuentes", "Casa Nonna Maria"]}
                        onChange={this.changeSelectedValueDropdownSite}
                        title={"Punto di misurazione"}
                        value={this.state.selectedValueDropdownSite}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={["Corrente", "Potenza attiva", "Potenza reattiva", "Voltaggio"]}
                        onChange={this.changeSelectedValueDropdownInterestMisure}
                        title={"Quantità di interesse"}
                        value={this.state.selectedValueDropdownInterestMisure}
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
