import React, {PropTypes} from "react";

import {
    Icon
} from "components";

var RemovableItem = React.createClass({
    propTypes: {
        index: PropTypes.number.isRequired,
        item: PropTypes.object.isRequired,
        onRemove: PropTypes.func.isRequired
    },
    render: function () {
        const {
            index,
            item,
            onRemove
        } = this.props;
        return (
            <div style={{width: "100%"}}>
                {item.id}
                <Icon
                    onClick={() => onRemove({index, item})}
                    icon={"delete"}
                />
            </div>
        );
    }
});

module.exports = RemovableItem;
