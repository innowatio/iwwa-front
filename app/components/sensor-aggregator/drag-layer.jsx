import React, {PropTypes} from "react";
import {DragLayer} from "react-dnd";

// import {Types} from "lib/dnd-utils";

const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
};

function getItemStyles (props) {
    const {currentOffset} = props;
    if (!currentOffset) {
        return {
            display: "none"
        };
    }

    const {x, y} = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform: transform,
        WebkitTransform: transform
    };
}

var AggregatorDragLayer = React.createClass({
    propTypes: {
        currentOffset: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }),
        isDragging: PropTypes.bool.isRequired,
        item: PropTypes.object,
        itemType: PropTypes.string
    },
    // renderItem: function (type, item) {
    //     switch (type) {
    //         case Types.OPERATOR:
    //             return (
    //                 <BoxDragPreview title={item.title} />
    //             );
    //     }
    // },
    render: function () {
        const {item, itemType, isDragging} = this.props;
        if (!isDragging) {
            return null;
        }

        return (
            <div style={layerStyles}>
                <div style={getItemStyles(this.props)}>
                    {this.renderItem(itemType, item)}
                </div>
            </div>
        );
    }
});

function collect (monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}

module.exports = DragLayer(collect)(AggregatorDragLayer);