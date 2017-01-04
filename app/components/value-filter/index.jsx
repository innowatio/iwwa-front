import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";

class ValueFilter extends React.Component {

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
            selectedValue: event.target.value
        };
        this.setState(filter);
        this.props.onChange(filter);
    }

    render () {
        const {id, label, selectedValue, filterType} = this.state.filter ? this.state.filter : this.props.filter;
        return (
            <bootstrap.FormControl id={id} className="input-search" placeholder={label}
                type={filterType} value={selectedValue} onChange={(event) => this.onChangeValue(event)}
            />
        );
    }
}

module.exports = ValueFilter;
