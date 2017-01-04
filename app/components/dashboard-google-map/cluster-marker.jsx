import React, {Component, PropTypes} from "react";
import {defaultTheme} from "lib/theme";

const styles = (theme) => ({
    clusterContainer: {
        position: "absolute",
        left: -30 / 2,
        top: -30 / 2,
        cursor: "zoom-in"
    },
    cluster: {
        color: "white",
        width: "30px",
        height: "30px",
        backgroundColor: theme.colors.buttonPrimary,
        border: "1px solid " + theme.colors.white,
        borderRadius: "30px",
        textAlign: "center",
        lineHeight: "28px"
    }
});

class ClusterMarker extends Component {

    static propTypes = {
        sites: PropTypes.number.isRequired
    }

    static contextTypes = {
        theme: PropTypes.object
    }

    getTheme () {
        return this.context.theme || defaultTheme;
    }

    render () {
        const {sites} = this.props;
        const theme = this.getTheme();
        return (
            <div style={styles(theme).clusterContainer}>
                <p style={styles(theme).cluster}>
                    {sites}
                </p>
            </div>
        );
    }
}

module.exports = ClusterMarker;
