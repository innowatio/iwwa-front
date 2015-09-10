var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var CollectionUtils  = require("lib/collection-utils");
var colors           = require("lib/colors");
var components       = require("components");

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
        siti: IPropTypes.map
    },
    renderCellElement: function (columnElement) {
        if (R.is(Boolean, columnElement)) {
            return (
                <td key={columnElement} style={{
                        backgroundColor: columnElement ? colors.green : colors.red,
                        width: "37px",
                        height: "100%",
                        textAlign: "center"
                    }}>
                    <components.Icon
                        icon={columnElement ? "check" : "exclamation"}
                        style={{color: colors.white}}/>
                </td>
            );
        }
        return (
            <td key={columnElement} style={{width: "40%"}}>
                {stringify(columnElement)}
            </td>
        );
    },
    renderCell: function (column) {
        if (R.is(String, column)) {
            return (
                this.renderCellElement(this.props.item.get(column))
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
        bordered: React.PropTypes.bool,
        collection: IPropTypes.map,
        columns: columnsType,
        condensed: React.PropTypes.bool,
        getKey: React.PropTypes.func,
        hover: React.PropTypes.bool,
        siti: IPropTypes.map,
        striped: React.PropTypes.bool
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
                            siti={this.props.siti}
                        />
                    );
                }).toArray()}
            </tbody>
        );
    },
    render: function () {
        return (
            <div style={{overflow: "auto", paddingTop: "10px", width: "100%"}}>
                <bootstrap.Table
                    bordered={this.props.bordered}
                    condensed={this.props.condensed}
                    hover={this.props.hover}
                    striped={this.props.striped}
                    style={{borderBottom: "1px solid" + colors.greyBorder}}
                >
                    {this.renderBody()}
                </bootstrap.Table>
            </div>
        );
    }
});

module.exports = Radium(CollectionElementsTable);
