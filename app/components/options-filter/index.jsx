import React, {PropTypes} from "react";
import {Radio} from "antd";

class OptionsFilter extends React.Component {

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
        const {id, label, options} = this.props.filter;
        const filter = {
            id,
            label,
            options,
            selectedValue: event.target.value
        };
        this.setState(filter);
        this.props.onChange(filter);
    }

    renderRadios () {
        const {options} = this.props.filter;
        return options.map(option => {
            return (
                <Radio key={option.key} value={option.key}>{option.label}</Radio>
            );
        });
    }

    render () {
        const {id, selectedValue} = this.state.filter ? this.state.filter : this.props.filter;
        return (
            <Radio.Group name={id} value={selectedValue} onChange={(event) => this.onChangeValue(event)}>
                {this.renderRadios()}
            </Radio.Group>
        );
    }
}

module.exports = OptionsFilter;
