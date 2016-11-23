import Immutable from "immutable";
import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as bootstrap from "react-bootstrap";

import {
    Button,
    ConfirmModal,
    CollectionItemList,
    DeleteWithConfirmButton,
    FullscreenModal,
    Icon,
    MonitoringSensorsAssociator,
    NewUserModal,
    SearchableDraggableModal,
    SectionToolbar,
    UserRolesAssociator,
    UserRow
} from "components";

import {getDragDropContext} from "lib/dnd-utils";
import {hasRole, MANAGE_USERS, ASSIGN_SENSORS, ASSIGN_GROUPS, CREATE_GROUPS} from "lib/roles-utils";
import {defaultTheme} from "lib/theme";
import {getChildren, getUsername, geUsersForManagement, isLoggedUser} from "lib/users-utils";

import {
    addSensorToWorkArea,
    filterSensors,
    removeSensorFromWorkArea,
    resetWorkAreaSensors,
    selectSensor
} from "actions/sensors";

import {
    addRole,
    assignGroupsToUsers,
    assignSensorsToUsers,
    assignSitesToUsers,
    changeActiveStatus,
    cloneUsers,
    deleteUsers,
    moveUser,
    removeRole,
    resetRolesAndGroups,
    saveAndAssignGroupToUsers,
    selectUser,
    selectUserToClone,
    toggleClone,
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

const stylesFunction = ({colors}, active) => ({
    buttonIconStyle: {
        backgroundColor: active ? colors.buttonPrimary : colors.primary,
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
    buttonBiggerIconStyle: {
        border: "0px",
        borderRadius: "100%",
        height: "68px",
        width: "68px",
        padding: "0px",
        textAlign: "center",
        margin: "0px 10px"
    },
    buttonBiggerIcon: {
        lineHeight: "25px",
        verticalAlign: "middle"
    },
    listItems: {
        height: "auto",
        verticalAlign: "middle",
        lineHeight: "50px",
        minHeight: "50px",
        cursor: "pointer",
        fontSize: "16px"
    }
});

var Users = React.createClass({
    propTypes: {
        addRole: PropTypes.func.isRequired,
        addSensorToWorkArea: PropTypes.func.isRequired,
        assignGroupsToUsers: PropTypes.func.isRequired,
        assignSensorsToUsers: PropTypes.func.isRequired,
        assignSitesToUsers: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeActiveStatus: PropTypes.func.isRequired,
        cloneUsers: PropTypes.func.isRequired,
        collections: IPropTypes.map,
        deleteUsers: PropTypes.func.isRequired,
        filterSensors: PropTypes.func.isRequired,
        moveUser: PropTypes.func.isRequired,
        removeRole: PropTypes.func.isRequired,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        resetRolesAndGroups: PropTypes.func.isRequired,
        resetWorkAreaSensors: PropTypes.func.isRequired,
        saveAndAssignGroupToUsers: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selectUser: PropTypes.func.isRequired,
        selectUserToClone: PropTypes.func.isRequired,
        sensorsState: PropTypes.object.isRequired,
        toggleClone: PropTypes.func.isRequired,
        toggleGroup: PropTypes.func.isRequired,
        usersState: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            showCloneMessage: false,
            showSitesAssociator: false,
            showSensorsAssociator: false,
            showRolesAssociator: false
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
        this.props.asteroid.subscribe("groups");
        this.props.asteroid.subscribe("roles");
    },
    getClickFunction: function (iconName) {
        switch (iconName) {
            case "map":
                this.setState({
                    showSitesAssociator: true
                });
                break;
            case "gauge":
                this.openSensorsModal();
                break;
            case "user-functions":
                this.openUserRolesModal();
                break;
            case "clone":
                break;
            case "add":
                this.setState({showCreateUserModal: true});
                break;
            default:
                break;
        }
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
    onCloneClick: function () {
        this.props.toggleClone();
        this.setState({showCloneMessage: true});
    },
    closeMessageModal: function () {
        this.setState({showCloneMessage: false});
    },
    openSensorsModal: function () {
        this.resetAndOpenModal(true);
        const userSensors = this.getUserSensors();
        if (userSensors) {
            userSensors.forEach(sensor => this.props.addSensorToWorkArea(sensor));
        }
    },
    openUserRolesModal: function () {
        this.setState({showRolesAssociator: true});
        const user = this.props.usersState.selectedUsers.length == 1 && this.props.usersState.selectedUsers[0];
        if (user && user.get("groups")) {
            user.get("groups").forEach(group => this.props.toggleGroup(group));
        }
    },
    resetAndOpenModal: function (open) {
        this.props.resetWorkAreaSensors();
        this.setState({showSensorsAssociator: open});
    },
    getUserSensors: function () {
        const user = this.props.usersState.selectedUsers.length == 1 && this.props.usersState.selectedUsers[0];
        if (user && user.get("sensors")) {
            return user.get("sensors");
        }
    },
    getIsSelectedFunc: function (selectedField) {
        return userId => {
            return R.find(it => {
                return it.get("_id") === userId;
            })(this.props.usersState[selectedField]) != null;
        };
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
    hideUserRolesAssociator: function () {
        this.props.resetRolesAndGroups();
        this.setState({showRolesAssociator: false});
    },
    isLoggedUserSelected: function () {
        const {selectedUsers} = this.props.usersState;
        return selectedUsers.some(user => isLoggedUser(this.props.asteroid, user));
    },
    renderUserList: function (user) {
        const theme = this.getTheme();
        return (
            <div style={stylesFunction(theme).listItems}>
                <UserRow
                    asteroid={this.props.asteroid}
                    getChildren={userId => getChildren(userId, this.getAllUsers())}
                    indent={0}
                    isSelected={this.getIsSelectedFunc("selectedUsers")}
                    isSelectedToClone={this.getIsSelectedFunc("selectedUsersToClone")}
                    moveUser={this.props.moveUser}
                    onChangeActiveStatus={this.props.changeActiveStatus}
                    onSelect={this.props.usersState.cloneMode ? this.props.selectUserToClone : this.props.selectUser}
                    user={user}
                />
            </div>
        );
    },
    renderCloneMessageModal: function () {
        const theme = this.getTheme();
        return (
            <FullscreenModal
                show={this.state.showCloneMessage}
                onEntered={() => setTimeout(this.closeMessageModal, 2500)}
                onHide={this.closeMessageModal}
            >
                <div style={{
                    padding: "150px",
                    textAlign: "center",
                    color: theme.colors.white,
                    fontSize: "40px"
                }}>
                    {"Seleziona gli utenti che devono ereditare le stesse caratteristiche (sensori e funzioni)"}
                </div>
            </FullscreenModal>
        );
    },
    renderBiggerButton: function (tooltip, iconName, disabled, permissions, onClickFunc, active) {
        const theme = this.getTheme();
        let hasPermisions = false;
        permissions.forEach(permissionRole => {
            hasPermisions = hasPermisions || hasRole(this.props.asteroid, permissionRole);
        });
        const backgroundStyle = {backgroundColor:
            (iconName === "clone" ? theme.colors.buttonPrimary : theme.colors.primary)
        };
        return hasPermisions ? (
            <bootstrap.OverlayTrigger
                overlay={<bootstrap.Tooltip id={tooltip} className="buttonClone">{tooltip}</bootstrap.Tooltip>}
                placement="top"
                rootClose={true}
            >
                <Button
                    disabled={disabled}
                    onClick={onClickFunc}
                    style={{
                        ...backgroundStyle,
                        ...stylesFunction(theme, active).buttonBiggerIconStyle
                    }}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={iconName}
                        size={"50px"}
                        style={stylesFunction(theme).buttonBiggerIcon}
                    />
                </Button>
            </bootstrap.OverlayTrigger>
        ) : null;
    },
    renderCloneButtons: function () {
        return this.props.usersState.cloneMode ? (
            <div style={{
                position: "absolute",
                width: "176px",
                margin: "0 0 0 85%",
                textAlign: "center",
                bottom: "-30px"
            }}>
                {this.renderBiggerButton(
                    "Conferma clonazione", "clone", false, [MANAGE_USERS],
                    () => this.props.cloneUsers(this.props.usersState.selectedUsers[0],
                    this.props.usersState.selectedUsersToClone))
                }
                {this.renderBiggerButton(
                    "Annulla clonazione", "delete", false, [MANAGE_USERS],
                    this.props.toggleClone)
                }
                {this.renderCloneMessageModal()}
            </div>
        ) : null;
    },
    renderButton: function (tooltip, iconName, disabled, permissions = [], onClickFunc, active) {
        const theme = this.getTheme();
        let hasPermisions = false;
        permissions.forEach(permissionRole => {
            hasPermisions = hasPermisions || hasRole(this.props.asteroid, permissionRole);
        });
        return hasPermisions ? (
            <bootstrap.OverlayTrigger
                overlay={<bootstrap.Tooltip id={tooltip} className="buttonInfo">{tooltip}</bootstrap.Tooltip>}
                placement="bottom"
                rootClose={true}
            >
                <Button
                    disabled={disabled}
                    onClick={onClickFunc}
                    style={stylesFunction(theme, active).buttonIconStyle}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={iconName}
                        size={"34px"}
                        style={stylesFunction(theme).buttonIcon}
                    />
                </Button>
            </bootstrap.OverlayTrigger>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        const {cloneMode, selectedUsers} = this.props.usersState;
        // TODO ripristinare quando presente la funzione
        // <div style={{float: "left", marginTop: "3px"}}>
        //     {this.renderButton("Crea utente", "add", cloneMode, [MANAGE_USERS], () => this.setState({showCreateUserModal: true}))}
        // </div>
        // TODO ripristinare quando presente la funzione
        // {this.renderButton("Assegna siti", "map", (this.props.usersState.selectedUsers.length < 1), [MANAGE_USERS])}
        const {
            assignSitesToUsers,
            usersState
        } = this.props;
        return (
            <div style={{position: "relative"}}>
                <SectionToolbar>
                    <div style={{float: "right", marginTop: "3px"}}>
                        {this.renderButton("Assegna sensori", "gauge", selectedUsers.length < 1 || cloneMode, [MANAGE_USERS, ASSIGN_SENSORS], this.openSensorsModal)}
                        {this.renderButton("Assegna funzioni", "user-functions", selectedUsers.length < 1 || cloneMode, [MANAGE_USERS, ASSIGN_GROUPS, CREATE_GROUPS], this.openUserRolesModal)}
                        {this.renderButton("Clona", "clone", selectedUsers.length !== 1 || cloneMode, [MANAGE_USERS], this.onCloneClick, cloneMode)}
                        {hasRole(this.props.asteroid, MANAGE_USERS) ?
                            <DeleteWithConfirmButton
                                disabled={selectedUsers.length < 1 || cloneMode || this.isLoggedUserSelected()}
                                onConfirm={() => this.props.deleteUsers(selectedUsers, this.getAllUsers())}
                            /> : null
                        }
                    </div>
                </SectionToolbar>
                <div className="table-user">
                    <div style={{
                        width: "98%",
                        height: "calc(100vh - 200px)",
                        position: "relative",
                        left: "1%",
                        overflow: "hidden",
                        borderRadius: "20px",
                        marginTop: "20px",
                        padding: "0px",
                        border: "1px solid " + theme.colors.borderUsersTable,
                        backgroundColor: theme.colors.backgroundUsersTable
                    }}>
                        <div style={{
                            overflow: "auto",
                            width: "100%",
                            height: "100%",
                            paddingRight: "35px",
                            margin: "0px 20px"
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
                </div>
                <MonitoringSensorsAssociator
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    assignSensorsToUsers={this.props.assignSensorsToUsers}
                    asteroid={this.props.asteroid}
                    collections={this.props.collections}
                    filterSensors={this.props.filterSensors}
                    onHide={this.closeSensorsModal}
                    removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                    selectSensor={this.props.selectSensor}
                    sensorsState={this.props.sensorsState}
                    show={this.state.showSensorsAssociator}
                    usersState={this.props.usersState}
                    workAreaOldSensors={this.getUserSensors()}
                />
                <UserRolesAssociator
                    addRole={this.props.addRole}
                    assignGroupsToUsers={this.props.assignGroupsToUsers}
                    asteroid={this.props.asteroid}
                    collections={this.props.collections}
                    onGroupSelect={this.props.toggleGroup}
                    onHide={this.hideUserRolesAssociator}
                    removeRole={this.props.removeRole}
                    saveAndAssignGroupToUsers={this.props.saveAndAssignGroupToUsers}
                    show={this.state.showRolesAssociator}
                    usersState={this.props.usersState}
                />
                <NewUserModal
                    onConfirm={() => this.setState({showCreateConfirmModal: true})}
                    onHide={() => this.setState({showCreateUserModal: false})}
                    show={this.state.showCreateUserModal}
                />
                <ConfirmModal
                    onConfirm={() => this.setState({showCreateConfirmModal: false})}
                    onHide={() => this.setState({showCreateConfirmModal: false, showCreateUserModal: false})}
                    iconType={"flag"}
                    renderFooter={false}
                    show={this.state.showCreateConfirmModal}
                    title={"UNA EMAIL È STATA INVIATA AL NUOVO UTENTE PER CONFERMARE LA REGISTRAZIONE"}
                />
                {this.renderCloneButtons()}
                <SearchableDraggableModal
                    collection={this.props.collections.get("sites").map(x => {
                        return {
                            ...x.toJS(),
                            id: x.get("_id")
                        };
                    }).toArray()}
                    initialsItems={R.uniq(R.flatten(usersState.selectedUsers.map(user => {
                        const userSites = user.get("sites") || [];
                        const mappedSites = userSites.map(site => {
                            return {
                                id: site
                            };
                        });
                        return [...mappedSites];
                    }))).filter(x => x)}
                    onHide={() => {
                        this.setState({
                            showSitesAssociator: false
                        });
                    }}
                    onConfirm={(selectedItems) => {
                        this.setState({
                            showSitesAssociator: false
                        });
                        assignSitesToUsers(usersState.selectedUsers, selectedItems.map(x => x.id));
                    }}
                    searchFields={[{
                        key: "id",
                        title: "Ricerca per sito"
                    }, {
                        key: "businessType",
                        title: "Ricerca per tipo di sito"
                    }, {
                        key: "employees",
                        title: "Ricerca per numero di dipendenti"
                    }]}
                    show={this.state.showSitesAssociator}
                    title={"Assegna siti all'utente"}
                />
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        collections: state.collections,
        sensorsState: state.sensors,
        usersState: state.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addRole: bindActionCreators(addRole, dispatch),
        addSensorToWorkArea: bindActionCreators(addSensorToWorkArea, dispatch),
        assignGroupsToUsers: bindActionCreators(assignGroupsToUsers, dispatch),
        assignSensorsToUsers: bindActionCreators(assignSensorsToUsers, dispatch),
        assignSitesToUsers: bindActionCreators(assignSitesToUsers, dispatch),
        changeActiveStatus: bindActionCreators(changeActiveStatus, dispatch),
        cloneUsers: bindActionCreators(cloneUsers, dispatch),
        deleteUsers: bindActionCreators(deleteUsers, dispatch),
        filterSensors: bindActionCreators(filterSensors, dispatch),
        moveUser: bindActionCreators(moveUser, dispatch),
        removeRole: bindActionCreators(removeRole, dispatch),
        removeSensorFromWorkArea: bindActionCreators(removeSensorFromWorkArea, dispatch),
        resetRolesAndGroups: bindActionCreators(resetRolesAndGroups, dispatch),
        resetWorkAreaSensors: bindActionCreators(resetWorkAreaSensors, dispatch),
        saveAndAssignGroupToUsers: bindActionCreators(saveAndAssignGroupToUsers, dispatch),
        selectSensor: bindActionCreators(selectSensor, dispatch),
        selectUser: bindActionCreators(selectUser, dispatch),
        selectUserToClone: bindActionCreators(selectUserToClone, dispatch),
        toggleClone: bindActionCreators(toggleClone, dispatch),
        toggleGroup: bindActionCreators(toggleGroup, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(getDragDropContext(Users));
