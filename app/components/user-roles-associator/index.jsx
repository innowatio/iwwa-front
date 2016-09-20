import Radium from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import {Button, FullscreenModal} from "components";
import DraggableRole from "./draggable-role";
import {Col, FormControl, Tab, Tabs} from "react-bootstrap";
import RoleDropArea from "./role-drop-area";

import {getGroupsRoles} from "lib/roles-utils";
import {styles} from "lib/styles";
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

var UserRolesAssociator = React.createClass({
    propTypes: {
        addRole: PropTypes.func.isRequired,
        assignGroupsToUsers: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        collections: IPropTypes.map,
        onGroupSelect: PropTypes.func,
        onHide: PropTypes.func,
        removeRole: PropTypes.func.isRequired,
        saveAndAssignGroupToUsers: PropTypes.func.isRequired,
        show: PropTypes.bool,
        usersState: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            showConfirmModal: false,
            showSaveGroupModal: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
    renderSaveGroupModal: function (theme) {
        return (
            <FullscreenModal
                onConfirm={() => {
                    this.setState({showSaveGroupModal: false});
                    this.props.onHide();
                }}
                onHide={() => this.setState({showSaveGroupModal: false})}
                renderConfirmButton={true}
                show={this.state.showSaveGroupModal}
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
                        {"Nome profilo"}
                    </h3>
                    <FormControl
                        type="text"
                        placeholder="Assegna un nome a questo profilo"
                        style={R.merge(styles(theme).inputLine, {color: theme.colors.buttonPrimary})}
                    />
                </form>
            </FullscreenModal>
        );
    },
    renderRoleTab: function (theme) {
        const {usersState} = this.props;
        return (
            <Tab eventKey={1} title="Profili predefiniti">
                <Col md={6}>
                    {this.props.collections.get("groups").map(group => {
                        return (
                            <div onClick={() => this.props.onGroupSelect(group.get("name"))}>
                                {group.get("name")}
                            </div>
                        );
                    })}
                </Col>
                <Col md={6}>
                    {getGroupsRoles(usersState.selectedGroups, this.props.asteroid).map(roleName => {
                        return (
                            <div>
                                {roleName}
                            </div>
                        );
                    })}
                </Col>
                <Button
                    onClick={() => this.props.assignGroupsToUsers(usersState.selectedUsers, usersState.selectedGroups)}
                    style={{
                        color: theme.colors.white,
                        borderRadius: "30px",
                        fontWeight: "300",
                        width: "120px",
                        height: "45px",
                        lineHeight: "45px",
                        padding: "0px",
                        fontSize: "20px",
                        border: "0px",
                        backgroundColor: theme.colors.buttonPrimary
                    }}
                >
                    {"OK"}
                </Button>
            </Tab>
        );
    },
    renderFunctionsTab: function (theme) {
        return (
            <Tab eventKey={2} title="Assegnazione funzioni manuale">
                <Col md={6}>
                    <RoleDropArea
                        addRole={this.props.addRole}
                        removeRole={this.props.removeRole}
                        roles={this.props.usersState.selectedRoles}
                    />
                </Col>
                <Col md={6}>
                    {this.props.collections.get("roles").map(role => <DraggableRole role={role} />)}
                </Col>
                <Button
                    onClick={() => this.setState({showSaveGroupModal: true})}
                    style={{
                        color: theme.colors.white,
                        borderRadius: "30px",
                        fontWeight: "300",
                        width: "120px",
                        height: "45px",
                        lineHeight: "45px",
                        padding: "0px",
                        fontSize: "20px",
                        border: "0px",
                        backgroundColor: theme.colors.buttonPrimary
                    }}
                >
                    {"SALVA CON NOME"}
                </Button>
                {this.renderSaveGroupModal(theme)}
            </Tab>
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
                    title={"Assegna funzioni all'utente"}
                >
                    <div style={{margin: "0px 5% 0px 5%"}} className="modal-container">
                        <Radium.Style
                            rules={styles(theme).formFields}
                            scopeSelector={".modal-container"}
                        />
                        <Tabs defaultActiveKey={1}>
                            {this.renderRoleTab(theme)}
                            {this.renderFunctionsTab(theme)}
                        </Tabs>
                    </div>
                </FullscreenModal>
                {this.renderCancelConfirm(theme)}
            </div>
        );
    }
});

module.exports = UserRolesAssociator;