import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SchooItem extends Component {
    render() {
        let { item, type } = this.props;
        if (type === 'SCHOOL') {
            return (
                <tr>
                    <td>
                        <Link to={'/school/detail?id=' + (item._id || item.id)} >
                            {item.code}
                        </Link>
                    </td>
                    <td>
                        <Link to={'/school/detail?id=' + (item._id || item.id)} >
                            {item.name}
                        </Link>
                    </td>
                    <td>
                        {(item.province[0] && item.province[0].name) || (item.province.name)}
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td>
                        <Link to={'/school/detail?id=' + (item.school._id || item.school.id)} >
                            {item.school.name}
                        </Link>
                    </td>
                    <td>
                        {item.province && item.province[0].name}
                    </td>
                    <td>
                        {item.name}
                    </td>
                    <td>
                        {item.marks && item.marks.mark}
                    </td>
                </tr>
            );
        }
    }
}

export default SchooItem;
