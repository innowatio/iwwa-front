import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";

import {Types} from "lib/dnd-utils";

import {
    Button
} from "components";

var DraggableItem = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        index: PropTypes.number,
        item: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    },
    render: function () {
        const {
            item,
            label,
            onClick
        } = this.props;
        const {connectDragSource} = this.props;
        return connectDragSource(
            <div>
                <Button
                    onClick={() => onClick(item)}
                    style={{
                        color: "white",
                        borderRadius: "30px",
                        fontWeight: "300",
                        width: "100%",
                        height: "45px",
                        lineHeight: "45px",
                        paddingTop: "0px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontSize: "20px",
                        border: "0px",
                        backgroundColor: item.selected ? "#ec4882" : "gray"
                    }}
                >
                {label}
                </Button>
            </div>
        );
    }
});

var spec = {
    beginDrag: function (props) {
        return {...props.item};
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

module.exports = DragSource(Types.SEARCHABLE, spec, collect)(DraggableItem);
