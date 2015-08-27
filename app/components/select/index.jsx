var Immutable   = require("immutable");
var Radium      = require("radium");
var R           = require("ramda");
var React       = require("react");
var ReactLink   = require("react/lib/ReactLink");
var ReactWidget = require("react-widgets");
var IPropTypes  = require("react-immutable-proptypes");

var colors = require("lib/colors");

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
        open: React.PropTypes.string,
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
            this.props.onChange([newValue]);
        }
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(newValue);
        }
    },
    canOpen: function () {
        return (this.props.open === "undefined" ?
            undefined :
            true
        );
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
                <Radium.Style
                    rules={{
                        "ul.rw-list > li.rw-list-option.rw-state-selected": {
                            backgroundColor: colors.primary,
                            color: colors.white
                        },
                        "li.rw-list-option": {
                            height: "40px"
                        },
                        "li.rw-list-option rw-list-focus": {
                            border: "0px"
                        },
                        "ul.rw-list > li.rw-list-option": {
                            borderBottom: colors.greyBorder + " 1px solid",
                            borderRadius: "0px"
                        },
                        "ul.rw-list > li.rw-list-option.rw-state-focus": {
                            border: colors.blueBorder + " 1px solid"
                        },
                        "ul.rw-list > li.rw-list-option:hover, .rw-selectlist > li.rw-list-option:hover": {
                            borderColor: colors.greyLight
                        },
                        "ul.rw-list": {
                            padding: "0px"
                        },
                        "li": {
                            fontSize: "13px",
                            height: "100%",
                            borderRadius: "5px"
                        },
                        ".rw-dropdownlist > .rw-input": {
                            display: this.props.open === "undefined" ? "block" : "none"
                        },
                        ".rw-filter-input": {
                            borderTop: "0px",
                            borderRadius: "3px"
                        },
                        ".rw-popup-container": {
                            marginTop: "0px"
                        }
                    }}
                    scopeSelector=".form-group"
                />
                <ReactWidget.DropdownList
                    data={this.getData()}
                    filter={this.props.filter}
                    onChange={this.onChange}
                    open={this.canOpen()}
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
