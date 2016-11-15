import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import {bindActionCreators} from "redux";
import * as bootstrap from "react-bootstrap";

import {getDragDropContext} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getLoggedUser, hasRole, CREATE_SENSORS, EDIT_SENSORS, VIEW_ALL_SENSORS} from "lib/roles-utils";
import {getAllSensors, getMonitoringSensors, getSensorLabel, getSensorsTags, findSensor} from "lib/sensors-utils";
import {styles} from "lib/styles";

import {
    Button,
    ConfirmModal,
    DeleteWithConfirmButton,
    DropdownButton,
    Icon,
    MonitoringSensorsSelector,
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
import {assignSensorsToUsers} from "actions/users";

const stylesFunction = (theme) => ({
    buttonIconStyle: {
        backgroundColor: theme.colors.primary,
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
    ];
};

var Monitoring = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        addSensor: PropTypes.func.isRequired,
        addSensorToWorkArea: PropTypes.func.isRequired,
        assignSensorsToUsers: PropTypes.func.isRequired,
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
            showConfirmModal: false,
            showEditModal: false
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.sensorsState.sensorsCreated.length > 0) {
            const user = getLoggedUser(nextProps.asteroid);
            const userSensors = user.get("sensors") ? user.get("sensors").toJS() : [];
            const sensors = R.uniq(R.concat(nextProps.sensorsState.sensorsCreated, userSensors));
            nextProps.assignSensorsToUsers([user], sensors);
        }
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getButtonLink: function (iconName, selected) {
        switch (iconName) {
            case "duplicate":
                this.props.cloneSensors(selected);
                break;
            case "edit":
                this.onClickEditSensor();
                break;
            default:
                break;
        }
    },
    getAllSensors: function () {
        return getAllSensors(this.props.collections.get("sensors"));
    },
    getMonitoringSensors: function () {
        const {asteroid} = this.props;
        return getMonitoringSensors(this.props.collections.get("sensors"), hasRole(asteroid, VIEW_ALL_SENSORS), getLoggedUser(asteroid).get("sensors"));
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
        if (this.state.showEditModal) {
            return (
                <SensorForm
                    addItemToFormula={this.props.addItemToFormula}
                    allSensors={this.getAllSensors()}
                    asteroid={this.props.asteroid}
                    closeForm={() => this.closeModals(true)}
                    currentSensor={selected.length == 1 ? selected[0] : null}
                    initialValues={this.getSensorFields()}
                    onSave={this.onSaveForm}
                    removeItemFromFormula={this.props.removeItemFromFormula}
                    sensorState={this.props.sensorsState.current}
                    sensorsToAggregate={workAreaSensors}
                    showFullscreenModal={this.state.showEditModal}
                    showSensorAggregator={!this.state.editSensor}
                    tagOptions={getSensorsTags(this.getMonitoringSensors(), "tags")}
                    title={this.state.editSensor ? "MODIFICA SENSORE" : "CREA NUOVO SENSORE"}
                />
            );
        }
    },
    renderButton: function (iconName, tooltip, disabled, permissionRole) {
        const theme = this.getTheme();
        const selected = this.props.sensorsState.selectedSensors;
        return hasRole(this.props.asteroid, permissionRole) ? (
            <bootstrap.OverlayTrigger
                overlay={
                    <bootstrap.Tooltip className="buttonInfo" id={tooltip}>
                        {tooltip}
                    </bootstrap.Tooltip>
                }
                placement="bottom"
                rootClose={true}
            >
                <Button
                    style={stylesFunction(theme).buttonIconStyle}
                    disabled={disabled}
                    onClick={() => this.getButtonLink(iconName, selected)}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={iconName}
                        size={"28px"}
                        style={{lineHeight: "45px"}}
                    />
                </Button>
            </bootstrap.OverlayTrigger>
        ) : null;
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
                renderFooter={true}
                show={this.state.showConfirmModal}
                subtitle={selected.name + " · " + selected.description + " · " + selected.unitOfMeasurement}
                title={title}
            />
        );
    },
    render: function () {
        const theme = this.getTheme();
        const selected = this.props.sensorsState.selectedSensors;
        const {asteroid} = this.props;
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
                        {this.renderButton("duplicate", "Duplica", selected.length < 1, CREATE_SENSORS)}
                        {this.renderButton("edit", "Modifica", selected.length != 1, EDIT_SENSORS)}
                        {hasRole(asteroid, CREATE_SENSORS) || hasRole(asteroid, EDIT_SENSORS) ?
                            <DeleteWithConfirmButton
                                disabled={selected.length < 1}
                                onConfirm={() => this.props.deleteSensors(selected)}
                            /> : null
                        }
                    </div>
                </SectionToolbar>

                <MonitoringSensorsSelector
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    asteroid={asteroid}
                    filterSensors={this.props.filterSensors}
                    onClickAggregate={hasRole(asteroid, CREATE_SENSORS) ? this.resetAndOpenNew : null}
                    removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                    selectedSensors={selected}
                    selectSensor={this.props.selectSensor}
                    selectSensorsToDraw={this.props.selectSensorsToDraw}
                    sensors={this.getMonitoringSensors()}
                    sensorsState={this.props.sensorsState}
                    tableInstructions={"Seleziona alcuni sensori per interagire con essi o clicca sul icona per vedere il grafico"}
                    workAreaInstructions={"Trascina in questo spazio i sensori che vuoi graficare"}
                    workAreaMessage={"Hai selezionato:"}
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
        assignSensorsToUsers: bindActionCreators(assignSensorsToUsers, dispatch),
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
