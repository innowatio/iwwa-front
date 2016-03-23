import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Style} from "radium";

import {defaultTheme} from "lib/theme";

const styles = {
    listContainer: {
        height: "calc(100vh - 270px)",
        overflow: "hidden"
    }
};

var CollectionItemList = React.createClass({
    propTypes: {
        collections: IPropTypes.map.isRequired,
        headerComponent: PropTypes.func.isRequired,
        hover: PropTypes.bool,
        hoverStyle: PropTypes.object,
        // If is not specified, by default are showed all the items.
        initialVisibleRow: PropTypes.number,
        lazyLoadButtonStyle: PropTypes.object,
        lazyLoadLabel: PropTypes.string,
        sort: PropTypes.func,
        subListComponent: PropTypes.func
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            subListComponent: () => null,
            hover: false
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
    onMouseOver: function (index) {
        if (this.props.hover) {
            this.setState({hover: index});
        }
    },
    onMouseLeave: function () {
        this.setState({hover: null});
    },
    renderList: function (collection, index) {
        return (
            <div className="item-list-container" key={index}>
                <div className="hover-container">
                    <Style
                        rules={{
                            ".hover-container:hover": this.props.hoverStyle
                        }}
                        scopeSelector=".item-list-container"
                    />
                    {this.props.headerComponent(collection, index)}
                </div>
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
                style={this.props.lazyLoadButtonStyle}
            >
                {this.props.lazyLoadLabel}
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
                <div style={styles.listContainer} >
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

module.exports = CollectionItemList;
