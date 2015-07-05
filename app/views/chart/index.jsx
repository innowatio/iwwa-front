var Immutable = require("immutable");
var R         = require("ramda");
var React     = require("react");
var Router    = require("react-router");

var components = require("components");

var Chart = React.createClass({
    propTypes: {
        collections: React.PropTypes.instanceOf(Immutable.Map),
        location: React.PropTypes.object
    },
    mixins: [Router.Navigation],
    changeQuery: function (name, value) {
        this.replaceWith(
            this.props.location.pathname,
            R.assoc(name, value, this.props.location.query)
        );
    },
    bindToQueryParameter: function (name, defaultValue) {
        return {
            value: R.path(["location", "query", name], this.props) || defaultValue,
            onChange: R.partial(this.changeQuery, name)
        };
    },
    render: function () {
        return (
            <div className="av-chart">
                <div className="av-chart-menu">
                    <components.ButtonGroupSelect
                        allowedValues={["Contrattuale", "Previsionale", "Reale"]}
                        {...this.bindToQueryParameter("tipologia", "Contrattuale")}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={[ "Coin", "OVS", "Iperal Fuentes"]}
                        title="Punto di misurazione"
                        {...this.bindToQueryParameter("punto", "Coin")}
                    />
                    <components.DropdownButtonSelect
                        allowedItems={["Corrente", "Potenza attiva", "Potenza reattiva", "Voltaggio"]}
                        title="Quantità di interesse"
                        {...this.bindToQueryParameter("quantita", "Corrente")}
                    />
                </div>
                <div className="av-chart-body">
                    <components.TemporalLineChart
                        coordinates={[]}
                    />
                </div>
            </div>
        );
    }
});

module.exports = Chart;
