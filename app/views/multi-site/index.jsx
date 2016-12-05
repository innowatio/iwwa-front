import Immutable  from "immutable";
import React from "react";
import {connect} from "react-redux";

import moment from "lib/moment";

import {DashboardBox} from "components";

const boxContentStyle = {
    display: "inherit"
};

var MultiSite = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: React.PropTypes.any
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
    },
    getSites: function () {
        return this.props.collections.get("sites") || Immutable.Map();
    },
    renderSiteRecap: function () {
        // TODO per i siti, bisogna capire se il controllo sui siti visibili dall'utente sta sul back (publication) o front
        // (in caso va gestita la publication per leggere il permesso `view-all-sites`)
        return (
            <div style={boxContentStyle}>
                {this.getSites().size }
                {"Siti monitorati"}
                {moment().format("ddd D MMM YYYY [  h] HH:mm")}
            </div>
        );
    },
    render: function () {
        const style = {
            color: "#fff",
            padding: "20px",
            textAlign: "center"
        };

        return (
            <div style={style}>
                <DashboardBox>
                    {this.renderSiteRecap()}
                </DashboardBox>
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
