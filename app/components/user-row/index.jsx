import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import DraggableUser from "./draggable-user";

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
        moveUser: PropTypes.func,
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
                asteroid={this.props.asteroid}
                getChildren={this.props.getChildren}
                indent={this.props.indent + 5}
                isSelected={this.props.isSelected}
                moveUser={this.props.moveUser}
                onChangeActiveStatus={this.props.onChangeActiveStatus}
                onSelect={this.props.onSelect}
                user={children.first()}
            />
        ) : null;
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
                        moveUser={this.props.moveUser}
                        onChangeActiveStatus={this.props.onChangeActiveStatus}
                        onOpenChildren={() => this.setState({childrenOpen: !this.state.childrenOpen})}
                        onSelect={this.props.onSelect}
                        user={this.props.user}
                    />
                    {this.renderChildren(children)}
                </div>
            </div>
        );
    }
});

module.exports = UserRow;
