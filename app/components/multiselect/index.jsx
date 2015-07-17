var R           = require("ramda");
var Radium      = require("radium");
var React       = require("react");
var bootstrap   = require("react-bootstrap");
var ReactWidget = require("react-widgets");
var IPropTypes  = require("react-immutable-proptypes");

var components = require("components");
var colors     = require("lib/colors");

var MultiselectElement = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        // getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        title: React.PropTypes.string
        // value: React.PropTypes.array,

    },
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function () {
        var defaultGetter = function (allowedItem) {
            return allowedItem.toString();
        };
        return {
            getKey: defaultGetter,
            getLabel: defaultGetter
        };
    },
    getInitialState: function () {
        return {
            value: []
        };
    },
    render: function () {
        var data = this.props.allowedValues.toList().toJS();
        /*
        *   Add default data value
        */
        return (
            <div>
                <ReactWidget.Multiselect
                    data={data}
                    duration={250}
                    filter="contains"
                    onChange={this.props.onChange}
                    placeholder={this.props.title}
                    valueField="_id" textField={item => item.societa + " " + item.idCoin}
                />
            </div>
        );
    }
});

module.exports = MultiselectElement;
