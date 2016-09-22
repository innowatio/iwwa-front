import Radium from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import {Button, FullscreenModal} from "components";
import DraggableRole from "./draggable-role";
import {Col, Clearfix, FormControl, Row, Tab, Tabs} from "react-bootstrap";
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
                <Row>
                    <Col xs={6} style={{marginTop: "10px"}}>
                        {this.props.collections.get("groups").map(group => {
                            return (
                                <Button
                                    className="hoverButton"
                                    style={{
                                        color: theme.colors.white,
                                        textTransform: "uppercase",
                                        fontSize: "16px",
                                        fontWeight: "300",
                                        padding: "10px 20px",
                                        backgroundColor: theme.colors.transparent,
                                        border: "0px"
                                    }}
                                    onClick={() => this.props.onGroupSelect(group.get("name"))}
                                >
                                    <Radium.Style
                                        rules={{
                                            "": {
                                                display: "block"
                                            },
                                            ":hover": {
                                                color: theme.colors.buttonPrimary + "!important"
                                            }
                                        }}
                                        scopeSelector={".hoverButton"}
                                    />
                                    {group.get("name")}
                                </Button>
                            );
                        })}
                    </Col>
                    <Col xs={6} style={{marginTop: "10px"}}>
                        {getGroupsRoles(usersState.selectedGroups, this.props.asteroid).map(roleName => {
                            return (
                                <div style={{
                                    color: theme.colors.white,
                                    textTransform: "uppercase",
                                    fontSize: "16px",
                                    fontWeight: "300",
                                    padding: "10px 20px"
                                }}>
                                    {roleName}
                                </div>
                            );
                        })}
                    </Col>
                    <Clearfix />
                </Row>
                <Row style={{textAlign: "center"}}>
                    <Button
                        onClick={() => this.props.assignGroupsToUsers(usersState.selectedUsers, usersState.selectedGroups)}
                        style={{
                            textAlign: "center",
                            color: theme.colors.white,
                            borderRadius: "30px",
                            fontWeight: "300",
                            width: "220px",
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
                </Row>
            </Tab>
        );
    },
    renderFunctionsTab: function (theme) {
        return (
            <Tab eventKey={2} title="Assegnazione funzioni manuale">
                <Row style={{margin: "20px"}}>
                    <Col md={6} style={{marginTop: "10px", color: theme.colors.white, fontWeight: 300}}>
                        <p style={{fontSize: "18px"}}>{"FUNZIONI ASSEGNATE"}</p>
                        <RoleDropArea
                            addRole={this.props.addRole}
                            removeRole={this.props.removeRole}
                            roles={this.props.usersState.selectedRoles}
                        />

                    </Col>
                    <Col
                        md={6}
                        style={{
                            borderLeft: "1px solid " + theme.colors.white,
                            marginTop: "10px",
                            color: theme.colors.white,
                            fontWeight: 300
                        }}
                    >
                        <p style={{fontSize: "18px"}}>{"FUNZIONI DISPONIBILI"}</p>
                        <div style={{
                            color: theme.colors.white,
                            fontSize: "14px",
                            fontWeight: "300"
                        }}>
                            {this.props.collections.get("roles").map(role =>
                                <DraggableRole
                                    style={{
                                        padding: "5px 20px",
                                        border: "1px solid " + theme.colors.white,
                                        borderRadius: "100%"
                                    }}
                                    role={role}
                                />
                            )}
                        </div>
                    </Col>
                    <Clearfix />
                </Row>
                <Row style={{textAlign: "center", margin: "20px 0px"}}>
                    <Button
                        onClick={() => this.setState({showSaveGroupModal: true})}
                        style={{
                            color: theme.colors.white,
                            borderRadius: "30px",
                            fontWeight: "300",
                            width: "220px",
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
                </Row>
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
                    title={"assegna funzioni all'utente"}
                >
                    <div style={{margin: "0px 5% 0px 5%"}} className="modal-container">
                        <Radium.Style
                            rules={styles(theme).formFields}
                            scopeSelector={".modal-container"}
                        />
                        <Tabs className="tabs" defaultActiveKey={1}>
                            <Radium.Style
                                rules={{
                                    "ul": {
                                        border: "0px",
                                        height: "55px",
                                        backgroundColor: theme.colors.transparent,
                                        borderBottom: "1px solid " + theme.colors.white
                                    },
                                    "ul li": {
                                        color: theme.colors.white,
                                        margin: "0 1.5%"
                                    },
                                    "ul li a": {
                                        height: "55px",
                                        lineHeight: "55px",
                                        fontSize: "17px",
                                        textTransform: "uppercase",
                                        padding: "0px 4px"
                                    },
                                    ".nav-tabs > li > a": {
                                        height: "44px",
                                        color: theme.colors.white,
                                        border: "0px",
                                        outline: "none",
                                        borderBottom: "3px solid" + theme.colors.transparent
                                    },
                                    ".nav-tabs > li:hover > a:hover": {
                                        fontWeight: "400"
                                    },
                                    ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
                                        height: "44px",
                                        fontSize: "17px",
                                        fontWeight: "500",
                                        color: theme.colors.white,
                                        border: "0px",
                                        borderRadius: "0px",
                                        outline: "none",
                                        backgroundColor: theme.colors.transparent,
                                        borderBottom: "3px solid" + theme.colors.buttonPrimary,
                                        outlineStyle: "none",
                                        outlineWidth: "0px"
                                    },
                                    ".nav > li > a:hover, .nav > li > a:focus": {
                                        background: theme.colors.transparent
                                    }
                                }}
                                scopeSelector=".tabs"
                            />
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
