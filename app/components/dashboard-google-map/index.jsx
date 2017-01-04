import GoogleMap from "google-map-react";
import React, {Component, PropTypes} from "react";
import supercluster from "points-cluster";

import {GOOGLE_MAP_API_KEY} from "lib/config";

import ClusterMarker from "./cluster-marker";
import SiteMarker from "./site-marker";

class DashboardGoogleMap extends Component {

    static propTypes = {
        center: PropTypes.any,
        onCenterChange: PropTypes.func,
        onChange: PropTypes.func,
        onZoomChange: PropTypes.func,
        sites: PropTypes.array.isRequired,
        zoom: PropTypes.number
    }

    constructor (props) {
        super(props);
        this.state = {
            bounds: {
                nw: {
                    lat: 85,
                    lng: -180
                },
                se: {
                    lat: -85,
                    lng: 180
                }
            },
            clusters: [],
            center: {
                lat: 42,
                lng: 11
            },
            zoom: 5
        };
    }

    onChange ({bounds, zoom}) {
        this.setState({
            zoom,
            bounds
        });
    }

    onSiteClick (key, childProps) {
        if (childProps.sites) {
            this.setState({
                zoom: this.state.zoom + 1
            });
        } else {
            const child = this.refs[key];
            child.toggleSiteInfo();
        }
    }

    renderSitesMarker () {
        const {
            bounds,
            zoom
        } = this.state;

        const {sites} = this.props;
        const geocoordinates = sites.filter(x => x.latitude && x.longitude).map(x => {
            return {
                ...x,
                lat: x.latitude,
                lng: x.longitude
            };
        });

        const cluster = supercluster(geocoordinates);
        const clusters = cluster({
            bounds,
            zoom
        });

        return clusters.map((cluster, index) => {
            const {
                x,
                y,
                numPoints,
                points
            } = cluster;

            return numPoints > 1 ? (
                <ClusterMarker
                    key={index}
                    lat={y}
                    lng={x}
                    sites={numPoints}
                />
            ) : (
                <SiteMarker
                    key={index}
                    lat={y}
                    lng={x}
                    ref={index}
                    site={points[0]}
                />
            );
        });
    }

    render () {
        const {
            center,
            zoom
        } = this.props;
        return (
            <GoogleMap
                bootstrapURLKeys={{
                    key: GOOGLE_MAP_API_KEY
                }}
                center={center ? center : this.state.center}
                zoom={zoom ? zoom : this.state.zoom}
                onChange={(mapInfos) => this.onChange(mapInfos)}
                onChildClick={(key, childProps) => this.onSiteClick(key, childProps)}
            >
                {this.renderSitesMarker()}
            </GoogleMap>
        );
    }
}

module.exports = DashboardGoogleMap;
