import React from "react";

import {connect} from "react-redux";

var MultiSite = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: React.PropTypes.any
    },
    componentDidMount: function () {
    },
    render: function () {
        const style = {
            color: "#fff",
            padding: "20px",
            textAlign: "center"
        };

        return (
            <div style={style}>
                <header>
                </header>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections
    };
}
module.exports = connect(mapStateToProps)(MultiSite);
