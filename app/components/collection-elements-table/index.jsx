var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

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
        item: IPropTypes.map
    },
    renderCell: function (column) {
        if (R.is(String, column)) {
            return (
                <td key={column}>{stringify(this.props.item.get(column))}</td>
            );
        }
        var value = this.props.item.get(column.key);
        return (
            <td key={column.key}>
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
            <tr>
                {this.props.columns.map(this.renderCell)}
            </tr>
        );
    }
});

var CollectionElementsTable = React.createClass({
    propTypes: {
        collection: IPropTypes.map,
        columns: columnsType,
        getKey: React.PropTypes.func,
        hover: React.PropTypes.bool,
        striped: React.PropTypes.bool
    },
    renderHead: function () {
        return (
            <thead>
                <tr>
                    {this.props.columns.map(column => {
                        return (
                            R.is(String, column) ?
                            <th key={column}>{column}</th> :
                            <th key={column.key}>
                                {
                                    R.isNil(column.heading) ?
                                    column.key :
                                    column.heading
                                }
                            </th>
                        );
                    })}
                </tr>
            </thead>
        );
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
                        />
                    );
                }).toArray()}
            </tbody>
        );
    },
    render: function () {
        return (
            <bootstrap.Table hover={this.props.hover} striped={this.props.striped}>
                {this.renderHead()}
                {this.renderBody()}
            </bootstrap.Table>
        );
    }
});

module.exports = Radium(CollectionElementsTable);
