var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");


var MenuBox = React.createClass({
    propTypes: {
        allowedValues: IPropTypes.map.isRequired,
        depth: React.PropTypes.number,
        getChildren: React.PropTypes.array,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]),
        title: React.PropTypes.string
    },
    onChange: function (value, position) {
        var path = this.props.value;
        path = path.slice(0, position);
        path.push(this.props.getKey(value[0]));
        if (this.props.depth > 0 && path.length < this.props.depth) {
            path.push("")
        }
        this.props.onChange(path);
    },
    getChildrenSelector: function (position) {
        if(!this.props.getChildren || this.props.getChildren.length < 1) {
            return undefined;
        }
        else {
            return position < this.props.getChildren.length ?
                this.props.getChildren[position] :
                this.props.getChildren[this.props.getChildren.length -1];
        }
    },
    renderLevel: function (value, position) {
        if (this.props.depth < 0 || position < this.props.depth) {
            var props = this.props;
            var values = this.getChildrenSelector(position) ?
                this.props.allowedValues.get(this.getChildrenSelector(position)) :
                this.props.allowedValues;
            var selectedValue = R.find(function (val) {
                return props.getKey(val) === value;
            }, values);
            var selectedValue = selectedValue ? [selectedValue] : [];
            return (
                <components.ButtonGroupSelect
                    allowedValues={values.toArray()}
                    getKey={this.props.getKey}
                    getLabel={this.props.getLabel}
                    key={"buttongroup" + position}
                    multi={false}
                    onChange={R.partialRight(this.onChange, [position])}
                    value={selectedValue}
                    vertical={true}
                />
            );
        }
        else {
            return (
                <div></div>
            );
        }
    },
    render: function () {
        return (
            <div>
                {this.props.value.map(this.renderLevel)}
            </div>
        );
    }
});

module.exports = Radium(MenuBox);
