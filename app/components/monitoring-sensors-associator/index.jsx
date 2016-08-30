import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import {
    FullscreenModal,
    MonitoringSensorsSelector
} from "components";

import {getLoggedUser, isAdmin} from "lib/roles-utils";
import {getMonitoringSensors} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";

const stylesFunction = ({colors}) => ({
    modalTitleStyle: {
        color: colors.white,
        display: "inherit",
        marginBottom: "50px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "28px"
    }
});

var MonitoringSensorsAssociator = React.createClass({
    propTypes: {
        addSensorToWorkArea: PropTypes.func.isRequired,
        assignSensorsToUsers: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        collections: IPropTypes.map,
        filterSensors: PropTypes.func.isRequired,
        onHide: PropTypes.func,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        resetWorkAreaSensors: PropTypes.func.isRequired,
        sensorsState: PropTypes.object.isRequired,
        show: PropTypes.bool,
        usersState: PropTypes.object.isRequired,
        workAreaOldSensors: PropTypes.array
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            showConfirmModal: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getMonitoringSensors: function () {
        const {asteroid} = this.props;
        return getMonitoringSensors(this.props.collections.get("sensors"), isAdmin(asteroid), getLoggedUser(asteroid).get("sensors"));
    },
    renderCancelConfirm: function (theme) {
        return (
            <FullscreenModal
                onConfirm={() => {
                    this.setState({showConfirmModal: false});
                    this.props.onHide();
                }}
                onHide={() => this.setState({showConfirmModal: false})}
                renderConfirmButton={true}
                show={this.state.showConfirmModal}
            >
                <div style={{textAlign: "center"}}>
                    <div>
                        <label style={stylesFunction(theme).modalTitleStyle}>
                            {"Sei sicuro di voler annullare l'operazione di assegnazione?"}
                        </label>
                    </div>
                </div>
            </FullscreenModal>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <FullscreenModal
                    backgroundColor={theme.colors.backgroundModal}
                    onHide={() => this.setState({showConfirmModal: true})}
                    renderConfirmButton={false}
                    show={this.props.show}
                    title={"Assegna sensori all'utente"}
                >
                    <MonitoringSensorsSelector
                        addSensorToWorkArea={this.props.addSensorToWorkArea}
                        filterSensors={this.props.filterSensors}
                        removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                        searchButton={{
                            label: "ASSEGNA",
                            onClick: () => {
                                this.props.assignSensorsToUsers(this.props.usersState.selectedUsers, this.props.sensorsState.workAreaSensors);
                                this.props.onHide();
                            }
                        }}
                        sensors={this.getMonitoringSensors()}
                        sensorsState={this.props.sensorsState}
                        workAreaInstructions={"Trascina in questo spazio i sensori che vuoi assegnare"}
                        workAreaMessage={"Item nuovi a sfondo rosa, item già assegnati a sfondo nero:"}
                        workAreaOldSensors={this.props.workAreaOldSensors}
                    />
                </FullscreenModal>
                {this.renderCancelConfirm(theme)}
            </div>
        );
    }
});

module.exports = MonitoringSensorsAssociator;