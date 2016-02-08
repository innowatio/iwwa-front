import IPropTypes from "react-immutable-proptypes";
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
    getTitleForChartOrLive: function (reduxViewState) {
        const path = reduxViewState.fullPath;
        return path ? [
            this.getSiteName(path[0]),
            path.length > 1 ?
                this.getSensorName(R.last(path)) :
                undefined]
            .filter(value => !R.isNil(value))
            .join(" · ") :
            "";
    },
    getSensorName: function (sensorId) {
        return this.props.collections.getIn(["sensors", sensorId, "description"]);
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

            locationLabel = R.map(this.getTitleForChartOrLive, reduxChart).join(" - ");
        } else if (locationName === "live") {
            const reduxRealTime = this.props.reduxState.realTime;

            locationLabel = this.getTitleForChartOrLive(reduxRealTime);
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
