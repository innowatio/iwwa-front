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
        currentSensor: PropTypes.object,
        deleteSensor: PropTypes.func.isRequired,
        editSensor: PropTypes.func.isRequired,
        favoriteSensor: PropTypes.func.isRequired,
        filterSensors: PropTypes.func.isRequired,
        monitorSensor: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selected: PropTypes.array,
        workAreaSensors: PropTypes.array 
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
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
        if (this.props.selected.length == 1) {
            var fields = this.props.selected[0].toJS();
            fields.name = (fields.name ? fields.name : fields["_id"]);
            // TODO initial value for tag.
            fields.tags = [];
            return fields;
        }
    },
    openModal: function () {
        this.setState({
            showFullscreenModal: true
        });
    },
    closeModal: function () {
        this.setState({
            showFullscreenModal: false
        });
    },
    renderSensorForm: function () {
        if (this.props.selected.length > 0) {
            return (
                <SensorForm
                    addItemToFormula={this.props.addItemToFormula}
                    closeForm={this.closeModal}
                    currentSensor={this.props.currentSensor}
                    id={this.props.selected.length == 1 ? this.props.selected[0].get("_id") : null}
                    initialValues={this.getSensorFields()}
                    onSave={this.props.selected.length == 1 ? this.props.editSensor : this.props.addSensor}
                    sensorsToAggregate={this.props.selected}
                    showFullscreenModal={this.state.showFullscreenModal}
                    title={this.props.selected.length == 1 ? "MODIFICA SENSORE" : "CREA NUOVO SENSORE"}
                />
            );
        }
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar>
                    <Button
                        style={buttonStyle(theme)}
                        disabled={this.props.selected.length < 1}
                        onClick={this.openModal}
                    >
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"add"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button
                        style={buttonStyle(theme)}
                        disabled={this.props.selected.length < 1}
                        onClick={() => this.props.cloneSensors(this.props.selected)}
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
                        disabled={this.props.selected.length != 1}
                        onClick={this.openModal}
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
                        disabled={this.props.selected.length < 1}
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
                    selectSensor={this.props.selectSensor}
                    selected={this.props.selected}
                    sensors={this.getAllSensors()}
                    workAreaSensors={this.props.workAreaSensors}
                />
                
                {this.renderSensorForm()}
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        collections: state.collections,
        currentSensor: state.sensors.current,
        selected: state.sensors.selectedSensors,
        workAreaSensors: state.sensors.workAreaSensors
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
        selectSensor: bindActionCreators(selectSensor, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Monitoring);
