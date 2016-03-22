import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    loadMore: {
        width: "230px",
        height: "45px",
        lineHeight: "43px",
        backgroundColor: colors.buttonPrimary,
        fontSize: "14px",
        textTransform: "uppercase",
        fontWeight: "400",
        margin: "10px auto 0 auto",
        borderRadius: "30px",
        cursor: "pointer"
    },
    listContainer: {
        height: "calc(100vh - 270px)",
        overflow: "hidden"
    }
});

var CollectionPanelList = React.createClass({
    propTypes: {
        collections: IPropTypes.map.isRequired,
        headerComponent: PropTypes.func.isRequired,
        // If is not specified, by default are showed all the items.
        initialVisibleRow: PropTypes.number,
        sort: PropTypes.func,
        subListComponent: PropTypes.func
    },
    getDefaultProps: function () {
        return {
            subListComponent: () => null
        };
    },
    getInitialState: function () {
        return {
            visibleValuesList: this.props.initialVisibleRow
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderList: function (collection, index) {
        return (
            <div key={index}>
                {this.props.headerComponent(collection, index)}
                {this.props.subListComponent(collection, index)}
            </div>
        );
    },
    renderLazyLoad: function () {
        const lengthOfCollection = this.props.collections.size;
        return this.props.initialVisibleRow && (this.state.visibleValuesList <= lengthOfCollection) ? (
            <div
                onClick={() => this.setState({
                    visibleValuesList: this.state.visibleValuesList + this.props.initialVisibleRow})
                }
                style={styles(this.getTheme()).loadMore}
            >
                <p style={{textAlign: "center"}}>{"Carica altri"}</p>
            </div>
        ) : null;
    },
    render: function () {
        const {colors} = this.getTheme();
        const collectionList = this.props.collections
            .sort(this.props.sort)
            .map(this.renderList)
            .toList()
            .toJS()
            .filter((obj, index) => (this.props.initialVisibleRow ? index < this.state.visibleValuesList : true));
        return (
            <div style={{marginTop: "84px"}}>
                <div style={styles(this.getTheme()).listContainer} >
                    <div style={{overflow: "auto", height: "100%"}}>
                        {collectionList}
                        <div style={{borderTop: "1px solid " + colors.white}} />
                        {this.renderLazyLoad()}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CollectionPanelList;
