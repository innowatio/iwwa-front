var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");


var TreeView = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]).isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]),
        title: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            path: this.props.value || [undefined]
        }
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        this.setState({
            path: props.value
        });
    },
    onChange: function (value, position) {
        const path = this.setPath(this.state.path, this.props.getKey(value[0]), position);
        this.setState({path});
        this.props.onChange(path);
    },
    setPath: function (path, newValue, position) {
        return path.slice(0, position).concat(newValue, undefined);
    },
    renderLevel: function (value, position) {
        const self = this;
        const path = this.state.path.slice(0, position);
        const {allowedValues, selectedValue} = path.reduce((acc, pathValue) => {
            const node = acc.allowedValues.find(function (value) {
                return value.get("id") === pathValue;
            });
            const values = pathValue && acc.allowedValues.size > 0 ?
                node.get("children") :
                [];
            return {
                position: acc.position + 1,
                allowedValues: values,
                selectedValue: node ? node : acc.selectedValue
            };
        }, {position: 0, allowedValues: this.props.allowedValues, selectedValue: undefined});

        return (
            <components.ButtonGroupSelect
                allowedValues={allowedValues || []}
                className={"btn-group-level" + position}
                getKey={this.props.getKey}
                getLabel={this.props.getLabel}
                key={"level" + position}
                multi={false}
                onChange={R.partialRight(this.onChange, [position])}
                value={selectedValue ? [selectedValue] : []}
                vertical={true}
            />
        );
    },
    render: function () {
        return (
            <div>
                {this.state.path.map(this.renderLevel)}
            </div>
        );
    }
});

module.exports = Radium(TreeView);
