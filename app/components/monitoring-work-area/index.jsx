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

const selectionButtonStyleContainer = ({colors}) => ({
    width: "100%",
    backgroundColor: colors.backgroundButtonBottom,
    borderBottomRightRadius: "20px",
    borderBottomLeftRadius: "20px",
    borderTop: `1px solid ${colors.borderContentModal}`,
    position: "absolute",
    bottom: "-1px"
});

const buttonBottomStyle = ({colors}) => ({
    width: "40%",
    height: "40px",
    fontSize: "14px",
    color: colors.white,
    backgroundColor: colors.transparent,
    textTransform: "uppercase",
    fontWeight: "400",
    margin: "10px 5%",
    border: "0px",
    cursor: "pointer",
    textAlign: "center"
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
        asteroid: PropTypes.object,
        filters: PropTypes.object.isRequired,
        onClickAggregate: PropTypes.func,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        selectSensor: PropTypes.func,
        selectSensorsToDraw: PropTypes.func,
        selected: PropTypes.array,
        sensors: IPropTypes.map.isRequired,
        tableInstructions: PropTypes.string,
        workAreaInstructions: PropTypes.string,
        workAreaMessage: PropTypes.string,
        workAreaOldSensors: IPropTypes.list,
        workAreaSensors: PropTypes.array
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSortFunc: function () {
        return R.partialRight(this.sortByLabel, [true]);
    },
    searchFilter: function (item) {
        const {primaryTagsToFilter, tagsToFilter, wordsToFilter} = this.props.filters;
        return (
            (primaryTagsToFilter <= 0 && tagsToFilter <= 0 && wordsToFilter <= 0) ||
            (this.searchPrimaryTags(item, primaryTagsToFilter) &&
            this.searchTags(item, tagsToFilter) &&
            this.searchWords(item, wordsToFilter))
        );
    },
    searchPrimaryTags: function (item, filterPrimaryTags) {
        if (filterPrimaryTags.length == 0) {
            return true;
        }
        let found = false;
        if (!R.isNil(item)) {
            for (let i = 0; i < filterPrimaryTags.length && !found; i++) {
                found = this.searchTag(item.get("primaryTags"), filterPrimaryTags[i]);
            }
        }
        return found;
    },
    searchTags: function (item, filterTags) {
        let found = true;
        if (!R.isNil(item)) {
            for (let i = 0; i < filterTags.length && found; i++) {
                found = this.searchTag(item.get("tags"), filterTags[i]);
            }
        }
        return found;
    },
    searchWords: function (item, filterWords) {
        let found = true;
        if (!R.isNil(item) && filterWords.length > 0) {
            for (let i = 0; i < filterWords.length && found; i++) {
                var searchRegExp = new RegExp(filterWords[i], "i");
                found = (
                    searchRegExp.test(item.get("_id")+item.get("measurementType")) ||
                    searchRegExp.test(item.get("name")) ||
                    searchRegExp.test(item.get("description")) ||
                    this.searchTag(item.get("primaryTags"), filterWords[i]) ||
                    this.searchTag(item.get("tags"), filterWords[i])
                );
            }
        }
        return found;
    },
    searchTag: function (itemTags, tag) {
        return (!R.isNil(itemTags) ? R.contains(tag, itemTags) : false);
    },
    sortByLabel: function (a, b, asc) {
        let aLabel = getSensorLabel(a).toLowerCase();
        let bLabel = getSensorLabel(b).toLowerCase();
        if (asc) {
            return aLabel > bLabel ? 1 : -1;
        }
        return aLabel > bLabel ? -1 : 1;
    },
    selectAllSensors: function (sensors) {
        sensors.forEach(sensor => {
            this.props.selectSensor(this.props.sensors.get(sensor.key));
        });
    },
    moveSelectedSensors: function () {
        this.props.selected.forEach(sensor => {
            this.props.addSensorToWorkArea(sensor);
        });
    },
    renderSensorList: function (element, elementId) {
        let found = this.props.selected && R.find((it) => {
            return getSensorId(it) === elementId;
        })(this.props.selected) != null;
        return (
            <MonitoringSensorRow
                asteroid={this.props.asteroid}
                isSelected={found}
                onClickSelect={this.props.selectSensor}
                selectSensorToDraw={this.props.selectSensorsToDraw}
                sensor={element}
                sensorId={elementId}
            />
        );
    },
    renderTableInstructions: function (theme) {
        return this.props.tableInstructions ? (
            <label style={{width: "100%", color: theme.colors.mainFontColor, textAlign: "center"}}>
                {this.props.tableInstructions}
            </label>
        ) : null;
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
                    margin: "0px",
                    padding: "10px 15px 0px 15px"
                }}>
                    {this.renderTableInstructions(theme)}
                    <div style={{
                        position: "relative",
                        color: theme.colors.mainFontColor,
                        borderRadius: "20px",
                        paddingBottom: "60px",
                        height: "360px",
                        overflow: "hidden",
                        border: "1px solid " + theme.colors.borderContentModal,
                        background: theme.colors.transparent
                    }}>
                        <div style={{
                            height: "100%",
                            overflow: "auto",
                            overflowY: "scroll",
                            borderRadiusTopRight: "18px",
                            borderRadiusTopLeft: "18px",
                            marginRight: "-15px"
                        }}>
                            <CollectionItemList
                                buttonBottomStyle={buttonBottomStyle(theme)}
                                collections={this.props.sensors}
                                filter={this.searchFilter}
                                headerComponent={this.renderSensorList}
                                hover={true}
                                hoverStyle={hoverStyle(theme)}
                                initialVisibleRow={20}
                                lazyLoadButtonStyle={lazyLoadButtonStyle(theme)}
                                lazyLoadLabel={"Carica altri"}
                                selectionButtonStyleContainer={selectionButtonStyleContainer(theme)}
                                selectAll={{
                                    label: "Seleziona tutti",
                                    onClick: this.selectAllSensors
                                }}
                                sort={this.getSortFunc()}
                                transferAll={{
                                    label: "Sposta selezionati",
                                    selected: this.props.selected,
                                    onClick: this.moveSelectedSensors
                                }}
                            />
                        </div>
                    </div>

                    <SensorsDropArea
                        addSensorToWorkArea={this.props.addSensorToWorkArea}
                        allSensors={this.props.sensors}
                        oldSensors={this.props.workAreaOldSensors}
                        onClickAggregate={this.props.onClickAggregate}
                        onClickChart={this.props.selectSensorsToDraw}
                        removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                        sensors={this.props.workAreaSensors}
                        sensorsFilter={this.searchFilter}
                        sensorsSort={this.getSortFunc()}
                        workAreaInstructions={this.props.workAreaInstructions}
                        workAreaMessage={this.props.workAreaMessage}
                    />
                </div>
            </div>
        );
    }
});

module.exports = MonitoringWorkArea;
