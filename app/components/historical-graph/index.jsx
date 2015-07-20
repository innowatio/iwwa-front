var Radium     = require("radium");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var DateCompareGraph   = require("./date-compare.jsx");
var ValoriCompareGraph = require("./valori-compare.jsx");

var HistoricalGraph = React.createClass({
    propTypes: {
        dateCompare: React.PropTypes.shape({
            period: React.PropTypes.object,
            dateOne: React.PropTypes.date,
            dateTwo: React.PropTypes.date
        }),
        misure: IPropTypes.map,
        sito: IPropTypes.map,
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    renderDateCompareGraph: function () {
        return <DateCompareGraph {...this.props} />;
    },
    renderValoriCompareGraph: function () {
        return <ValoriCompareGraph {...this.props} />;
    },
    render: function () {
        return (
            this.props.dateCompare ?
            this.renderDateCompareGraph() :
            this.renderValoriCompareGraph()
        );
    }
});

module.exports = Radium(HistoricalGraph);
