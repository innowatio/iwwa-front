import React, {PropTypes} from "react";
import R from "ramda";
import {DragDropContext} from "react-dnd";
// import {default as TouchBackend} from "react-dnd-touch-backend";
import HTML5Backend from "react-dnd-html5-backend";
import IPropTypes from "react-immutable-proptypes";

import {defaultTheme} from "lib/theme";

import {CollectionItemList, MonitoringSensorRow, SensorsDropArea} from "components";

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

var MonitoringWorkArea = React.createClass({
    propTypes: {
        addSensorToWorkArea: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selected: PropTypes.array,
        sensors: IPropTypes.map.isRequired,
        workAreaSensors: PropTypes.array
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
        const theme = this.getTheme();
        return (
            <div style={{float: "left", width: "75%", padding: "10px 10px 0px 20px"}}>
                <label style={{width: "100%", color: theme.colors.navText, textAlign: "center"}}>
                    {"Seleziona alcuni sensori per visualizzare il grafico o per creare un nuovo sensore"}
                </label>
                <div style={{
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
                            collections={this.props.sensors}
                            headerComponent={this.renderSensorList}
                            hover={true}
                            hoverStyle={hoverStyle(theme)}
                            initialVisibleRow={6}
                            lazyLoadButtonStyle={lazyLoadButtonStyle(theme)}
                            lazyLoadLabel={"Carica altri"}
                        />
                    </div>
                </div>
                
                <SensorsDropArea
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    sensors={this.props.workAreaSensors}
                />
                
            </div>
        );
    }
});

// module.exports = DragDropContext(TouchBackend({enableMouseEvents: true}))(MonitoringWorkArea);
module.exports = DragDropContext(HTML5Backend)(MonitoringWorkArea);