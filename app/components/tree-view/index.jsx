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
        filterCriteria: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        style: React.PropTypes.object,
        styleToMergeWhenActiveState: React.PropTypes.object,
        title: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]).isRequired
    },
    applyFilters: function (values) {
        return this.props.filterCriteria ?
            this.props.filterCriteria(values) :
            values;
    },
    onChange: function (value, position) {
        const path = this.setPath(this.props.value, this.props.getKey(value[0]), position);
        this.props.onChange(path);
    },
    setPath: function (path, newValue, position) {
        return path.slice(0, position).concat(newValue);
    },
    renderLevel: function (value, position) {
        const path = this.props.value.slice(0, position);
        var {allowedValues} = path.reduce((acc, pathValue) => {
            const node = acc.allowedValues && acc.allowedValues.find(function (value) {
                return value.get("id") === pathValue;
            });
            const values = pathValue && acc.allowedValues.size > 0 ?
                node.get("children") :
                [];
            return {
                position: acc.position + 1,
                allowedValues: values
            };
        }, {position: 0, allowedValues: this.props.allowedValues});

        /**

            ATTENTION!

            We don't filter the first level cause we suppose it's already ok
            (and because it's a work around for a new request, for more info check the
            `getChildrenSensors` method of the SiteNavigator component)

        */

        allowedValues = this.applyFilters(allowedValues || []);

        const selectedValue = value ? [Immutable.Map({"id": value})] : [];
        return (
            <components.ButtonGroupSelect
                allowedValues={allowedValues}
                className={"btn-group-level" + position}
                getKey={this.props.getKey}
                getLabel={this.props.getLabel}
                key={"level" + position}
                multi={false}
                onChange={R.partialRight(this.onChange, [position])}
                showArrowActive={false}
                style={this.props.style}
                styleToMergeWhenActiveState={this.props.styleToMergeWhenActiveState}
                value={selectedValue}
                vertical={true}
            />
        );
    },
    render: function () {
        return (
            <div>
                {this.props.value.concat(undefined).map(this.renderLevel)}
            </div>
        );
    }
});

module.exports = Radium(TreeView);
