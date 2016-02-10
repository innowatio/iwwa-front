import IPropTypes from "react-immutable-proptypes";
import moment from "moment";
import R from "ramda";
import React, {PropTypes} from "react";

import icons from "lib/icons";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var PageContainer = React.createClass({
    propTypes: {
        asteroid: PropTypes.object,
        children: PropTypes.node,
        collections: IPropTypes.map.isRequired,
        localStorage: PropTypes.object,
        reduxState: PropTypes.object.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    defaultProps: {
        style: {}
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
        this.props.asteroid.subscribe("sites");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getTitleForSingleSensor: function (reduxViewState) {
        const path = reduxViewState.fullPath;
        if (R.isNil(path) || R.isEmpty(path)) {
            return "";
        }
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
        if (period.type === "dateCompare") {
            const momentNow = moment.utc();
            return `${momentNow.format("MMM YYYY")} & ${momentNow.subtract(1, period.period.key).format("MMM YYYY")}`;
        } else {
            return `${moment(period.end).format("MMM YYYY")}`;
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
            if (!R.isEmpty(chartState[0].date.period) && chartState[0].date != chartState[1].date && R.equals(chartState[0].fullPath, chartState[1].fullPath)) {
                return `${this.getTitleForSingleSensor(chartState[0])} · ${this.getStringPeriod(chartState[0].date)}`;
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
                style={style}
            >
                <div style={styles(this.getTheme()).titlePage}>
                    <h2 style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px"}}>
                        {this.renderTitle()}
                    </h2>
                    <img className="pull-right" src={icons.iconUserSettings} style={{marginTop: "-20px", width: "25px"}}/>
                </div>
                <div>
                    {this.renderChildren()}
                </div>
            </div>
        );
    }
});

module.exports = PageContainer;
