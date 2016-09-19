import Radium from "radium";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import {FullscreenModal} from "components";
import {Col, Tab, Tabs} from "react-bootstrap";

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
        assignRoleToUsers: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        collections: IPropTypes.map,
        onGroupSelect: PropTypes.func,
        onHide: PropTypes.func,
        show: PropTypes.bool,
        usersState: PropTypes.object.isRequired
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
    renderRoleTab: function () {
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
                    {getGroupsRoles(this.props.usersState.selectedGroups, this.props.asteroid).map(roleName => {
                        return (
                            <div>
                                {roleName}
                            </div>
                        );
                    })}
                </Col>
            </Tab>
        );
    },
    renderFunctionsTab: function () {
        return (
            <Tab eventKey={2} title="Assegnazione funzioni manuale">
                <Col md={6}>
                    {"funzioni assegnate"}
                </Col>
                <Col md={6}>
                    {this.props.collections.get("roles").map(group => {
                        return (
                            <div>
                                {group.get("name")}
                            </div>
                        );
                    })}
                </Col>
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
                            {this.renderRoleTab()}
                            {this.renderFunctionsTab()}
                        </Tabs>
                    </div>
                </FullscreenModal>
                {this.renderCancelConfirm(theme)}
            </div>
        );
    }
});

module.exports = UserRolesAssociator;