import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SuggestItem extends Component {
    render() {
        let { school, goDetail } = this.props;
        return (
            <tr>
                <td>
                    <a onClick={goDetail} >
                        {school.code}
                    </a>
                </td>
                <td>
                    <a onClick={goDetail} >
                        {school.name}
                    </a>
                </td>
                <td>

                </td>
            </tr>
        );
    }
}

export default SuggestItem;