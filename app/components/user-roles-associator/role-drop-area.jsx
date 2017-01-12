import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";

import {Icon} from "components";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

var RoleDropArea = React.createClass({
    propTypes: {
        addRole: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func,
        removeRole: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {colors} = this.getTheme();
        const {connectDropTarget, roles} = this.props;
        return connectDropTarget(
            <div style={{minHeight: "300px"}}>
                {roles.map(role => (
                    <div
                        style={{
                            padding: "2px 10px",
                            border: "1px solid " + colors.buttonPrimary,
                            borderRadius: "30px",
                            marginBottom: "8px",
                            float: "left",
                            display: "block",
                            width: "auto",
                            clear: "both"
                        }}
                    >
                        {role}
                        <div
                            onClick={() => this.props.removeRole(role)}
                            style={{
                                display: "block",
                                float: "right",
                                width: "20px",
                                height: "20px",
                                overflow: "hidden",
                                borderRadius: "30px",
                                textAlign: "center",
                                textDecoration: "none",
                                marginLeft: "10px",
                                color: colors.mainFontColor,
                                cursor: "pointer"
                            }}
                        >
                            <Icon
                                color={colors.mainFontColor}
                                icon={"delete"}
                                size={"15px"}
                                style={{
                                    verticalAlign: "middle"
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
});

const roleTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        if (props.roles.indexOf(item.role) < 0) {
            props.addRole(item.role);
        }
        return {moved: true};
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

module.exports = DropTarget(Types.ROLE, roleTarget, collect)(RoleDropArea);
