import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MarkItem extends Component {
    render() {
        let { mark } = this.props;
        return (
            <tr>
                <td>
                    {mark.major.code}
                </td>
                <td>
                    {mark.major.name}
                </td>
                <td className="text-center">
                    {mark.aspiration}
                </td>
                <td>
                    {mark.subjectGroups}
                </td>
                <td>
                    {mark.mark}
                </td>
                <td>
                    {mark.note}
                </td>
            </tr>
        );
    }
}

export default MarkItem;