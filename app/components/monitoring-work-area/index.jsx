import React, {PropTypes} from "react";
import R from "ramda";
import IPropTypes from "react-immutable-proptypes";

import {defaultTheme} from "lib/theme";
import {getSensorId, getSensorLabel} from "lib/sensors-utils";

import {CollectionItemList, MonitoringSensorRow, SensorsDropArea} from "components";

const hoverStyle = ({colors}) => ({
    backgroundColor: colors.backgroundMonitoringRowHover,
    cursor: "pointer"
});

const lazyLoadButtonStyle = ({colors}) => ({
    width: "230px",
    height: "45px",
    lineHeight: "43px",
    backgroundColor: colors.buttonPrimary,
    fontSize: "14px",
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "400",
    margin: "10px auto 40px auto",
    borderRadius: "30px",
    cursor: "pointer",
    textAlign: "center"
});

var MonitoringWorkArea = React.createClass({
    propTypes: {
        addSensorToWorkArea: PropTypes.func.isRequired,
        onClickAggregate: PropTypes.func.isRequired,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selectSensorsToDraw: PropTypes.func.isRequired,
        selected: PropTypes.array,
        sensors: IPropTypes.map.isRequired,
        tagsToFilter: PropTypes.array,
        wordsToFilter: PropTypes.array,
        workAreaSensors: PropTypes.array
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    searchFilter: function (item) {
        let filterTags = this.props.tagsToFilter;
        let filterWords = this.props.wordsToFilter;
        return (
            (filterTags <= 0 && filterWords <= 0) ||
            this.searchWords(item, filterWords) ||
            this.searchTags(item, filterTags)
        );
    },
    searchTags: function (item, filterTags) {
        let found = false;
        if (!R.isNil(item) && !R.isNil(item.get("tags"))) {
            for (let i = 0; i < filterTags.length && !found; i++) {
                found = this.searchTag(item.get("tags"), filterTags[i]);
            }
        }
        return found;
    },
    searchTag: function (itemTags, tag) {
        return (!R.isNil(itemTags) ? R.contains(tag, itemTags) : false);
    },
    searchWords: function (item, filterWords) {
        let found = false;
        if (!R.isNil(item) && filterWords.length > 0) {
            for (let i = 0; i < filterWords.length && !found; i++) {
                var searchRegExp = new RegExp(filterWords[i], "i");
                found = (
                    searchRegExp.test(item.get("_id")+item.get("measurementType")) ||
                    searchRegExp.test(item.get("name")) ||
                    searchRegExp.test(item.get("description")) ||
                    this.searchTag(item.get("tags"), filterWords[i])
                );
            }
        }
        return found;
    },
    sortByLabel: function (a, b, asc) {
        let aLabel = getSensorLabel(a).toLowerCase();
        let bLabel = getSensorLabel(b).toLowerCase();
        if (asc) {
            return aLabel > bLabel ? 1 : -1;
        }
        return aLabel > bLabel ? -1 : 1;
    },
    renderSensorList: function (element, elementId) {
        let found = R.find((it) => {
            return getSensorId(it) === elementId;
        })(this.props.selected) != null;
        return (
            <MonitoringSensorRow
                isSelected={found}
                onClickSelect={this.props.selectSensor}
                selectSensorToDraw={this.props.selectSensorsToDraw}
                sensor={element}
                sensorId={elementId}
            />
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div style={{
                overflow: "hidden",
                width: "74%",
                margin: "0 auto",
                height: "calc(100vh - 120px)"
            }}>
                <div style={{
                    width: "auto",
                    overflow: "auto",
                    height: "100%",
                    marginRight: "-15px",
                    padding: "10px 15px 0px 15px"
                }}>
                    <label style={{width: "100%", color: theme.colors.mainFontColor, textAlign: "center"}}>
                        {"Seleziona alcuni sensori per visualizzare il grafico o per creare un nuovo sensore"}
                    </label>
                    <div style={{
                        color: theme.colors.mainFontColor,
                        borderRadius: "20px",
                        height: "400px",
                        overflow: "hidden",
                        border: "1px solid " + theme.colors.borderContentModal,
                        background: theme.colors.transparent
                    }}>
                        <div style={{
                            height: "100%",
                            overflow: "auto",
                            overflowY: "scroll",
                            marginRight: "-15px",
                            borderRadius: "18px"
                        }}>
                            <CollectionItemList
                                collections={this.props.sensors}
                                filter={this.searchFilter}
                                headerComponent={this.renderSensorList}
                                hover={true}
                                hoverStyle={hoverStyle(theme)}
                                initialVisibleRow={6}
                                lazyLoadButtonStyle={lazyLoadButtonStyle(theme)}
                                lazyLoadLabel={"Carica altri"}
                                sort={R.partialRight(this.sortByLabel, [true])}
                            />
                        </div>
                    </div>

                    <SensorsDropArea
                        addSensorToWorkArea={this.props.addSensorToWorkArea}
                        allSensors={this.props.sensors}
                        onClickAggregate={this.props.onClickAggregate}
                        onClickChart={this.props.selectSensorsToDraw}
                        removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                        sensors={this.props.workAreaSensors}
                    />
                </div>
            </div>
        );
    }
});

module.exports = MonitoringWorkArea;
