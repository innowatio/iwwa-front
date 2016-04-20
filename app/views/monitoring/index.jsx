import Immutable from "immutable";
import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {defaultTheme} from "lib/theme";
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
    deleteSensor,
    editSensor,
    favoriteSensor,
    filterSensors,
    monitorSensor,
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
            color: colors.iconDropdown
        },
        {
            label: "Guarda preferiti",
            key: "favoriteCharts",
            iconClass: "",
            color: colors.iconDropdown
        },
        {
            label: "Assegna",
            key: "assign",
            iconClass: "map",
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
        deleteSensor: PropTypes.func.isRequired,
        editSensor: PropTypes.func.isRequired,
        favoriteSensor: PropTypes.func.isRequired,
        filterSensors: PropTypes.func.isRequired,
        monitorSensor: PropTypes.func.isRequired,
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
        return this.props.collections.get("sensors") || Immutable.Map();
    },
    getDeleteSensor: function (id) {
        return () => {
            this.props.deleteSensor(id);
        };
    },
    getFavoriteSensor: function (id) {
        return () => {
            this.props.favoriteSensor(id);
        };
    },
    getMonitorSensor: function (id) {
        return () => {
            this.props.monitorSensor(id);
        };
    },
    getSensorFields: function () {
        const selected = this.props.sensorsState.selectedSensors;
        if (this.state.editSensor && selected.length == 1) {
            var fields = selected[0].toJS();
            fields.name = (fields.name ? fields.name : fields["_id"]);
            // TODO initial value for tag.
            fields.tags = [];
            return fields;
        } else {
            //TODO find how to delete initial values...
            return {
                name: "",
                description: "",
                unitOfMeasurement: "",
                siteRef: "",
                clientRef: "",
                tags: []
            };
        }
    },
    openModal: function (editSensor) {
        this.setState({
            editSensor: editSensor,
            showFullscreenModal: true
        });
    },
    closeModal: function () {
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
                    closeForm={this.closeModal}
                    currentSensor={this.props.sensorsState.current}
                    id={selected.length == 1 ? selected[0].get("_id") : null}
                    initialValues={this.getSensorFields()}
                    onSave={this.state.editSensor ? this.props.editSensor : this.props.addSensor}
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
                    <Button
                        style={buttonStyle(theme)}
                        disabled={selected.length < 1}
                        onClick={() => this.props.cloneSensors(selected)}
                    >
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"duplicate"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button
                        style={buttonStyle(theme)}
                        disabled={selected.length != 1}
                        onClick={() => this.openModal(true)}
                    >
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"edit"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button
                        style={buttonStyle(theme)}
                        disabled={selected.length < 1}
                        onClick={this.getDeleteSensor("todo")}
                    >
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"delete"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Popover
                        className="pull-right"
                        hideOnChange={true}
                        style={styles(theme).chartPopover}
                        title={
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"option"}
                                size={"32px"}
                                style={{lineHeight: "20px", verticalAlign: "middle"}}
                            />
                        }
                    >
                        <DropdownButton
                            allowedValues={advancedOptions(this.getTheme())}
                            getColor={R.prop("color")}
                            getIcon={R.prop("iconClass")}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            style={styles(theme).chartDropdownButton}
                        />
                    </Popover>
                </SectionToolbar>

                <MonitoringSearch
                    filterSensors={this.props.filterSensors}
                    style={{width: "25%", float: "left", marginTop: "2px", height: "calc(100vh - 120px)"}}
                />

                <MonitoringWorkArea
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    onClickAggregate={() => this.openModal(false)}
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
        deleteSensor: bindActionCreators(deleteSensor, dispatch),
        editSensor: bindActionCreators(editSensor, dispatch),
        favoriteSensor: bindActionCreators(favoriteSensor, dispatch),
        filterSensors: bindActionCreators(filterSensors, dispatch),
        monitorSensor: bindActionCreators(monitorSensor, dispatch),
        selectSensor: bindActionCreators(selectSensor, dispatch),
        selectSensorsToDraw: bindActionCreators(selectSensorsToDraw, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Monitoring);
