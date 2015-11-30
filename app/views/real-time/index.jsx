var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var CollectionUtils = require("lib/collection-utils");
var components      = require("components");
var icons           = require("lib/icons");
var styles          = require("lib/styles");


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
        this.props.asteroid.subscribe("sites");
    },
    drawGauge: function (key, value, unit, max, min, id) {
        return (
            <components.Gauge
                key={key}
                maximum={max}
                minimum={min}
                unit={unit}
                value={value}
                valueLabel={this.getGaugeLabel({
                    id: id,
                    unit: unit || "",
                    value: value
                })}
            />
        );
    },
    drawGauges: function () {
        if (this.findLatestMeasuresForEnergy().size > 0) {
            return this.findLatestMeasuresForEnergy().map((measure) => {
                return this.drawGauge(
                    measure.get("key"),
                    measure.get("value") || 0,
                    measure.get("unit"),
                    1.2,
                    0,
                    measure.get("id")
                );
            });
        }

    },
    drawGaugeTotal: function () {
        if (this.findLatestMeasuresForEnergy().size > 0) {
            const {value, unit} = this.findLatestMeasuresForEnergy().reduce((acc, measure) => {
                return {
                    value: acc.value || 0 + measure.get("value"),
                    unit: measure.get("unit")
                };
            }, {value: 0, unit: ""});
            return this.drawGauge("total", value, unit, 1.2, 0);
        }
    },
    getSites: function () {
        var sites = this.props.collections.get("sites") || Immutable.Map();
        return sites;
    },
    getMeasures: function () {
        return this.props.collections.get("real-time-measures") || Immutable.Map();
    },
    setSelectedSite: function (site) {
        this.props.asteroid.subscribe("findRealTimeMeasuresBySite", site[0].get("_id"));
        this.setState({"selectedSite": site[0]});
    },
    getMeasuresBySite: function () {
        var selectedSiteId = this.state.selectedSite.get("_id");
        return this.getMeasures().find(function (measure) {
            return measure.get("siteId") === selectedSiteId;
        }).get("sensors");
    },
    getGaugeLabel: function (params) {
        return (
            <components.MeasureLabel {...params} />
        );
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
    findLatestMeasuresForEnergy: function () {
        var res = {
            key: "activeEnergy",
            unit: "KWh"
        };
        if (this.state.selectedSite && this.getMeasures().size) {
            var decoMeasurements = R.map((sensor) => {
                return CollectionUtils.measures.decorateMeasure(sensor.set("type", "pod"));
            }, this.state.selectedSite.get("pods"));
            res = R.filter(
                function (measure) {
                    return measure.get("keyType") === "activeEnergy";
                },
                CollectionUtils.measures.addValueToMeasures(
                    decoMeasurements.flatten(1),
                    this.getMeasuresBySite()
            ));
        }
        return res;
    },
    findLatestMeasuresForVariables: function () {
        var res = CollectionUtils.measures.decorators.filter(function (decorator) {
            return decorator.get("type") !== "pod";
        });
        if (this.state.selectedSite && this.getMeasures().size) {
            var decoMeasurements = R.map((sensor) => {
                return CollectionUtils.measures.decorateMeasure(sensor);
            }, this.state.selectedSite.get("otherSensors"));
            res = CollectionUtils.measures.addValueToMeasures(
                decoMeasurements.flatten(1),
                this.getMeasuresBySite()
            ).toArray();
        }
        return res;
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
                            allowedValues={this.getSites()}
                            onChange={this.setSelectedSite}
                            placeholder={"Punto di misurazione"}
                            value={this.state.selectedSite}
                            {...CollectionUtils.sites}
                        />
                    </components.Popover>
                </bootstrap.Col>
                {/* Barra Rilevazioni ambientali */}
                <components.Spacer direction="h" size={1} />
                <components.VariablesPanel
                    values={this.findLatestMeasuresForVariables()}
                />
                {/* Gauge/s */}
                <components.Spacer direction="h" size={1} />
                {this.drawGaugeTotal()}
                {this.drawGauges()}
            </div>
        );
    }
});

module.exports = Radium(RealTime);
