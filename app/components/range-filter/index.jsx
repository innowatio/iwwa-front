import React, {PropTypes} from "react";
import {Slider} from "antd";

class RangeFilter extends React.Component {

    static propTypes = {
        filter: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.object
    }

    constructor (props) {
        super(props);
        this.state ={};
    }

    onChangeValue (event) {
        const {id, label} = this.props.filter;
        const filter = {
            id,
            label,
            selectedValue: event
        };
        this.setState(filter);
        this.props.onChange(filter);
    }

    render () {
        const {selectedValue} = this.state.filter ? this.state.filter : this.props.filter;
        const value = selectedValue ? selectedValue : [0, 0];
        return (
            <Slider range={true} defaultValue={value} max={300} onChange={(event) => this.onChangeValue(event)}/>
        );
    }
}

module.exports = RangeFilter;
