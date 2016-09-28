import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import {Icon} from "components";
import DraggableUser from "./draggable-user";

import {defaultTheme} from "lib/theme";
import {getUsername, isConfirmedUser} from "lib/users-utils";

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
        getChildren: PropTypes.func,
        indent: PropTypes.number.isRequired,
        isSelected: PropTypes.func,
        onChangeActiveStatus: PropTypes.func,
        onSelect: PropTypes.func,
        user: IPropTypes.map.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },

    getInitialState: function () {
        return {childrenOpen: false};
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderChildren: function (children) {
        return this.state.childrenOpen ? (
            <UserRow
                getChildren={this.props.getChildren}
                indent={this.props.indent + 5}
                isSelected={this.props.isSelected}
                onChangeActiveStatus={this.props.onChangeActiveStatus}
                onSelect={this.props.onSelect}
                user={children.first()}
            />
        ) : null;
    },
    renderRegistered: function (theme) {
        const children = this.props.getChildren(this.props.user.get("_id"));
        return (
            <div style={{color: theme.colors.white}}>
                <DraggableUser
                    hasChildren={children && children.size > 0}
                    indent={this.props.indent}
                    isChildrenOpen={this.state.childrenOpen}
                    isSelected={this.props.isSelected}
                    onChangeActiveStatus={this.props.onChangeActiveStatus}
                    onOpenChildren={() => this.setState({childrenOpen: !this.state.childrenOpen})}
                    onSelect={this.props.onSelect}
                    user={this.props.user}
                />
                {this.renderChildren(children)}
            </div>
        );
    },
    renderUnregistered: function (theme) {
        return (
            <div style={{width: "100%", color: theme.colors.greySubTitle}}>
                <label style={{display: "inline-block", float: "left", width: this.props.indent + "%"}} />
                <div style={{float: "left", borderLeft: "2px solid " + theme.colors.white, width: ("100%" - (this.props.indent + "%"))}}>
                    <div style={{
                        display: "inline-block",
                        width: "28px",
                        height: "28px",
                        margin: "0px 10px",
                        border: "1px solid " + theme.colors.greySubTitle,
                        backgroundColor: theme.colors.backgroundUserIcon,
                        borderRadius: "100%",
                        textAlign: "center",
                        verticalAlign: "middle",
                        lineHeight: "28px"
                    }}>
                        <Icon
                            color={theme.colors.white}
                            icon={"danger"}
                            size={"16px"}
                        />
                    </div>
                    {getUsername(this.props.user)}
                </div>
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).container}>
                {isConfirmedUser(this.props.user) ? this.renderRegistered(theme) : this.renderUnregistered(theme)}
            </div>
        );
    }
});

module.exports = UserRow;
