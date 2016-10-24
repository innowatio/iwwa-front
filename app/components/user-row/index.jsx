import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import DraggableUser from "./draggable-user";

import {ConfirmModal} from "components";

import {defaultTheme} from "lib/theme";
import {isConfirmedUser} from "lib/users-utils";

const styles = () => ({
    container: {
        width: "100%",
        height: "50px",
        margin: "0px",
        padding: "0px",
        display: "initial"
    }
});

var UserRow = React.createClass({
    propTypes: {
        asteroid: PropTypes.object,
        getChildren: PropTypes.func,
        indent: PropTypes.number.isRequired,
        isSelected: PropTypes.func,
        isSelectedToClone: PropTypes.func,
        moveUser: PropTypes.func,
        onChangeActiveStatus: PropTypes.func,
        onSelect: PropTypes.func,
        user: IPropTypes.map.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            childrenOpen: false,
            showMoveAlarm: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderChildren: function (children) {
        if (this.state.childrenOpen) {
            let userRows = [];
            children.forEach(child => {
                userRows.push(
                    <UserRow
                        asteroid={this.props.asteroid}
                        getChildren={this.props.getChildren}
                        indent={this.props.indent + 5}
                        isSelected={this.props.isSelected}
                        isSelectedToClone={this.props.isSelectedToClone}
                        moveUser={this.props.moveUser}
                        onChangeActiveStatus={this.props.onChangeActiveStatus}
                        onSelect={this.props.onSelect}
                        user={child}
                    />
                );
            });
            return userRows;
        }
    },
    renderMoveAlarm: function () {
        const {colors} = this.getTheme();
        return (
            <ConfirmModal
                backgroundColor={colors.backgroundAlertModal}
                onConfirm={() => this.setState({showMoveAlarm: false})}
                onHide={() => this.setState({showMoveAlarm: false})}
                iconBgColor={colors.backgroundAlertIcon}
                iconType={"alert"}
                renderFooter={false}
                show={this.state.showMoveAlarm}
                subtitle={"L'utente selezionato dispone di sensori / funzioni non compatibili."}
                title={"Attenzione, operazione non consentita!"}
            />
        );
    },
    render: function () {
        const theme = this.getTheme();
        const children = this.props.getChildren(this.props.user.get("_id"));
        return (
            <div style={styles(theme).container}>
                <div style={{color: theme.colors.white}}>
                    <DraggableUser
                        asteroid={this.props.asteroid}
                        hasChildren={children && children.size > 0}
                        indent={this.props.indent}
                        isChildrenOpen={this.state.childrenOpen}
                        isConfirmed={isConfirmedUser(this.props.user)}
                        isSelected={this.props.isSelected}
                        isSelectedToClone={this.props.isSelectedToClone}
                        moveUser={this.props.moveUser}
                        onChangeActiveStatus={this.props.onChangeActiveStatus}
                        onOpenChildren={() => this.setState({childrenOpen: !this.state.childrenOpen})}
                        onSelect={this.props.onSelect}
                        showDragAlarm={() => this.setState({showMoveAlarm: true})}
                        user={this.props.user}
                    />
                    {this.renderChildren(children)}
                </div>
                {this.renderMoveAlarm()}
            </div>
        );
    }
});

module.exports = UserRow;
