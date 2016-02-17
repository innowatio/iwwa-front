var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var React      = require("react");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var components        = require("components");
var readingsRealTime  = require("lib/readings-real-time-aggregates-to-realtime-view");
import {styles} from "lib/styles_restyling";
import {selectRealTimeSite} from "actions/real-time";
import {defaultTheme} from "lib/theme";
import {getTitleForSingleSensor} from "lib/page-header-utils";

const styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0",
    border: "0",
    borderRadius: "100%",
    margin: "13px",
    backgroundColor: colors.secondary
});

var RealTime = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        realTime: React.PropTypes.object.isRequired,
        selectRealTimeSite: React.PropTypes.func.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            showModal: false
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
        if (this.props.realTime.fullPath) {
            this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", this.props.realTime.fullPath[0]);
        }
    },
    componentWillReceiveProps: function () {
        if (this.props.realTime.fullPath) {
            this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", this.props.realTime.fullPath[0]);
        }
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
        const {colors} = this.getTheme();
        if (this.findLatestMeasuresForEnergy().size > 0) {
            var sizeValues = this.findLatestMeasuresForEnergy().size;
            return this.findLatestMeasuresForEnergy().map((measure) => {
                var gaugeParams = {
                    id: measure.get("id"),
                    key: measure.get("key"),
                    maximum: 100,
                    minimum: 0,
                    style: {height: "auto", width: "100%"},
                    styleGaugeBar: {stroke: colors.lineReale},
                    stylePointer: {fill: colors.greyBorder},
                    styleText: {color: colors.lineReale},
                    unit: measure.get("unit"),
                    value: parseFloat(measure.get("value")).toFixed(2) / 1 || 0
                };
                return (
                    <bootstrap.Col
                        key={measure.get("key")}
                        lg={sizeValues > 4 ? 4 : 6}
                        md={sizeValues > 4 ? 4 : 6}
                        sm={6}
                        style={{padding: "20px"}}
                    >
                        {this.drawGauge(gaugeParams)}
                    </bootstrap.Col>);
            });
        }
    },
    drawGaugeTotal: function () {
        const {colors} = this.getTheme();
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
                maximum: 100,
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
        return this.props.collections.get("sites") || Immutable.Map();
    },
    getSite: function (siteId) {
        return this.getSites().find(function (site) {
            return site.get("_id") === siteId;
        });
    },
    getMeasures: function () {
        return this.props.collections.get("readings-real-time-aggregates") || Immutable.Map();
    },
    setSelectedSite: function (selectedValues) {
        const siteId = selectedValues.site;
        this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", siteId);
        this.props.selectRealTimeSite(selectedValues);
        this.closeModal();
    },
    closeModal: function () {
        this.setState({
            showModal: false
        });
    },
    getSelectedSiteName: function () {
        return (
            this.props.realTime.fullPath &&
            this.getSites().size > 0 &&
            this.getSite(this.props.realTime.fullPath) ?
            this.getSite(this.props.realTime.fullPath[0]).get("name") :
            null
        );
    },
    getMeasuresBySite: function () {
        var selectedSiteId = this.props.realTime.fullPath[0] ?
            this.getSite(this.props.realTime.fullPath[0]).get("_id") :
            null;
        var selectSite = this.getMeasures().find(function (measure) {
            return measure.get("_id") === selectedSiteId;
        });
        return selectSite ?
        selectSite.get("sensors") :
        Immutable.Map();
    },
    getGaugeLabel: function (params) {
        return (
            <components.MeasureLabel {...params} />
        );
    },
    findLatestMeasuresWithCriteria: function (criteria) {
        var res = readingsRealTime.decorators.filter(criteria);
        if (this.props.realTime.fullPath && this.getMeasures().size) {
            var decoMeasurements = this.getSite(this.props.realTime.fullPath[0]).get("sensors")
                .map(sensor => {
                    return readingsRealTime.decorateMeasure(sensor);
                });
            res = R.filter(
                criteria,
                readingsRealTime.addValueToMeasures(
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
                return readingsRealTime.decorateMeasure(anz);
            });
            return pod.set("value", readingsRealTime.addValueToMeasures(
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
    getSitoById: function (sitoId) {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        return sites.find(site => {
            return site.get("_id") === sitoId;
        });
    },
    openModal: function () {
        this.setState({showModal:true});
    },
    renderModalButton: function () {
        const theme = this.getTheme();
        return (
            <div>
                <components.Button className="pull-right" onClick={this.openModal} style={styleSiteButton(theme)} >
                    <components.Icon
                        color={this.getTheme().colors.iconSiteButton}
                        icon={"map"}
                        size={"38px"}
                        style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                            lineHeight: "20px"
                        }}
                    />
                </components.Button>
                <components.FullscreenModal
                    childComponent={this.renderModalBody()}
                    show={this.state.showModal}
                />
            </div>
        );
    },
    renderModalBody: function () {
        return (
            <components.SiteNavigator
                allowedValues={this.getSites()}
                defaultPath={this.props.realTime.fullPath || []}
                onChange={this.setSelectedSite}
                title={"Quale punto di misurazione vuoi visualizzare?"}
            />
        );
    },
    render: function () {
        const theme = this.getTheme();
        const selectedSiteName = this.getSelectedSiteName();
        return (
            <div>
                <div style={styles(this.getTheme()).titlePage}>
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px", width: "100%"}}>
                        {getTitleForSingleSensor(this.props.realTime, this.props.collections)}
                    </div>
                </div>
                <div style={styles(theme).mainDivStyle}>
                    <bootstrap.Col sm={12}>
                        <span className="pull-right">
                            {this.renderModalButton()}
                        </span>
                    </bootstrap.Col>
                    <h3 className="text-center" style={{color: theme.colors.primary}}>
                        {`${selectedSiteName ? selectedSiteName + " - " : ""}Rilevazioni ambientali`}
                    </h3>
                    <components.VariablesPanel
                        values={this.findLatestMeasuresForVariables()}
                    />
                    <h3 className="text-center" style={{color: theme.colors.primary}}>
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
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections,
        realTime: state.realTime
    };
}
function mapDispatchToProps (dispatch) {
    return {
        selectRealTimeSite: bindActionCreators(selectRealTimeSite, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RealTime);
