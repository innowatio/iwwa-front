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
        title: React.PropTypes.string,
        // value: React.PropTypes.any
        getData: React.PropTypes.array
    },
    getDefaultProps: function () {
        var defaultGetter = function (allowedItem) {
            return allowedItem.toString();
        };
        return {
            getKey: defaultGetter,
            getLabel: defaultGetter,
            getData: []
        };
    },
    shouldComponentUpdate: function (nextProps) {
        return !(
            this.props.allowedValues === nextProps.allowedValues &&
            // this.props.getKey === nextProps.getKey &&
            this.props.getLabel === nextProps.getLabel &&
            this.props.title === nextProps.title &&
            this.props.value === nextProps.value
        );
    },
    createArrayOfData: function (allowedValue) {
        var items = this.props.getLabel(allowedValue);
        return (
            this.props.getData.push(items)
        );
    },
    render: function () {
        var items = this.props.allowedValues.map(this.createArrayOfData);
        return (
            /*
            * DA AGGIUNGERE L'onChange!!!!!!!
            */
            <div>
                <ReactWidget.Multiselect
                    data={this.props.getData}
                    duration={250}
                    filter="contains"
                    onChange={""}
                    placeholder={this.props.title}
                />
            </div>
        );
    }
});

module.exports = MultiselectElement;
