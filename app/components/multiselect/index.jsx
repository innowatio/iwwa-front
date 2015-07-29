var Immutable   = require("immutable");
var Radium     = require("radium");
var R           = require("ramda");
var React       = require("react");
var ReactWidget = require("react-widgets");
var IPropTypes  = require("react-immutable-proptypes");

var Multiselect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        filter: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        maxValues: React.PropTypes.number,
        onChange: React.PropTypes.func.isRequired,
        open: React.PropTypes.string,
        style: React.PropTypes.object,
        tagComponent: React.PropTypes.func,
        title: React.PropTypes.element,
        value: React.PropTypes.array
    },
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function () {
        return {
            getLabel: function (allowedItem) {
                return allowedItem.toString();
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
    canOpen: function () {
        if (!this.props.maxValues) {
            return true;
        }
        if (this.props.open === "undefined" && (this.props.value.length < this.props.maxValues)) {
            return undefined;
        }
        return this.props.value.length < this.props.maxValues;
    },
    render: function () {
        var canOpen = this.canOpen();
        return (
            <span className="ac-multiselect" style={{display: "inline-block"}}>
                <Radium.Style
                    rules={{
                        input: {
                           display: canOpen ? "" : "none"
                       },
                        "li.rw-list-option": {
                            height: "40px"
                        },
                        "ul.rw-list > li.rw-list-option": {
                            borderBottom: "#C8C8C8 1px solid",
                            borderRadius: "0px"
                        },
                        "ul.rw-list > li.rw-list-option.rw-state-focus": {
                            border: "#66afe9 1px solid"
                        },
                        "ul.rw-list > li.rw-list-option:hover, .rw-selectlist > li.rw-list-option:hover": {
                            borderColor: "#e6e6e6"
                        },
                        "ul.rw-list": {
                            padding: "0px"
                        },
                        ".rw-input": {
                            padding: "5px"
                        }
                    }}
                    scopeSelector=".ac-multiselect"
                />
                <ReactWidget.Multiselect
                    data={this.getData()}
                    filter={this.props.filter}
                    onChange={this.props.onChange}
                    open={canOpen}
                    placeholder={"Punto di misurazione"}
                    style={this.props.style}
                    tagComponent={this.props.tagComponent}
                    textField={this.props.getLabel}
                    value={this.props.value}
                />
            </span>
        );
    }
});

module.exports = Radium(Multiselect);
