var R      = require("ramda");
var React  = require("react");
var Router = require("react-router");

var components = require("components");

var Chart = React.createClass({
    propTypes: {
        dataset: React.PropTypes.array
    },
    mixins: [Router.State, Router.Navigation],
    changeSelectedValueGroupSelect: function (newSelectedValueGroupSelect) {
        var par = this.getPathname();
        var par2 = this.getParams();
        this.replaceWith(par, par2, R.merge(this.getQuery(), {
            selectedValueGroupSelect: newSelectedValueGroupSelect
        }));
    },
    changeSelectedValueDropdownSite: function (newSelectedValueDropdownSite) {
        var par = this.getPathname();
        var par2 = this.getParams();
        this.replaceWith(par, par2, R.merge(this.getQuery(), {
            selectedValueDropdownSite: newSelectedValueDropdownSite
        }));
    },
    changeSelectedValueDropdownInterestMisure: function (newSelectedValueDropdownInterestMisure) {
        var par = this.getPathname();
        var par2 = this.getParams();
        this.replaceWith(par, par2, R.merge(this.getQuery(), {
            selectedValueDropdownInterestMisure: newSelectedValueDropdownInterestMisure
        }));
    },
    changeSelectedValueDropdownExport: function (newSelectedValueDropdownExport) {
        var par = this.getPathname();
        var par2 = this.getParams().selectedValueDropdownExport;
        this.replaceWith(par, par2, R.merge(this.getQuery(), {
            selectedValueDropdownExport: newSelectedValueDropdownExport
        }));
    },
    render: function () {
        return (
            <div className="av-chart">
                <div className="av-chart-menu">
                    <components.ButtonGroupSelect
                        allowedValues={["Contrattuale", "Previsionale", "Reale"]}
                        onChange={this.changeSelectedValueGroupSelect}
                        value={this.getQuery().selectedValueGroupSelect || "Reale"}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={["Csv", "Jpg", "Png"]}
                        onChange={this.changeSelectedValueDropdownExport}
                        title={"Export"}
                        value={this.getQuery().selectedValueDropdownExport || "Jpg"}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={[ "Coin", "OVS", "Iperal Fuentes"]}
                        onChange={this.changeSelectedValueDropdownSite}
                        title={"Punto di misurazione"}
                        value={this.getQuery().selectedValueDropdownSite || "Coin"}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={["Corrente", "Potenza attiva", "Potenza reattiva", "Voltaggio"]}
                        onChange={this.changeSelectedValueDropdownInterestMisure}
                        title={"Quantità di interesse"}
                        value={this.getQuery().selectedValueDropdownInterestMisure || "Corrente"}
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
