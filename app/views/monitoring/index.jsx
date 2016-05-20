import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {getDragDropContext} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getAllSensors, getSensorLabel} from "lib/sensors-utils";
import {styles} from "lib/styles_restyling";

import {
    Button,
    DropdownButton,
    Icon,
    MonitoringSearch,
    MonitoringWorkArea,
    Popover,
    SectionToolbar,
    SensorForm
} from "components";

import {selectSensorsToDraw} from "actions/monitoring-chart";
import {
    addItemToFormula,
    addSensor,
    addSensorToWorkArea,
    cloneSensors,
    deleteSensors,
    editSensor,
    favoriteSensor,
    filterSensors,
    getFormulaItems,
    removeItemFromFormula,
    removeSensorFromWorkArea,
    resetFormulaItems,
    selectSensor
} from "actions/sensors";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.buttonPrimary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px",
    marginLeft: "10px"
});

let advancedOptions = function ({colors}) {
    return [
        {
            label: "Allarmi",
            key: "alarms",
            iconClass: "danger",
            hoverColor: colors.white,
            color: colors.iconDropdown
        },
        {
            label: "Guarda preferiti",
            key: "favoriteCharts",
            iconClass: "list-favourite",
            hoverColor: colors.white,
            color: colors.iconDropdown
        },
        {
            label: "Assegna",
            key: "assign",
            iconClass: "assign",
            hoverColor: colors.white,
            color: colors.iconDropdown
        }
    ];
};

var Monitoring = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        addSensor: PropTypes.func.isRequired,
        addSensorToWorkArea: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        cloneSensors: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        deleteSensors: PropTypes.func.isRequired,
        editSensor: PropTypes.func.isRequired,
        favoriteSensor: PropTypes.func.isRequired,
        filterSensors: PropTypes.func.isRequired,
        getFormulaItems: PropTypes.func.isRequired,
        removeItemFromFormula: PropTypes.func.isRequired,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        resetFormulaItems: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selectSensorsToDraw: PropTypes.func.isRequired,
        sensorsState: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            editSensor: false,
            showFullscreenModal: false
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getAllSensors: function () {
        return getAllSensors(this.props.collections.get("sensors"));
    },
    getSensorFields: function () {
        const selected = this.props.sensorsState.selectedSensors;
        if (this.state.editSensor && selected.length == 1) {
            var fields = selected[0].toJS();
            fields.name = (getSensorLabel(selected[0]));
            return fields;
        } else {
            //TODO find how to delete initial values...
            return {
                name: "",
                description: "",
                unitOfMeasurement: "",
                siteId: "",
                userId: "",
                tags: []
            };
        }
    },
    onClickEditSensor: function () {
        this.props.getFormulaItems();
        this.openModal(true);
    },
    resetAndOpenNew: function () {
        this.props.resetFormulaItems(false);
        this.openModal(false);
    },
    openModal: function (editSensor) {
        this.setState({
            editSensor: editSensor,
            showFullscreenModal: true
        });
    },
    closeModal: function (reset) {
        if (reset) {
            this.props.resetFormulaItems(true);
        }
        this.setState({
            showFullscreenModal: false
        });
    },
    renderSensorForm: function () {
        const selected = this.props.sensorsState.selectedSensors;
        const workAreaSensors = this.props.sensorsState.workAreaSensors;
        if (selected.length > 0 || workAreaSensors.length > 0) {
            return (
                <SensorForm
                    addItemToFormula={this.props.addItemToFormula}
                    allSensors={this.getAllSensors()}
                    closeForm={() => this.closeModal(this.state.editSensor)}
                    currentSensor={selected.length == 1 ? selected[0] : null}
                    initialValues={this.getSensorFields()}
                    onSave={this.state.editSensor ? this.props.editSensor : this.props.addSensor}
                    removeItemFromFormula={this.props.removeItemFromFormula}
                    sensorState={this.props.sensorsState.current}
                    sensorsToAggregate={workAreaSensors}
                    showFullscreenModal={this.state.showFullscreenModal}
                    showSensorAggregator={!this.state.editSensor}
                    title={this.state.editSensor ? "MODIFICA SENSORE" : "CREA NUOVO SENSORE"}
                />
            );
        }
    },
    render: function () {
        const theme = this.getTheme();
        const selected = this.props.sensorsState.selectedSensors;
        return (
            <div>
                <SectionToolbar>
                    <div style={{float: "right", height: "58px"}}>
                        <Popover
                            className="pull-right"
                            hideOnChange={true}
                            title={
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"option"}
                                    size={"32px"}
                                    style={{lineHeight: "50px"}}
                                />
                            }
                        >
                            <DropdownButton
                                allowedValues={advancedOptions(this.getTheme())}
                                getColor={R.prop("color")}
                                getHoverColor={R.prop("hoverColor")}
                                getIcon={R.prop("iconClass")}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                style={styles(theme).chartDropdownButton}
                            />
                        </Popover>
                    </div>
                    <div style={{float: "right", marginTop: "3px"}}>
                        <Button
                            style={buttonStyle(theme)}
                            disabled={selected.length < 1}
                            onClick={() => this.props.cloneSensors(selected)}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"duplicate"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                        <Button
                            style={buttonStyle(theme)}
                            disabled={selected.length != 1}
                            onClick={this.onClickEditSensor}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"edit"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                        <Button
                            style={buttonStyle(theme)}
                            disabled={selected.length < 1}
                            onClick={() => this.props.deleteSensors(selected)}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"close"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                    </div>
                </SectionToolbar>

                <MonitoringSearch
                    filterSensors={this.props.filterSensors}
                    style={{width: "25%", float: "left", marginTop: "2px", height: "calc(100vh - 120px)"}}
                />

                <MonitoringWorkArea
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    onClickAggregate={this.resetAndOpenNew}
                    removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                    selectSensor={this.props.selectSensor}
                    selectSensorsToDraw={this.props.selectSensorsToDraw}
                    selected={selected}
                    sensors={this.getAllSensors()}
                    tagsToFilter={this.props.sensorsState.tagsToFilter}
                    wordsToFilter={this.props.sensorsState.wordsToFilter}
                    workAreaSensors={this.props.sensorsState.workAreaSensors}
                />

                {this.renderSensorForm()}
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        collections: state.collections,
        sensorsState: state.sensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addItemToFormula: bindActionCreators(addItemToFormula, dispatch),
        addSensor: bindActionCreators(addSensor, dispatch),
        addSensorToWorkArea: bindActionCreators(addSensorToWorkArea, dispatch),
        cloneSensors: bindActionCreators(cloneSensors, dispatch),
        deleteSensors: bindActionCreators(deleteSensors, dispatch),
        editSensor: bindActionCreators(editSensor, dispatch),
        favoriteSensor: bindActionCreators(favoriteSensor, dispatch),
        filterSensors: bindActionCreators(filterSensors, dispatch),
        getFormulaItems: bindActionCreators(getFormulaItems, dispatch),
        removeItemFromFormula: bindActionCreators(removeItemFromFormula, dispatch),
        removeSensorFromWorkArea: bindActionCreators(removeSensorFromWorkArea, dispatch),
        resetFormulaItems: bindActionCreators(resetFormulaItems, dispatch),
        selectSensor: bindActionCreators(selectSensor, dispatch),
        selectSensorsToDraw: bindActionCreators(selectSensorsToDraw, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(getDragDropContext(Monitoring));
