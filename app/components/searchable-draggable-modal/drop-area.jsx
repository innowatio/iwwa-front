import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";

import {Types} from "lib/dnd-utils";

import RemovableItem from "./removable-item";

var DropArea = React.createClass({
    propTypes: {
        connectDropTarget: PropTypes.func,
        droppedItems: PropTypes.array.isRequired,
        onItemDropped: PropTypes.func.isRequired,
        onItemRemoved: PropTypes.func.isRequired
    },
    renderDroppedItems: function () {
        const {
            droppedItems,
            onItemRemoved
        } = this.props;
        return droppedItems.map((item, index) => {
            return (
                <RemovableItem
                    key={index}
                    index={index}
                    item={item}
                    onRemove={() => onItemRemoved(item)}
                />
            );
        });
    },
    render: function () {
        var {connectDropTarget} = this.props;
        return connectDropTarget(
            <div style={{margin: "5px", width: "100%", height: "400px", backgroundColor: "gray", borderRadius: "5px", minHeight: "300px"}}>
                <p>{"Drop here."}</p>
                {this.renderDroppedItems()}
            </div>
        );
    }
});

var target = {
    drop: function (props, monitor) {
        props.onItemDropped(monitor.getItem());
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

module.exports = DropTarget(Types.SEARCHABLE, target, collect)(DropArea);
