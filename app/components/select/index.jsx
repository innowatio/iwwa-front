var Immutable   = require("immutable");
var Radium      = require("radium");
var R           = require("ramda");
var React       = require("react");
var ReactLink   = require("react/lib/ReactLink");
var ReactWidget = require("react-widgets");
var IPropTypes  = require("react-immutable-proptypes");

var Select = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        filter: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        label: React.PropTypes.string,
        onChange: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        value: React.PropTypes.array,
        valueLink: ReactLink.PropTypes.link()
    },
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function () {
        return {
            getLabel: function (allowedValue) {
                return allowedValue.toString();
            }
        };
    },
    getData: function () {
        return (
            R.is(Immutable.Iterable, this.props.allowedValues) ?
            this.props.allowedValues.toList().toArray() :
            this.props.allowedValues
        );
    },
    getValue: function () {
        return (
            this.props.valueLink ?
            this.props.valueLink.value :
            this.props.value
        );
    },
    onChange: function (newValue) {
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(newValue);
        }
    },
    renderLabel: function () {
        return this.props.label ? (
            <label>{this.props.label}</label>
        ) : null;
    },
    render: function () {
        return (
            <div className="form-group">
                {this.renderLabel()}
                <ReactWidget.DropdownList
                    data={this.getData()}
                    filter={this.props.filter}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    style={this.props.style}
                    textField={this.props.getLabel}
                    value={this.getValue()}
                />
            </div>
        );
    }
});

module.exports = Radium(Select);
