var Immutable = require("immutable");
var Radium    = require("radium");
var R         = require("ramda");
var React     = require("react");
var Router    = require("react-router");
var bootstrap = require("react-bootstrap");

var components = require("components");
var styles     = require("lib/styles");

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
            <div>
                <bootstrap.Col sm={12} style={styles.colVerticalPadding}>
                    <span>
                        <components.ButtonGroupSelect
                            allowedValues={["Contrattuale", "Previsionale", "Reale"]}
                            {...this.bindToQueryParameter("tipologia", "Contrattuale")}
                        />
                    </span>
                    <span className="pull-right">
                        <components.DropdownSelect
                            allowedItems={[ "Coin", "OVS", "Iperal Fuentes"]}
                            title="Punto di misurazione"
                            {...this.bindToQueryParameter("punto", "Coin")}
                        />
                        <components.Spacer direction="h" size={10} />
                        <components.DropdownSelect
                            allowedItems={["Corrente", "Potenza attiva", "Potenza reattiva", "Voltaggio"]}
                            title="Quantità di interesse"
                            {...this.bindToQueryParameter("quantita", "Corrente")}
                        />
                    </span>
                </bootstrap.Col>
                <bootstrap.Col sm={12}>
                    <components.TemporalLineChart
                        coordinates={[]}
                    />
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(Chart);
