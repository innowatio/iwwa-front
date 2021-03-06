import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {Icon} from "components";

const styles = (theme) => ({
    operatorStyle: {
        display: "inline-block",
        width: "38px",
        height: "38px",
        overflow: "hidden",
        textAlign: "center",
        margin: "2px",
        borderRadius: "100%",
        color: theme.colors.white
    }
});

const sensorSource = {
    beginDrag (props) {
        return {
            operator: props.type,
            type: Types.OPERATOR
        };
    },

    endDrag (props, monitor) {
        if (!monitor.didDrop()) {
            return;
        }
        // TODO When dropped on a compatible target, do something
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var DraggableOperator = React.createClass({
    propTypes: {
        backgroundColor: PropTypes.string,
        connectDragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        type: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render () {
        const {type, connectDragSource} = this.props;
        let theme = this.getTheme();
        return connectDragSource(
            <div
                style={{
                    display: "inline-block",
                    width: "44px",
                    height: "44px",
                    lineHeight: "44px",
                    margin: "5px",
                    borderRadius: "10px",
                    border: "1px solid " + theme.colors.white,
                    cursor: "pointer"
                }}
            >
                <p style={{
                    backgroundColor: this.props.backgroundColor || theme.colors.iconOperatorBg1,
                    ...styles(theme).operatorStyle
                }}>
                    <Icon
                        color={theme.colors.white}
                        icon={type}
                        size={"30px"}
                        style={{lineHeight: "44px"}}
                    />
                </p>
            </div>
        );
    }
});

module.exports = DragSource(Types.OPERATOR, sensorSource, collect)(DraggableOperator);
