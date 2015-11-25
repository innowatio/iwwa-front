var Radium = require("radium");
var React  = require("react");
var TimerMixin = require("react-timer-mixin");

var Gauge  = require("components/").Gauge;

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};


var RealTime = React.createClass({
    propTypes: {},
    mixins: [TimerMixin],
    getInitialState: function () {
        return {
            value: 0
        };
    },
    componentDidMount: function () {
        this.setInterval(this.rand, 2500); // Call a method on the mixin
    },
    rand: function () {
        this.setState({value: Math.round(Math.random() * 10000) / 100});
    },
    render: function () {
        return (
            <Gauge
                maximum={100}
                minimum={0}
                value={this.state.value}
            />
        );
    }
});

module.exports = Radium(RealTime);
