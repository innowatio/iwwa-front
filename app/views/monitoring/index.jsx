import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import {bindActionCreators} from "redux";

import {getDragDropContext} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getAllSensors, getMonitoringSensors, getSensorLabel, findSensor} from "lib/sensors-utils";
import {styles} from "lib/styles";

import {
    Button,
    ConfirmModal,
    DropdownButton,
    FullscreenModal,
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

const stylesFunction = (theme) => ({
    buttonIconStyle: {
        backgroundColor: theme.colors.buttonPrimary,
        border: "0px none",
        borderRadius: "100%",
        height: "50px",
        margin: "auto",
        width: "50px",
        marginLeft: "10px"
    },
    modalTitleStyle: {
        color: theme.colors.white,
        display: "inherit",
        marginBottom: "50px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "28px"
    },
    buttonConfirmStyle: {
        margin: "0px"
    }
});

let advancedOptions = function ({colors}) {
    // TODO other advanced options not available in first release.
    return [
        // {
        //     label: "Allarmi",
        //     key: "alarms",
        //     iconClass: "danger",
        //     hoverColor: colors.white,
        //     color: colors.iconDropdown
        // },
        {
            label: "Guarda preferiti",
            key: "favoriteCharts",
            iconClass: "list-favourite",
            hoverColor: colors.white,
            color: colors.iconDropdown,
            onClick: () => {
                browserHistory.push("/monitoring/favorites/");
            }
        }
        // {
        //     label: "Assegna",
        //     key: "assign",
        //     iconClass: "assign",
        //     hoverColor: colors.white,
        //     color: colors.iconDropdown
        // }
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
            deleteSensors: false,
            showConfirmModal: false,
            showDeleteModal: false,
            showEditModal: false
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
    getMonitoringSensors: function () {
        return getMonitoringSensors(this.props.collections.get("sensors"));
    },
    getSensorFields: function () {
        const selected = this.props.sensorsState.selectedSensors;
        if (this.state.editSensor && selected.length == 1) {
            var fields = selected[0].toJS();
            fields.name = (getSensorLabel(selected[0]));
            if (!fields.tags) {
                fields.tags = [];
            }
            return fields;
        } else {
            return {
                name: "",
                description: "",
                unitOfMeasurement: "",
                siteId: "",
                userId: "",
                primaryTags: this.getParentsPrimaryTags(this.props.sensorsState.workAreaSensors),
                tags: []
            };
        }
    },
    getParentsPrimaryTags: function (selectedSensors) {
        const allSensors = this.getAllSensors();
        return R.uniq(R.flatten(selectedSensors.map(sensor => {
            const sensorObj = findSensor(allSensors, sensor);
            return sensorObj.get("primaryTags") ? sensorObj.get("primaryTags").toArray() : [];
        })));
    },
    onClickEditSensor: function () {
        this.props.getFormulaItems();
        this.openEditModal(true);
    },
    resetAndOpenNew: function () {
        this.props.resetFormulaItems(false);
        this.openEditModal(false);
    },
    openEditModal: function (editSensor) {
        this.setState({
            editSensor: editSensor,
            showEditModal: true
        });
    },
    openDeleteModal: function (deleteSensors) {
        this.setState({
            deleteSensors: deleteSensors,
            showDeleteModal: true
        });
    },
    openConfirmModal: function () {
        this.setState({
            showConfirmModal: true
        });
    },
    closeModals: function (reset) {
        if (reset) {
            this.props.resetFormulaItems(true);
        }
        this.setState({
            showEditModal: false,
            showConfirmModal: false
        });
    },
    onConfirmDeleteModal: function () {
        const selected = this.props.sensorsState.selectedSensors;
        this.props.deleteSensors(selected);
        this.setState({showDeleteModal: false});
    },
    onSaveForm: function () {
        if (this.state.editSensor) {
            this.props.editSensor(...arguments);
        } else {
            this.props.addSensor(...arguments);
        }
        this.openConfirmModal();
    },
    renderSensorForm: function () {
        const selected = this.props.sensorsState.selectedSensors;
        const workAreaSensors = this.props.sensorsState.workAreaSensors;
        if (selected.length > 0 || workAreaSensors.length > 0) {
            return (
                <SensorForm
                    addItemToFormula={this.props.addItemToFormula}
                    allSensors={this.getAllSensors()}
                    closeForm={() => this.setState({showEditModal: false})}
                    currentSensor={selected.length == 1 ? selected[0] : null}
                    initialValues={this.getSensorFields()}
                    onSave={this.onSaveForm}
                    removeItemFromFormula={this.props.removeItemFromFormula}
                    sensorState={this.props.sensorsState.current}
                    sensorsToAggregate={workAreaSensors}
                    showFullscreenModal={this.state.showEditModal}
                    showSensorAggregator={!this.state.editSensor}
                    title={this.state.editSensor ? "MODIFICA SENSORE" : "CREA NUOVO SENSORE"}
                />
            );
        }
    },
    renderDeleteButton: function () {
        const theme = this.getTheme();
        const selected = this.props.sensorsState.selectedSensors;
        return (
            <div style={{display: "inline"}}>
                <Button
                    disabled={selected.length < 1}
                    onClick={this.openDeleteModal}
                    style={stylesFunction(theme).buttonIconStyle}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"close"}
                        size={"28px"}
                        style={{lineHeight: "45px"}}
                    />
                </Button>
                <FullscreenModal
                    onConfirm={this.onConfirmDeleteModal}
                    onHide={() => this.setState({showDeleteModal: false})}
                    renderConfirmButton={true}
                    show={this.state.showDeleteModal}
                >
                    {this.renderDeleteModalBody()}
                </FullscreenModal>
            </div>
        );
    },
    renderDeleteModalBody: function () {
        const theme = this.getTheme();
        return (
            <div style={{textAlign: "center"}}>
                <div>
                    <label style={stylesFunction(theme).modalTitleStyle}>
                        {"Sei sicuro di voler cancellare questo elemento?"}
                    </label>
                </div>
            </div>
        );
    },
    renderConfirmModal: function () {
        const selected = this.getSensorFields();
        const title = (this.state.editSensor ?
            "HAI MODIFICATO IL SENSORE \n" :
            "HAI CREATO IL SENSORE \n");
        return (
            <ConfirmModal
                onConfirm={() => this.setState({showConfirmModal: false})}
                onHide={this.closeModals}
                iconType={"flag"}
                show={this.state.showConfirmModal}
                subtitle={selected.name + " · " + selected.description + " · " + selected.unitOfMeasurement}
                title={title}
            />
        );
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
                                onChange={menuItem => menuItem.onClick()}
                                style={styles(theme).chartDropdownButton}
                            />
                        </Popover>
                    </div>
                    <div style={{float: "right", marginTop: "3px"}}>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
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
                            style={stylesFunction(theme).buttonIconStyle}
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
                        {this.renderDeleteButton()}
                    </div>
                </SectionToolbar>

                <MonitoringSearch
                    filterSensors={this.props.filterSensors}
                    style={{width: "25%", float: "left", marginTop: "2px", height: "calc(100vh - 120px)"}}
                />

                <MonitoringWorkArea
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    onClickAggregate={this.resetAndOpenNew}
                    primaryTagsToFilter={this.props.sensorsState.primaryTagsToFilter}
                    removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                    selectSensor={this.props.selectSensor}
                    selectSensorsToDraw={this.props.selectSensorsToDraw}
                    selected={selected}
                    sensors={this.getMonitoringSensors()}
                    tagsToFilter={this.props.sensorsState.tagsToFilter}
                    wordsToFilter={this.props.sensorsState.wordsToFilter}
                    workAreaSensors={this.props.sensorsState.workAreaSensors}
                />
                {this.renderSensorForm()}
                {this.renderConfirmModal()}
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
