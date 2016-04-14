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
    CollectionItemList,
    DropdownButton,
    Icon,
    MonitoringSearch,
    MonitoringSensorRow,
    Popover,
    SectionToolbar,
    SensorForm
} from "components";
import {
    addItemToFormula,
    addSensor,
    cloneSensors,
    deleteSensor,
    editSensor,
    favoriteSensor,
    filterSensors,
    monitorSensor,
    selectSensor
} from "actions/sensors";

const hoverStyle = ({colors}) => ({
    backgroundColor: colors.greyBorder
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
    margin: "10px auto 50px auto",
    borderRadius: "30px",
    cursor: "pointer",
    textAlign: "center"
});

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
        selected: PropTypes.array
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
    getAllSensors: function () {
        return this.props.collections.get("sensors") || Immutable.Map();
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
    renderSensorList: function (element, elementId) {
        let found = R.find((it) => {
            return it.get("_id") === elementId;
        })(this.props.selected) != null;
        return (
            <MonitoringSensorRow
                isSelected={found}
                onClickSelect={this.props.selectSensor}
                sensor={element}
                sensorId={elementId}
            />
        );
    },
    render: function () {
        let sensors = this.getAllSensors();
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

                <div style={{float: "left", width: "75%", padding: "10px 10px 0px 20px"}}>
                    <label style={{width: "100%", color: theme.colors.navText, textAlign: "center"}}>
                        {"Seleziona alcuni sensori per visualizzare il grafico o per creare un nuovo sensore"}
                    </label>
                    <div
                        style={{
                            color: "white",
                            borderRadius: "20px",
                            height: "400px",
                            overflow: "hidden",
                            border: "1px solid " + theme.colors.borderContentModal,
                            background: theme.colors.backgroundContentModal
                        }}
                    >
                        <div style={{
                            height: "100%",
                            overflow: "auto",
                            borderRadius: "18px"
                        }}
                        >
                            <CollectionItemList
                                collections={sensors}
                                headerComponent={this.renderSensorList}
                                hover={true}
                                hoverStyle={hoverStyle(this.getTheme())}
                                initialVisibleRow={6}
                                lazyLoadButtonStyle={lazyLoadButtonStyle(this.getTheme())}
                                lazyLoadLabel={"Carica altri"}
                            />
                        </div>
                    </div>

                    {this.renderSensorForm()}

                    <div
                        style={{
                            border: "1px solid " + theme.colors.borderContentModal,
                            borderRadius: "20px",
                            background: theme.colors.backgroundContentModal,
                            marginTop: "40px",
                            minHeight: "200px",
                            overflow: "auto",
                            padding: "20px 10px",
                            verticalAlign: "middle"
                        }}
                    >
                        <label style={{width: "100%", color: theme.colors.navText, textAlign: "center"}}>
                            {"Trascina in questo spazio i sensori che vuoi graficare"}
                        </label>
                    </div>

                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        collections: state.collections,
        currentSensor: state.sensors.current,
        selected: state.sensors.selectedSensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addItemToFormula: bindActionCreators(addItemToFormula, dispatch),
        addSensor: bindActionCreators(addSensor, dispatch),
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
