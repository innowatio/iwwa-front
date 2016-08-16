import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import {Icon} from "components";
import DraggableUser from "./draggable-user";

import {defaultTheme} from "lib/theme";
import {getUsername, isConfirmedUser} from "lib/users-utils";

const styles = ({colors}) => ({
    container: {
        borderBottom: "1px solid " + colors.borderSensorsTable,
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
                indent={this.props.indent + 10}
                isSelected={this.props.isSelected}
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
            <div style={{color: theme.colors.greySubTitle}}>
                <label style={{width: this.props.indent + "%"}} />
                <Icon
                    icon={"danger"}
                    size={"20px"}
                    style={{lineHeight: "20px", marginRight: "10px"}}
                />
                {getUsername(this.props.user)}
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