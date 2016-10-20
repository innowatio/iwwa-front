import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Style} from "radium";
import ReactPureRender from "react-addons-pure-render-mixin";

import {defaultTheme} from "lib/theme";
import {Button, InputFilter} from "components";

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
        buttonBottomStyle: PropTypes.object,
        collections: IPropTypes.map.isRequired,
        filter: PropTypes.func,
        headerComponent: PropTypes.func.isRequired,
        hover: PropTypes.bool,
        hoverStyle: PropTypes.object,
        // If is not specified, by default are showed all the items.
        initialVisibleRow: PropTypes.number,
        inputFilterStyle: PropTypes.object,
        lazyLoadButtonStyle: PropTypes.object,
        lazyLoadButtonStyleContainer: PropTypes.object,
        lazyLoadLabel: PropTypes.string,
        selectAll: PropTypes.object,
        showFilterInput: PropTypes.bool,
        sort: PropTypes.func,
        subListComponent: PropTypes.func,
        transferAll: PropTypes.object
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
        // We use InputFilter because is used in many part of application.
        return this.props.showFilterInput ? (
            <InputFilter
                onChange={this.onChangeInputFilter}
                style={this.props.inputFilterStyle}
            />
        ) : null;
    },
    renderEmptyMessage: function () {
        const theme = this.getTheme();
        return (
            <div style={{
                textAlign: "center",
                color: theme.colors.buttonPrimary,
                fontSize: "20px",
                fontWeight: 600,
                padding: "20px 0px"
            }}>
                {"Non ci sono elementi disponibili"}
            </div>
        );
    },
    renderLazyLoad: function (collectionSize) {
        return this.props.initialVisibleRow && (collectionSize > this.state.visibleValuesList) ? (
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
    renderSelectAll: function (renderedItems) {
        const {selectAll} = this.props;
        return selectAll && renderedItems.length > 0 ? (
            <Button
                style={this.props.buttonBottomStyle}
                onClick={() => {
                    selectAll.onClick(renderedItems);
                }}
            >
                {selectAll.label}
            </Button>
        ) : null;
    },
    renderTransferAll: function (renderedItems) {
        const {transferAll} = this.props;
        return transferAll && renderedItems.length > 0 ? (
            <Button
                disabled={!transferAll.selected || transferAll.selected.length <= 0}
                style={this.props.buttonBottomStyle}
                onClick={transferAll.onClick}
            >
                {transferAll.label}
            </Button>
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
            <div>
                {this.renderInputFilter()}
                <div style={{height: "100%", overflow: "auto"}}>
                    {
                        collectionList.length > 0 ?
                        collectionList.slice(0, this.props.initialVisibleRow ? this.state.visibleValuesList : Infinity) :
                        this.renderEmptyMessage()
                    }
                    <div style={this.props.lazyLoadButtonStyleContainer}>
                        {this.renderLazyLoad(collectionList.length)}
                    </div>
                    <div style={{
                        width: "100%",
                        backgroundColor: colors.backgroundButtonBottom,
                        borderTop: `1px solid ${colors.borderContentModal}`,
                        position: "absolute",
                        bottom: "0"
                    }}>
                        {this.renderSelectAll(collectionList)}
                        {this.renderTransferAll(collectionList)}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CollectionItemList;
