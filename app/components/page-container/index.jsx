import IPropTypes from "react-immutable-proptypes";
import React, {PropTypes} from "react";

var PageContainer = React.createClass({
    propTypes: {
        asteroid: PropTypes.object,
        children: PropTypes.node,
        collections: IPropTypes.map.isRequired,
        localStorage: PropTypes.object,
        reduxState: PropTypes.object.isRequired,
        style: PropTypes.object
    },
    defaultProps: {
        style: {}
    },
    renderChildren: function () {
        return React.cloneElement(this.props.children, {
            asteroid: this.props.asteroid,
            collections: this.props.collections,
            localStorage: this.props.localStorage
        });
    },
    render: function () {
        const {style} = this.props;
        return (
            <div style={style}>
                {this.renderChildren()}
            </div>
        );
    }
});

module.exports = PageContainer;
