import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {Icon} from "components";

const styles = (theme) => ({
    operatorStyle: {
        display: "inline-block",
        width: "36px",
        height: "36px",
        overflow: "hidden",
        textAlign: "center",
        margin: "3px",
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
        key: PropTypes.string,
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
                key={this.props.key}
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
<<<<<<< Updated upstream
                    display: "inline-block",
                    width: "30px",
                    height: "30px",
                    overflow: "hidden",
                    fontWeight: "300",
                    textAlign: "center",
                    margin: "5px",
                    borderRadius: "100%",
                    backgroundColor: theme.colors.iconOperator,
<<<<<<< HEAD
                    color: theme.colors.white,
                    ...this.props.operatorStyle
=======
                    backgroundColor: this.props.backgroundColor || theme.colors.iconOperatorBg1,
                    ...styles(theme).operatorStyle
>>>>>>> Stashed changes
=======
                    color: theme.colors.white
>>>>>>> bedabcadfe7777528d5074eb1b59007164fbade5
                }}
                >
                    <Icon
                        color={theme.colors.white}
                        icon={type}
                        size={"28px"}
                        style={{lineHeight: "42px"}}
                    />
                </p>
            </div>
        );
    }
});

module.exports = DragSource(Types.OPERATOR, sensorSource, collect)(DraggableOperator);
