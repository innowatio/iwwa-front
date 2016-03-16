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

import {Button, CollectionElementsTable, DropdownButton, Icon,
    MonitoringSearch, Popover, SectionToolbar, SensorForm} from "components";

import {addSensor, cloneSensor, combineSensor, deleteSensor, editSensor, favoriteSensor, filterSensors, monitorSensor, selectSensor} from "actions/sensors";

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
        cloneSensor: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        combineSensor: PropTypes.func.isRequired,
        deleteSensor: PropTypes.func.isRequired,
        editSensor: PropTypes.func.isRequired,
        favoriteSensor: PropTypes.func.isRequired,
        filterSensors: PropTypes.func.isRequired,
        monitorSensor: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selected: PropTypes.array,
        sensors: PropTypes.array.isRequired
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
        this.subscribeToSensorsData(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.subscribeToSensorsData(props);
    },
    subscribeToSensorsData: function (props) {
        console.log(props.selected);
        props.selected[0] && props.selected.forEach((sensorId) => {
            //TODO capire bene cosa va preso...
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                sensorId,
                "2015-01-01",
                "2016-03-01",
                "reading",
                "activeEnergy"
            );
        });
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getDeleteSensor: function (id) {
        return () => {
            this.props.deleteSensor(id);
        };
    },
    getCloneSensor: function (id) {
        return () => {
            this.props.cloneSensor(id);
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
        let found = R.find(R.propEq("_id", this.props.selected[0]))(this.props.sensors);
        return (found ? found.fields : null);
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
    render: function () {
        let sensors = this.props.collections.get("sensors") || Immutable.Map();
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar>
                    <Button style={buttonStyle(theme)} disabled={this.props.selected.length > 0} onClick={this.openModal}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"add"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button style={buttonStyle(theme)} disabled={this.props.selected.length < 2} onClick={this.getCloneSensor("todo")}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"duplicate"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button style={buttonStyle(theme)} disabled={this.props.selected.length != 1} onClick={this.openModal}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"edit"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button style={buttonStyle(theme)} disabled={this.props.selected.length < 1} onClick={this.getDeleteSensor("todo")}>
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
                                icon={"setting"}
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
                    style={{width: "25%", float: "left", marginTop: "2px", minHeight: "714px"}}
                />

                <div style={{float: "left", width: "75%", textAlign: "center", padding: "10px 10px 0px 20px"}}>
                    <label style={{color: theme.colors.navText}}>
                        {"Seleziona alcuni sensori per visualizzare il grafico o per creare un nuovo sensore"}
                    </label>
                    <CollectionElementsTable
                        collection={sensors}
                        columns={this.getSensorsColumns()}
                        getKey={getKeyFromCollection}
                        hover={true}
                        onRowClick={this.props.selectSensor}
                        style={{color: "white", border: "grey solid 1px", borderRadius: "30px", background: theme.colors.backgroundContentModal, maxHeight: "332px", overflow: "auto", padding: 0}}
                        width={"60%"}
                    />

                    <SensorForm
                        closeForm={this.closeModal}
                        id={this.props.selected.length == 1 ? this.props.selected[0] : null}
                        initialValues={this.getSensorFields()}
                        onSave={this.props.selected.length == 1 ? this.props.editSensor : this.props.addSensor}
                        showFullscreenModal={this.state.showFullscreenModal}
                        title={this.props.selected.length == 1 ? "MODIFICA SENSORE" : "CREA NUOVO SENSORE"}
                    />

                    <div style={{border: "grey solid 1px", borderRadius: "30px", background: theme.colors.backgroundContentModal, marginTop: "50px", minHeight: "300px", overflow: "auto", padding: 0, verticalAlign: "middle"}}>
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
        selected: state.sensors.selectedSensors,
        sensors: state.sensors.allSensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSensor: bindActionCreators(addSensor, dispatch),
        cloneSensor: bindActionCreators(cloneSensor, dispatch),
        combineSensor: bindActionCreators(combineSensor, dispatch),
        deleteSensor: bindActionCreators(deleteSensor, dispatch),
        editSensor: bindActionCreators(editSensor, dispatch),
        favoriteSensor: bindActionCreators(favoriteSensor, dispatch),
        filterSensors: bindActionCreators(filterSensors, dispatch),
        monitorSensor: bindActionCreators(monitorSensor, dispatch),
        selectSensor: bindActionCreators(selectSensor, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Monitoring);