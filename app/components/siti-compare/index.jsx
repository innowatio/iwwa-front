var React       = require("react");
var IPropTypes  = require("react-immutable-proptypes");

var components       = require("components/");

var SitiCompare = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        filter: React.PropTypes.func,
        getSitoLabel: React.PropTypes.func,
        open: React.PropTypes.string,
        style: React.PropTypes.object
    },
    render: function () {
        return (
            <div>
                <components.Multiselect
                    allowedValues={this.props.allowedValues}
                    filter={this.props.filter}
                    getLabel={this.props.getSitoLabel}
                    maxValues={1}
                    open={this.props.open}
                    style={this.props.style}
                    value={[]}
                />
                <components.Multiselect
                    allowedValues={this.props.allowedValues}
                    filter={this.props.filter}
                    getLabel={this.props.getSitoLabel}
                    maxValues={1}
                    open={this.props.open}
                    style={this.props.style}
                    value={[]}
                />
            </div>
        );
    }
});

module.exports = SitiCompare;
