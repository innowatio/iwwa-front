import Immutable from "immutable";
import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";

import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles_restyling";
import {getKeyFromCollection} from "lib/collection-utils";
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
    addSensor,
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
        addSensor: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        cloneSensors: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
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
    getSensorsColumns: function () {
        const theme = this.getTheme();
        return [
            {
                key: "_id",
                style: function () {
                    return {
                        borderRight: "solid 1px grey",
                        width: "10%",
                        height: "100%",
                        textAlign: "left"
                    };
                }
            },
            {
                key: "tag",
                style: function () {
                    return {
                        width: "80%",
                        height: "100%",
                        padding: "3px 0px 0px 5px",
                        textAlign: "left"
                    };
                },
                valueFormatter: () => (
                    <div>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"tag"}
                            size={"27px"}
                        />
                    </div>
                )
            },
            {
                key: "info",
                valueFormatter: () => (
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"info"}
                        size={"27px"}
                    />
                )
            },
            {
                key: "chart",
                style: function () {
                    return {
                        backgroundColor: "grey"
                    };
                },
                valueFormatter: () => (
                    <Link to={"/monitoring/chart/"}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"chart"}
                            size={"27px"}
                        />
                    </Link>
                )
            },
            {
                key: "",
                valueFormatter: () => (
                    <div />
                )
            }
        ];
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
                    closeForm={this.closeModal}
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
        return (
            <MonitoringSensorRow
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
                    style={{width: "25%", float: "left", marginTop: "2px", minHeight: "782px"}}
                />

                <div style={{float: "left", width: "75%", textAlign: "center", padding: "10px 10px 0px 20px"}}>
                    <label style={{color: theme.colors.navText}}>
                        {"Seleziona alcuni sensori per visualizzare il grafico o per creare un nuovo sensore"}
                    </label>
                    <div
                        style={{
                            color: "white",
                            border: "grey solid 1px",
                            borderRadius: "30px",
                            background: theme.colors.backgroundContentModal,
                            padding: 0}}
                    >
                        <CollectionItemList
                            collections={sensors}
                            headerComponent={this.renderSensorList}
                        />
                        <label style={{color: theme.colors.navText, padding: "20px", paddingRight: "50px"}}>
                            {"Seleziona tutti"}
                        </label>
                        <label style={{color: theme.colors.navText, padding: "20px"}}>
                            {"Carica tutti"}
                        </label>

                    </div>

                    {this.renderSensorForm()}

                    <div
                        style={{
                            border: "grey solid 1px",
                            borderRadius: "30px",
                            background: theme.colors.backgroundContentModal,
                            marginTop: "50px",
                            minHeight: "300px",
                            overflow: "auto",
                            padding: 0,
                            verticalAlign: "middle"
                        }}
                    >
                        <label style={{color: theme.colors.navText}}>
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
        selected: state.sensors.selectedSensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
