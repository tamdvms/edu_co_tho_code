import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import * as status from './../../contants/status';

class SchoolItem extends Component {

    constructor(props) {
        super(props);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        })
    }

    render() {
        let { school } = this.props;
        let icon = status.renIcon(school.status.status);
        return (
            <tr>
                <td>
                    <a href={'http://' + school.description} target="_blank">
                        <img src={school.image} width="50" style={{ border: '1px solid #ababab' }} />
                    </a>
                </td>
                <td>{school.name}</td>
                <td>{school.code}</td>
                <td>
                    <a href={'http://' + school.description} target="_blank">{school.description}</a>
                </td>
                <td>{school.province.name}</td>
                <td className="text-center">
                    {this.props.update &&
                        <Fragment>
                            <a
                                data-toggle="tooltip"
                                data-original-title={school.status.status === status.ACTIVE ? 'lock' : 'active'}
                                className="h-hand" onClick={this.props.updateStatus}
                                onClick={() => this.props.updateStatus(school.id, school.status.status === status.ACTIVE ? status.LOCK : status.ACTIVE)}
                            >
                                <i className={"w-1 fa fa-1x pd-rl-1 bd-r " + icon}></i>
                            </a>
                            <Link
                                data-original-title="Edit"
                                data-toggle="tooltip"
                                to={'/school/update/' + school.id}>
                                <i className="w-1 fa fa-1x fa-edit bd-r pd-rl-1"></i>
                            </Link>
                        </Fragment>
                    }
                    {this.props.delete &&
                        <a
                            className="h-hand"
                            data-original-title="Delete"
                            data-toggle="tooltip"
                            onClick={() => this.props.updateStatus(school.id, status.DELETE)}
                        >
                            <i className="w-1 fa fa-1x fa-trash pd-rl-1"></i>
                        </a>
                    }
                </td>
            </tr>
        );
    }
}

export default SchoolItem;