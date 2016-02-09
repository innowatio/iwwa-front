var IPropTypes = require("react-immutable-proptypes");
var moment     = require("moment");
var R          = require("ramda");
var React      = require("react");

var icons      = require("lib/icons_restyling");
var styles     = require("lib/styles_restyling");

var PageContainer = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        children: React.PropTypes.node,
        collections: IPropTypes.map.isRequired,
        localStorage: React.PropTypes.object,
        reduxState: React.PropTypes.object.isRequired,
        style: React.PropTypes.object
    },
    defaultProps: {
        style: {}
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
        this.props.asteroid.subscribe("sites");
    },
    getTitleForSingleSensor: function (reduxViewState) {
        const path = reduxViewState.fullPath;
        var res = [this.getSiteName(path[0])];
        if (path.length > 1) {
            if (this.getSensorName(R.last(path))) {
                res.push(this.getSensorName(R.last(path)));
            } else {
                res.push(R.last(path));
            }
        }
        return res.join(" · ");
    },
    getStringPeriod: function (period) {
        const momentStart = moment(period.start);
        const momentEnd = moment(period.end);

        if (momentStart.month() === momentEnd.month() && momentStart.year() === momentEnd.year()) {
            return `${momentStart.format("MMMM YYYY")}`;
        } else {
            return `${momentStart.format("DD MMMM")} - ${momentEnd.format("DD MMMM YYYY")}`;
        }
    },
    getTitleForChart: function (chartState) {
        /*
            Selezione sito-pod-sensor:
            NameSito (· NamePod/Sensor )· Period

            Comparazione siti:
            NameSito1 & NameSito2

            Comparazione per data (su sito pod o sensor):
            NameSito (· NamePod/Sensor )· Period1 & Period2

            Compara energia con variabile:
            NameSito (· NamePod/Sensor )· measureType & variableType

        */
        if (chartState.length === 1) {
            return `${this.getTitleForSingleSensor(chartState[0])} · ${this.getStringPeriod(chartState[0].date)}`;
        } else if (chartState.length > 1) {
            // periods compare
            if (!R.isEmpty(chartState[0].date.period) && chartState[0].date != chartState[1].date && chartState[0].fullPath === chartState[1].fullPath) {
                return `${this.getTitleForSingleSensor(chartState[0])} · ${chartState.map(chart => this.getStringPeriod(chart.date)).join(" & ")}`;
            } else if (chartState[0].site === chartState[1].site) {
                return `${this.getTitleForSingleSensor(chartState[0])} & ${this.getSensorName(chartState[1].sensorId)}`;
            // sites compare
            } else if (chartState[0].fullPath !== chartState[1].fullPath) {
                return `${this.getTitleForSingleSensor(chartState[0])} & ${this.getTitleForSingleSensor(chartState[1])}`;
            }
        }
    },
    getSensorName: function (sensorId) {
        return this.props.collections.getIn(["sensors", sensorId, "description"]) || sensorId;
    },
    getSiteName: function (siteId) {
        return this.props.collections.getIn(["sites", siteId, "name"]);
    },
    renderChildren: function () {
        return React.cloneElement(this.props.children, {
            asteroid: this.props.asteroid,
            collections: this.props.collections,
            localStorage: this.props.localStorage
        });
    },
    renderTitle: function () {
        const locationName = R.path(["props", "route", "name"], this.props.children);
        var locationLabel = "";

        if (locationName === "chart") {
            const reduxChart = this.props.reduxState.chart;

            locationLabel = this.getTitleForChart(reduxChart);
        } else if (locationName === "live") {
            const reduxRealTime = this.props.reduxState.realTime;

            locationLabel = this.getTitleForSingleSensor(reduxRealTime);
        }

        return locationLabel;
    },
    render: function () {
        const {style} = this.props;
        return (
            <div
                {...this.props}
                style={{...style}}
            >
                <div style={styles.titlePage}>
                    <h2 style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px"}}>
                        {this.renderTitle()}
                    </h2>
                    <img className="pull-right" src={icons.iconSettings} style={{marginTop: "-20px"}}/>
                </div>
                <div>
                    {this.renderChildren()}
                </div>
            </div>
        );
    }
});

module.exports = PageContainer;
