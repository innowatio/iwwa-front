var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

import {defaultTheme} from "lib/theme";

var columnType = React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.shape({
        heading: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.string
        ]),
        key: React.PropTypes.string,
        valueFormatter: React.PropTypes.func
    })
]);
var columnsType = React.PropTypes.arrayOf(columnType);

var stringify = function (thing) {
    return (
        R.isNil(thing) ?
        R.toString(thing) :
        thing.toString()
    );
};

var Row = React.createClass({
    propTypes: {
        columns: columnsType,
        item: IPropTypes.map,
        onClick: React.PropTypes.func,
        width: React.PropTypes.string
    },
    renderCellElement: function (columnElement) {
        return (
            <td key={columnElement} style={{width: this.props.width, paddingLeft: "15px", verticalAlign: "middle"}}>
                {stringify(columnElement)}
            </td>
        );
    },
    renderCell: function (column, index) {
        if (R.is(String, column)) {
            return (
                this.renderCellElement(this.props.item.get(column))
            );
        }
        var value = this.props.item.get(column.key);
        return (
            <td key={index}
                style={R.merge({verticalAlign: "middle"}, R.isNil(column.style) ? {} : column.style(value))}
            >
                {
                    column.valueFormatter ?
                    column.valueFormatter(value, this.props.item) :
                    stringify(value)
                }
            </td>
        );
    },
    render: function () {
        return (
            <tr onClick={this.props.onClick} style={{cursor: this.props.onClick ? "pointer" : ""}}>
                {this.props.columns.map(this.renderCell)}
            </tr>
        );
    }
});

var RowHead = React.createClass({
    propTypes: {
        headColumn: React.PropTypes.array,
        headStyle: React.PropTypes.object
    },
    renderCell: function (column) {
        return (
            <td key={column}>
                {column}
            </td>
        );
    },
    render: function () {
        return (
            <tr style={this.props.headStyle}>
                {this.props.headColumn.map(this.renderCell)}
            </tr>
        );
    }
});

var CollectionElementsTable = React.createClass({
    propTypes: {
        bordered: React.PropTypes.bool,
        collection: IPropTypes.map,
        columns: columnsType,
        condensed: React.PropTypes.bool,
        getKey: React.PropTypes.func,
        headColumn: React.PropTypes.array,
        headStyle: React.PropTypes.object,
        hover: React.PropTypes.bool,
        onRowClick: React.PropTypes.func,
        siti: IPropTypes.map,
        striped: React.PropTypes.bool,
        style: React.PropTypes.object,
        width: React.PropTypes.string
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderHead: function () {
        return !R.isNil(this.props.headColumn) ? (
            <thead>
                <RowHead
                    headColumn={this.props.headColumn}
                    headStyle={this.props.headStyle}
                />
            </thead>
        ) : null;
    },
    renderBody: function () {
        return (
            <tbody>
                {this.props.collection.map(item => {
                    var key = (
                        this.props.getKey ?
                        this.props.getKey(item) :
                        item.hashCode()
                    );
                    return (
                        <Row
                            columns={this.props.columns}
                            item={item}
                            key={key}
                            onClick={() => this.props.onRowClick(item)}
                            width={this.props.width}
                        />
                    );
                }).toArray()}
            </tbody>
        );
    },
    render: function () {
        const {colors} = this.getTheme();
        let divStyle = {
            overflow: "auto",
            paddingTop: "10px",
            width: "100%",
            ...this.props.style
        };
        return (
            <div style={divStyle}>
                <bootstrap.Table
                    bordered={this.props.bordered}
                    condensed={this.props.condensed}
                    hover={this.props.hover}
                    striped={this.props.striped}
                    style={{borderBottom: "1px solid" + colors.greyBorder}}
                >
                    {this.renderHead()}
                    {this.renderBody()}
                </bootstrap.Table>
            </div>
        );
    }
});

module.exports = CollectionElementsTable;
