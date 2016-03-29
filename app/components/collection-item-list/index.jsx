import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Style} from "radium";
import ReactPureRender from "react-addons-pure-render-mixin";

import {defaultTheme} from "lib/theme";

const styles = {
    listContainer: {
        height: "calc(100% - 270px)",
        overflow: "hidden",
        marginTop: "22px"
    }
};

var RowItem = React.createClass({
    propTypes: {
        element: IPropTypes.map.isRequired,
        elementId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        header: PropTypes.func.isRequired,
        hoverStyle: PropTypes.object,
        subList: PropTypes.func.isRequired
    },
    mixins: [ReactPureRender],
    render: function () {
        console.log("RENDER ROW");
        return (
            <div className="item-list-container">
                <div className="hover-container">
                    <Style
                        rules={{".hover-container:hover": this.props.hoverStyle}}
                        scopeSelector=".item-list-container"
                    />
                    {this.props.header(this.props.element, this.props.elementId)}
                </div>
                {this.props.subList(this.props.element, this.props.elementId)}
            </div>
        );
    }
});

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
    mixins: [ReactPureRender],
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
    renderItemList: function (element, elementId) {
        return (
            <RowItem
                element={element}
                elementId={elementId}
                header={this.props.headerComponent}
                hoverStyle={this.props.hoverStyle}
                key={elementId}
                subList={this.props.subListComponent}
            />
        );
    },
    renderLazyLoad: function () {
        const lengthOfCollection = this.props.collections.size;
        return this.props.initialVisibleRow && (this.state.visibleValuesList <= lengthOfCollection) ? (
            <div
                onClick={() => this.setState({
                    visibleValuesList: this.state.visibleValuesList + this.props.initialVisibleRow})
                }
                style={{
                    ...this.props.lazyLoadButtonStyle,
                    marginBottom: "50px"
                }}
            >
                {this.props.lazyLoadLabel}
            </div>
        ) : null;
    },
    render: function () {
        const {colors} = this.getTheme();
        const collectionList = this.props.collections
            .sort(this.props.sort)
            .map(this.renderItemList)
            .toList()
            .toJS()
            .filter((obj, index) => (this.props.initialVisibleRow ? index < this.state.visibleValuesList : true));
        return (
            <div style={styles.listContainer} >
                <div style={{overflow: "auto", height: "100%"}}>
                    {collectionList}
                    <div style={{borderTop: "1px solid " + colors.white}} />
                    {this.renderLazyLoad()}
                </div>
            </div>
        );
    }
});

module.exports = CollectionItemList;
