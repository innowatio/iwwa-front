import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import moment from "lib/moment";

import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    dataWrp:{
        minHeight: "200px",
        height: "auto",
        padding: "5px 10px",
        backgroundColor: colors.secondary,
        color: colors.white,
        marginBottom: "10px"
    },

    boxTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
    },

    boxColumn: {
        textAlign: "left",
        fontWeight: "300",
        marginTop: "6px"
    }
});

class AlarmsRecap extends React.Component {

    static propTypes = {
        alarmsAggregates: PropTypes.object.isRequired,
        style: PropTypes.object
    }

    constructor (props) {
        super(props);
        this.state ={};
    }

    getTheme () {
        return this.context.theme || defaultTheme;
    }

    getDayNight (aggregate) {
        var total = 0;
        var daytime = 0;
        aggregate.forEach(value => {
            const values = value.get("measurementValues").split(",");
            const times = value.get("measurementTimes").split(",");
            values.forEach((value, i) =>{
                const isAlarm = values > 0;
                const isDaytime = this.isDaytime(moment(parseInt(times[i])).format("H"));
                total += (isAlarm ? 1 : 0);
                daytime += (isAlarm && isDaytime ? 1 : 0);
            });

        });
        return ({
            daytime,
            night: total - daytime
        });
    }

    getCount (aggregate) {
        const aggregateWeek = aggregate.filter(value => {
            return moment().diff(moment(value.get("date")), "days") <= 7;
        });

        const aggregateDay = aggregate.filter(value => {
            return moment().diff(moment(value.get("date")), "days") <= 1;
        });

        return ({
            total: this.getDayNight(aggregate),
            week: this.getDayNight(aggregateWeek),
            day: this.getDayNight(aggregateDay)
        });
    }

    isDaytime (hour) {
        if (hour <=18 && hour >= 6) {
            return true;
        }
        return false;
    }

    renderColumn (data, type) {
        const theme = this.getTheme();

        const total = data.total[type];
        const week = data.week[type];
        const day = data.day[type];
        const title = type=="daytime" ? "DIURNI" : "NOTTURNI";
        return (
            <bootstrap.Col xs={6} style={styles(theme).boxColumn}>
                <p style={{fontSize: "16px"}}>
                    <b>{title}</b>
                </p>
                <p style={{margin: "0"}}>{"Totali: "}{total}</p>
                <p style={{margin: "0"}}>{"Ultima sett: "}{week}</p>
                <p style={{margin: "0"}}>{"Ultime 24h: "}{day}</p>
            </bootstrap.Col>
        );
    }

    render () {
        const theme = this.getTheme();
        const countAlarms = this.getCount(this.props.alarmsAggregates);
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"ALLARMI"}
                </h2>
                <bootstrap.Row>
                    {this.renderColumn(countAlarms, "daytime")}
                    {this.renderColumn(countAlarms, "night")}
                </bootstrap.Row>
            </div>
        );
    }
}

module.exports = AlarmsRecap;
