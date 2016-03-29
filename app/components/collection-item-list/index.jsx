import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Style} from "radium";
import ReactPureRender from "react-addons-pure-render-mixin";

import {defaultTheme} from "lib/theme";
import components from "components";

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
        filter: PropTypes.func,
        headerComponent: PropTypes.func.isRequired,
        hover: PropTypes.bool,
        hoverStyle: PropTypes.object,
        // If is not specified, by default are showed all the items.
        initialVisibleRow: PropTypes.number,
        inputFilterStyle: PropTypes.object,
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
            visibleValuesList: this.props.initialVisibleRow,
            search: ""
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
    onChangeInputFilter: function (input) {
        this.setState({
            search: input,
            visibleValuesList: this.props.initialVisibleRow
        });
    },
    filter: function (element) {
        return this.props.filter ?
            this.props.filter(element, this.state.search) :
            true;
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
    renderInputFilter: function () {
        return this.props.filter ? (
            <components.InputFilter
                onChange={this.onChangeInputFilter}
                style={this.props.inputFilterStyle}
            />
        ) : null;
    },
    renderLazyLoad: function (collectionSize) {
        return this.props.initialVisibleRow && (this.state.visibleValuesList <= collectionSize) ? (
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
            .filter(this.filter)
            .map(this.renderItemList)
            .toList()
            .toJS();
        return (
            <div style={{
                height: "calc(100% - 270px)",
                marginTop: this.props.filter ? "22px" : "none"
            }}
            >
                {this.renderInputFilter()}
                <div style={{height: "100%"}}>
                    {collectionList.slice(0, this.props.initialVisibleRow ? this.state.visibleValuesList : Infinity)}
                    <div style={{borderTop: "1px solid " + colors.white}} />
                    <div style={{marginBottom: "50px"}}>
                        {this.renderLazyLoad(collectionList.length)}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CollectionItemList;
