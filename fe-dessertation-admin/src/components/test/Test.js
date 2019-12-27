import React, { Component } from 'react';
import Select from 'react-select';

const customStyles = {
    control: (base) => ({
        ...base,
        minHeight: 34,
        borderRadius: 0
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: "0 8px"
    })
}

class Test extends Component {


    constructor(props) {
        super(props);
        this.state = {
            options: [
                { value: 'chocoladate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
                { value: 'chocoqưlsdate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilrqla', label: 'Vanilla' },
                { value: 'vaniưdlla', label: 'Vanilla' },
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawdqberry', label: 'Strawberry' },
                { value: 'vanqưilla', label: 'Vanilla' }
            ],
            selectedOption: null,
        }
    }

    componentDidMount() {

    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    }

    render() {
        let { selectedOption, options } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="col-xs-6 col-xs-offset-3">
                        <Select
                            value={selectedOption}
                            onChange={this.handleChange}
                            options={options}
                            isMulti={true}
                            classNamePrefix="form-control"
                            styles={customStyles}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Test;