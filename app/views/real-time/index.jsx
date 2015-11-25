var Radium = require("radium");
var React  = require("react");
var TimerMixin = require("react-timer-mixin");

var Gauge  = require("components/").Gauge;
var styles = require("lib/styles");

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
            <div style={styles.mainDivStyle}>
                <div>
                    {/*     Barra Export (?) e ricerca sito
                    <components.Popover
                        hideOnChange={true}
                        title={<img src={icons.iconSiti} style={{width: "75%"}} />}
                        tooltipId="tooltipMisurazione"
                        tooltipMessage="Punti di misurazione"
                        tooltipPosition="top"
                    >
                        <components.SelectTree
                            allowedValues={siti}
                            filter={CollectionUtils.siti.filter}
                            getKey={CollectionUtils.siti.getKey}
                            getLabel={CollectionUtils.siti.getLabel}
                            placeholder={"Punto di misurazione"}
                            {...sitoInputProps}
                        />
                    </components.Popover>
                     */}
                </div>
                {/* Barra Rilevazioni ambientali */}
                {/* Gauge/s */}
                <Gauge
                    maximum={100}
                    minimum={0}
                    value={this.state.value}
                />
            </div>
        );
    }
});

module.exports = Radium(RealTime);
