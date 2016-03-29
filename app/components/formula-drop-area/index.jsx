import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";

import {Types} from "lib/dnd-utils";

const formulaTarget = {
    canDrop (props, monitor) {
        // You can disallow drop based on props or item
        const item = monitor.getItem();
        console.log(props);
        console.log(item);
        // return canMakeChessMove(item.fromPosition, props.position);
        return true;
    },
    hover (props, monitor, component) {
        // This is fired very often and lets you perform side effects
        // in response to the hover. You can"t handle enter and leave
        // here—if you need them, put monitor.isOver() into collect() so you
        // can just use componentWillReceiveProps() to handle enter/leave.

        // You can access the coordinates if you need them
        const clientOffset = monitor.getClientOffset();
        // const componentRect = findDOMNode(component).getBoundingClientRect();

        // You can check whether we"re over a nested drop target
        const isJustOverThisOne = monitor.isOver({shallow: true});

        // You will receive hover() even for items for which canDrop() is false
        const canDrop = monitor.canDrop();

        console.log(props);
        console.log(component);
        console.log(clientOffset);
        console.log(isJustOverThisOne);
        console.log(canDrop);
    },
    drop (props, monitor, component) {
        if (monitor.didDrop()) {
            // If you want, you can check whether some nested
            // target already handled drop
            return;
        }

        // Obtain the dragged item
        const item = monitor.getItem();
        console.log(props);
        console.log(component);
        console.log(item);

        // You can do something with it
        // ChessActions.movePiece(item.fromPosition, props.position);

        // You can also do nothing and return a drop result,
        // which will be available as monitor.getDropResult()
        // in the drag source"s endDrag() method
        return {moved: true};
    }
};

function collect (connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDropTarget: connect.dropTarget(),
        // You can ask the monitor about the current drag state:
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({shallow: true}),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType()
    };
}

var FormulaDropArea = React.createClass({
    propTypes: {
        canDrop: PropTypes.bool,
        connectDropTarget: PropTypes.func,
        isOver: PropTypes.bool,
        isOverCurrent: PropTypes.bool,
        position: PropTypes.any, //TODO non so
        style: PropTypes.object
    },
    componentWillReceiveProps: function (nextProps) {
        if (!this.props.isOver && nextProps.isOver) {
            // You can use this as enter handler
        }

        if (this.props.isOver && !nextProps.isOver) {
            // You can use this as leave handler
        }

        if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
            // You can be more specific and track enter/leave
            // shallowly, not including nested targets
        }
    },
    render: function () {
        // These props are injected by React DnD,
        // as defined by your `collect` function above:
        const {isOver, canDrop, connectDropTarget, position, style} = this.props;
        console.log(position);
        return connectDropTarget(
            <div style={style}>
                {isOver && canDrop && <div className="green" />}
                {!isOver && canDrop && <div className="yellow" />}
                {isOver && !canDrop && <div className="red" />}
            </div>
        );
    }
});

export default DropTarget([Types.SENSOR, Types.OPERATOR], formulaTarget, collect)(FormulaDropArea);
