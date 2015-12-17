var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components      = require("components");
var CollectionUtils = require("lib/collection-utils");
var colors          = require("lib/colors");
var icons           = require("lib/icons");
var styles          = require("lib/styles");

var RealTime = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    getInitialState: function () {
        return {
            selectedSito: Immutable.Map()
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
    },
    drawGauge: function (params) {
        return (
            <div style={{margin: "auto", width: R.path(["style", "width"], params) || "200px"}}>
                <components.Gauge
                    valueLabel={this.getGaugeLabel({
                        id: params.id,
                        styleText: params.styleText,
                        unit: params.unit || "",
                        value: params.value
                    })}
                    {...params}
                />
                <div style={{textAlign: "center"}}>
                    <div>{params.id}</div>
                </div>
            </div>
        );
    },
    drawGauges: function () {
        if (this.findLatestMeasuresForEnergy().size > 0) {
            var sizeValues = this.findLatestMeasuresForEnergy().size;
            return this.findLatestMeasuresForEnergy().map((measure) => {
                var gaugeParams = {
                    id: measure.get("id"),
                    key: measure.get("key"),
                    maximum: 10,
                    minimum: 0,
                    style: {height: "auto", width: "100%"},
                    styleGaugeBar: {stroke: colors.lineReale},
                    stylePointer: {fill: colors.greyBorder},
                    styleText: {color: colors.lineReale},
                    unit: measure.get("unit"),
                    value: parseFloat(measure.get("value")).toFixed(2) / 1 || 0
                };
                return (
                    <bootstrap.Col key={measure.get("key")} lg={sizeValues > 4 ? 4 : 6} md={sizeValues > 4 ? 4 : 6} sm={6} style={{padding: "20px"}}>
                        {this.drawGauge(gaugeParams)}
                    </bootstrap.Col>);
            });
        }
    },
    drawGaugeTotal: function () {
        if (this.findLatestMeasuresForEnergy().size > 0) {
            const {value, unit} = this.findLatestMeasuresForEnergy().reduce((acc, measure) => {
                return {
                    value: acc.value + parseFloat((measure.get("value")) || 0),
                    unit: measure.get("unit")
                };
            }, {value: 0, unit: ""});
            var gaugeParams = {
                id: "Consumi totali",
                key: "Consumi totali",
                maximum: 10,
                minimum: 0,
                style: {height: "auto", width: "100%"},
                styleLabel: {top: "-30px"},
                stylePointer: {fill: colors.greyBorder},
                unit: unit,
                value: parseFloat(value).toFixed(2) / 1
            };
            return this.drawGauge(gaugeParams);
        }
    },
    getSites: function () {
        var sites = this.props.collections.get("sites") || Immutable.Map();
        return sites;
    },
    getMeasures: function () {
        return this.props.collections.get("readings-real-time-aggregates") || Immutable.Map();
    },
    setSelectedSite: function (siteId) {
        this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", siteId[0]);
        this.setState({selectedSite:
            this.getSites().find(function (site) {
                return site.get("_id") === siteId[0];
            })
        });
    },
    getSelectedSiteName: function () {
        return (
            this.state.selectedSite ?
            this.state.selectedSite.get("name") :
            null
        );
    },
    getMeasuresBySite: function () {
        var selectedSiteId = this.state.selectedSite.get("_id");
        return this.getMeasures().find(function (measure) {
            return measure.get("_id") === selectedSiteId;
        }).get("sensors") || Immutable.Map();
    },
    getGaugeLabel: function (params) {
        return (
            <components.MeasureLabel {...params} />
        );
    },
    findLatestMeasuresWithCriteria: function (criteria) {
        var res = CollectionUtils.measures.decorators.filter(criteria);
        if (this.state.selectedSite && this.getMeasures().size) {
            var decoMeasurements = this.state.selectedSite.get("sensors")
                .map(sensor => {
                    return CollectionUtils.measures.decorateMeasure(sensor);
                });
            res = R.filter(
                criteria,
                CollectionUtils.measures.addValueToMeasures(
                    decoMeasurements.flatten(1),
                    this.getMeasuresBySite()
            ));
        }
        return res;
    },
    findLatestMeasuresForEnergy: function () {
        var measures = this.findLatestMeasuresWithCriteria(function (decorator) {
            return decorator.get("type") === "pod" && decorator.get("keyType") === "activeEnergy";
        });
        return measures.map(pod => {
            var anzId = (pod.get("children") || Immutable.List()).map(anz => {
                return CollectionUtils.measures.decorateMeasure(anz);
            });
            return pod.set("value", CollectionUtils.measures.addValueToMeasures(
                anzId.flatten(1),
                this.getMeasuresBySite()
            ).filter(decorator => {
                return decorator.get("keyType") === "activeEnergy";
            }).reduce((acc, measure) => {
                return acc + (measure.get("value") || 0);
            }, 0));
        });
    },
    findLatestMeasuresForVariables: function () {
        return this.findLatestMeasuresWithCriteria(function (decorator) {
            return decorator.get("type") !== "pod" && decorator.get("type") !== "pod-anz";
        });
    },
    render: function () {
        const selectedSiteName = this.getSelectedSiteName();
        return (
            <div style={styles.mainDivStyle}>
                <bootstrap.Col sm={12}>
                    {/*     Barra Export (?) e ricerca sito     */}
                    <span className="pull-right">
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
                    </span>
                </bootstrap.Col>
                {/* Barra Rilevazioni ambientali */}
                <h3 className="text-center" style={{color: colors.primary}}>
                    {`${selectedSiteName ? selectedSiteName + " - " : ""}Rilevazioni ambientali`}
                </h3>
                <components.VariablesPanel
                    values={this.findLatestMeasuresForVariables()}
                />
                {/* Gauge/s */}
                <h3 className="text-center" style={{color: colors.primary}}>
                    {`${selectedSiteName ? selectedSiteName + " - " : ""}Pods`}
                </h3>
                <div style={{overflow: "scroll"}}>
                    <bootstrap.Col className="text-center" sm={4} style={{padding: "20px"}}>
                        {this.drawGaugeTotal()}
                    </bootstrap.Col>
                    <bootstrap.Col sm={8}>
                        {this.drawGauges()}
                    </bootstrap.Col>
                </div>
            </div>
        );
    }
});

module.exports = Radium(RealTime);
