import GoogleMap from "google-map-react";
import React, {PropTypes} from "react";
import controllable from "react-controllables";
import PureMixin from "react-pure-render/mixin";

import {GOOGLE_MAP_API_KEY} from "lib/config";

import SiteMarker from "./site-marker";

var DashboardGoogleMap = React.createClass({
    propTypes: {
        center: PropTypes.any,
        onCenterChange: PropTypes.func,
        onChange: PropTypes.func,
        onZoomChange: PropTypes.func,
        sites: PropTypes.array.isRequired,
        zoom: PropTypes.number
    },
    mixins: [PureMixin],
    onChange: function (center, zoom, bounds, marginBounds) {
        if (this.props.onChange) {
            this.props.onChange({center, zoom, bounds, marginBounds});
        } else {
            this.props.onCenterChange(center);
            this.props.onZoomChange(zoom);
        }
    },
    onSiteClick: function (key, childProps) {
        this.refs[childProps.site._id].viewSiteInfo();
    },
    renderSitesMarker: function () {
        return this.props.sites.map(site => {
            const {_id, latitude, longitude} = site;
            return latitude && longitude ? (
                <SiteMarker
                    key={_id}
                    lat={latitude}
                    lng={longitude}
                    ref={_id}
                    site={site}
                />
            ) : null;
        });
    },
    render: function () {
        // position: 10 === google.maps.ControlPosition.BOTTOM_LEFT
        return (
            <GoogleMap
                bootstrapURLKeys={{
                    key: GOOGLE_MAP_API_KEY
                }}
                center={this.props.center ? this.props.center : {lat: 42.0279071, lng: 11.3340147}}
                zoom={this.props.zoom ? this.props.zoom : 5}
                onChildClick={this.onSiteClick}
            >
                {this.renderSitesMarker()}
            </GoogleMap>
        );
    }
});

module.exports = controllable(DashboardGoogleMap, ["center", "zoom"]);
