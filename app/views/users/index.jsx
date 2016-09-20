import Immutable from "immutable";
import Radium from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    Button,
    CollectionItemList,
    DeleteWithConfirmButton,
    FullscreenModal,
    Icon,
    MonitoringSensorsAssociator,
    SectionToolbar,
    UserRolesAssociator,
    UserRow
} from "components";
import {FormControl} from "react-bootstrap";

import {getDragDropContext} from "lib/dnd-utils";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";
import {getChildren, getUsername, geUsersForManagement} from "lib/users-utils";

import {
    addSensorToWorkArea,
    filterSensors,
    removeSensorFromWorkArea,
    resetWorkAreaSensors
} from "actions/sensors";

import {
    addRole,
    assignSensorsToUsers,
    changeActiveStatus,
    deleteUsers,
    selectUser,
    toggleGroup
} from "actions/users";

const lazyLoadButtonStyle = ({colors}) => ({
    width: "230px",
    height: "45px",
    lineHeight: "43px",
    backgroundColor: colors.buttonPrimary,
    fontSize: "14px",
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "400",
    margin: "10px auto 40px auto",
    borderRadius: "30px",
    cursor: "pointer",
    textAlign: "center"
});

const stylesFunction = (theme) => ({
    buttonIconStyle: {
        backgroundColor: theme.colors.primary,
        border: "0px",
        borderRadius: "100%",
        height: "50px",
        width: "50px",
        padding: "0px",
        textAlign: "center",
        margin: "0px 5px"
    },
    buttonIcon: {
        lineHeight: "25px",
        verticalAlign: "middle"
    },
    listItems: {
        width: "100%",
        height: "auto",
        verticalAlign: "middle",
        lineHeight: "45px",
        minHeight: "50px",
        cursor: "pointer",
        fontSize: "16px",
        borderLeft: "3px solid " + theme.colors.borderSensorsTable
    }
});

