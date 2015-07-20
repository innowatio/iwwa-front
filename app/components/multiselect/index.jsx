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
        style: React.PropTypes.object,
        tagComponent: React.PropTypes.func,
        title: React.PropTypes.string,
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
                        }
                    }}
                    scopeSelector=".ac-multiselect"
                />
                <ReactWidget.Multiselect
                    data={this.getData()}
                    filter={this.props.filter}
                    onChange={this.props.onChange}
                    open={canOpen ? undefined : false}
                    placeholder={this.props.title}
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
