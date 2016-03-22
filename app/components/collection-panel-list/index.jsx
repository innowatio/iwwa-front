import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

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
            <div onClick={() => this.setState({
                visibleValuesList: this.state.visibleValuesList + this.props.initialVisibleRow})
            }
            >
                <h5>{"Carica altri"}</h5>
            </div>
        ) : null;
    },
    render: function () {
        const collectionList = this.props.collections
            .sort(this.props.sort)
            .map(this.renderList)
            .toList()
            .toJS()
            .filter((obj, index) => (this.props.initialVisibleRow ? index < this.state.visibleValuesList : true));
        return (
            <div style={{marginTop: "84px"}}>
                {collectionList}
                {this.renderLazyLoad()}
            </div>
        );
    }
});

module.exports = CollectionPanelList;