var Users = React.createClass({
    propTypes: {
        addRole: PropTypes.func.isRequired,
        addSensorToWorkArea: PropTypes.func.isRequired,
        assignSensorsToUsers: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeActiveStatus: PropTypes.func.isRequired,
        collections: IPropTypes.map,
        deleteUsers: PropTypes.func.isRequired,
        filterSensors: PropTypes.func.isRequired,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        resetWorkAreaSensors: PropTypes.func.isRequired,
        selectUser: PropTypes.func.isRequired,
        sensorsState: PropTypes.object.isRequired,
        toggleGroup: PropTypes.func.isRequired,
        usersState: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            showSensorsAssociator: false,
            showRolesAssociator: false,
            showCreateUserModal: false
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
        this.props.asteroid.subscribe("users");
        this.props.asteroid.subscribe("groups");
        this.props.asteroid.subscribe("roles");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getAllUsers: function () {
        return this.props.collections.get("users") || Immutable.Map();
    },
    closeSensorsModal: function () {
        this.resetAndOpenModal(false);
    },
    openSensorsModal: function () {
        this.resetAndOpenModal(true);
        this.fillWorkAreaSensors();
    },
    resetAndOpenModal: function (open) {
        this.props.resetWorkAreaSensors();
        this.setState({
            showSensorsAssociator: open
        });
    },
    fillWorkAreaSensors: function () {
        const userSensors = this.getUserSensors();
        if (userSensors) {
            userSensors.forEach(sensor => this.props.addSensorToWorkArea(sensor));
        }
    },
    getUserSensors: function () {
        const user = this.props.usersState.selectedUsers.length == 1 && this.props.usersState.selectedUsers[0];
        if (user && user.get("sensors")) {
            return user.get("sensors");
        }
    },
    searchFilter: function (element, search) {
        const found = getUsername(element).toLowerCase().indexOf(search.toLowerCase()) >= 0;
        if (found) {
            return true;
        } else {
            const children = getChildren(element.get("_id"), this.getAllUsers());
            return children.some(child => this.searchFilter(child, search));
        }
    },
    sortByUsername: function (a, b, asc) {
        let aLabel = getUsername(a).toLowerCase();
        let bLabel = getUsername(b).toLowerCase();
        if (asc) {
            return aLabel > bLabel ? 1 : -1;
        }
        return aLabel > bLabel ? -1 : 1;
    },
    renderUserList: function (user) {
        const theme = this.getTheme();
        return (
            <div style={stylesFunction(theme).listItems}>
                <UserRow
                    getChildren={userId => getChildren(userId, this.getAllUsers())}
                    indent={1}
                    isSelected={userId => {
                        return R.find(it => {
                            return it.get("_id") === userId;
                        })(this.props.usersState.selectedUsers) != null;
                    }}
                    onChangeActiveStatus={this.props.changeActiveStatus}
                    onSelect={this.props.selectUser}
                    user={user}
                />
            </div>
        );
    },
    renderCreateUserModal: function (theme) {
        return (
            <FullscreenModal
                onHide={() => this.setState({showCreateUserModal: false})}
                renderConfirmButton={true}
                show={this.state.showCreateUserModal}
            >
                <form className="form-fields">
                    <Radium.Style
                        rules={styles(theme).formFields}
                        scopeSelector={".form-fields"}
                    />
                    <h3
                        className="text-center"
                        style={{
                            color: theme.colors.mainFontColor,
                            fontSize: "24px",
                            fontWeight: "400",
                            marginBottom: "20px",
                            textTransform: "uppercase",
                            paddingBottom: "20px",
                            borderBottom: "1px solid " + theme.colors.borderContentModal
                        }}
                    >
                        {"Crea nuovo utente"}
                    </h3>
                    <FormControl
                        type="email"
                        placeholder="Indirizzo email"
                        style={R.merge(styles(theme).inputLine, {
                            color: theme.colors.buttonPrimary,
                            padding: "20px",
                            margin: "5%",
                            width: "90%"
                        })}
                    />
                </form>
            </FullscreenModal>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar>
                    <div style={{float: "left", marginTop: "3px"}}>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            onClick={() => this.setState({showCreateUserModal: true})}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"add"}
                                size={"28px"}
                                style={stylesFunction(theme).buttonIcon}
                            />
                        </Button>
                    </div>
                    <div style={{float: "right", marginTop: "3px"}}>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={this.props.usersState.selectedUsers.length < 1}
                            onClick={this.openSensorsModal}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"gauge"}
                                size={"30px"}
                                style={stylesFunction(theme).buttonIcon}
                            />
                        </Button>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={this.props.usersState.selectedUsers.length < 1}
                            onClick={() => this.setState({showRolesAssociator: true})}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"user-functions"}
                                size={"34px"}
                                style={stylesFunction(theme).buttonIcon}
                            />
                        </Button>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"clone"}
                                size={"34px"}
                                style={stylesFunction(theme).buttonIcon}
                            />
                        </Button>
                        <DeleteWithConfirmButton
                            disabled={this.props.usersState.selectedUsers.length < 1}
                            onConfirm={() => this.props.deleteUsers(this.props.usersState.selectedUsers, this.getAllUsers())}
                        />
                    </div>
                </SectionToolbar>

                <div className="table-user">
                    <div style={{
                        width: "98%",
                        position: "relative",
                        left: "1%",
                        borderRadius: "20px",
                        marginTop: "20px",
                        padding: "5px 20px 20px 20px",
                        border: "1px solid " + theme.colors.borderUsersTable,
                        backgroundColor: theme.colors.backgroundUsersTable
                    }}>
                        <CollectionItemList
                            collections={geUsersForManagement(this.getAllUsers())}
                            filter={this.searchFilter}
                            headerComponent={this.renderUserList}
                            hover={true}
                            hoverStyle={{}}
                            initialVisibleRow={20}
                            lazyLoadButtonStyle={lazyLoadButtonStyle(theme)}
                            lazyLoadLabel={"Carica altri"}
                            showFilterInput={true}
                            sort={R.partialRight(this.sortByUsername, [true])}
                        />
                    </div>
                </div>
                <MonitoringSensorsAssociator
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    assignSensorsToUsers={this.props.assignSensorsToUsers}
                    asteroid={this.props.asteroid}
                    collections={this.props.collections}
                    filterSensors={this.props.filterSensors}
                    onHide={this.closeSensorsModal}
                    removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                    resetWorkAreaSensors={this.props.resetWorkAreaSensors}
                    sensorsState={this.props.sensorsState}
                    show={this.state.showSensorsAssociator}
                    usersState={this.props.usersState}
                    workAreaOldSensors={this.getUserSensors()}
                />
                <UserRolesAssociator
                    addRole={this.props.addRole}
                    asteroid={this.props.asteroid}
                    collections={this.props.collections}
                    onGroupSelect={this.props.toggleGroup}
                    onHide={() => this.setState({showRolesAssociator: false})}
                    show={this.state.showRolesAssociator}
                    usersState={this.props.usersState}
                />
                {this.renderCreateUserModal(theme)}
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        sensorsState: state.sensors,
        usersState: state.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addRole: bindActionCreators(addRole, dispatch),
        addSensorToWorkArea: bindActionCreators(addSensorToWorkArea, dispatch),
        assignSensorsToUsers: bindActionCreators(assignSensorsToUsers, dispatch),
        changeActiveStatus: bindActionCreators(changeActiveStatus, dispatch),
        deleteUsers: bindActionCreators(deleteUsers, dispatch),
        filterSensors: bindActionCreators(filterSensors, dispatch),
        removeSensorFromWorkArea: bindActionCreators(removeSensorFromWorkArea, dispatch),
        resetWorkAreaSensors: bindActionCreators(resetWorkAreaSensors, dispatch),
        selectUser: bindActionCreators(selectUser, dispatch),
        toggleGroup: bindActionCreators(toggleGroup, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(getDragDropContext(Users));
