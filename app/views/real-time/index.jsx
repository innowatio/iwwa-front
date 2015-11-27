var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var CollectionUtils = require("lib/collection-utils");
var components      = require("components");
var Gauge           = require("components/").Gauge;
var icons           = require("lib/icons");
var styles          = require("lib/styles");
var VariablesPanel  = require("components/").VariablesPanel;


var RealTime = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    getInitialState: function () {
        return {
            selectedSito: Immutable.Map(),
            value: 0,
            values: this.getVariables()
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("siti");
    },
    getSiti: function () {
        return this.props.collections.get("siti") || Immutable.Map();
    },
    getMeasures: function () {
        return this.props.collections.get("site-month-readings-aggregates") || Immutable.Map();
    },
    getMisureBySito: function (sito) {
        var period = `${new Date().getYear() + 1900}-${new Date().getMonth() + 1}`;
        this.props.asteroid.subscribe("misureBySitoAndMonth", sito[0].get("_id"), period);
        this.setState({"selectedSito": sito[0]});
        this.findLatestMeasures();
    },
    getVariables: function () {
        return [
            {
                key: "temperature",
                icon: icons.iconTemperature,
                unit: "°C"
            },
            {
                key: "humidity",
                icon: icons.iconHumidity,
                unit: "g/m3"
            },
            {
                key: "illuminance",
                icon: icons.iconIdea,
                unit: "lx"
            },
            {
                key: "co2",
                icon: icons.iconCO2,
                unit: "ppm"
            }
        ];
    },
    findLatestMeasures: function () {
        var values = CollectionUtils.measures.findMeasuresBySitoAndVariables(
            this.getMeasures(),
            this.state.selectedSito,
            this.getVariables()
        );
        // this.setState({values: values});
        return values;
    },
    findLatestMeasuresForEnergy: function () {
        var res = {
            key: "energia attiva",
            unit: "KWh"
        };
        var values = CollectionUtils.measures.findMeasuresBySitoAndVariables(
            this.getMeasures(),
            this.state.selectedSito,
            [res]
        );
        res = R.merge(res, {value: values[0][values[0].length - 1]});
        return res;
    },
    findLatestMeasuresForVariables: function () {
        var res = this.getVariables();
        var values = this.findLatestMeasures();
        for (var i = 0; i < values.length; i++) {
            res[i] = R.merge(res[i], {value: values[i][values[i].length - 1]});
        }
        return res;
    },
    rand: function () {
        this.setState({value: Math.round(Math.random() * 10000) / 100});
    },
    render: function () {
        return (
            <div style={styles.mainDivStyle}>
                <bootstrap.Col sm={12}>
                    {/*     Barra Export (?) e ricerca sito     */}
                    <components.Popover
                        hideOnChange={true}
                        title={<img src={icons.iconSiti} style={{width: "75%"}} />}
                        tooltipId="tooltipMisurazione"
                        tooltipPosition="top"
                    >
                        <components.SelectTree
                            allowedValues={this.getSiti()}
                            filter={CollectionUtils.siti.filter}
                            getKey={CollectionUtils.siti.getKey}
                            getLabel={CollectionUtils.siti.getLabel}
                            onChange={this.getMisureBySito}
                            placeholder={"Punto di misurazione"}
                            value={this.state.selectedSito}
                        />
                    </components.Popover>
                </bootstrap.Col>
                {/* Barra Rilevazioni ambientali */}
                <VariablesPanel
                    values={this.findLatestMeasuresForVariables()}
                />
                {/* Gauge/s */}
                <components.Gauge
                    maximum={1.2}
                    minimum={0}
                    unit={"kWh"}
                    value={this.findLatestMeasuresForEnergy().value || 0}
                />
            </div>
        );
    }
});

module.exports = Radium(RealTime);
