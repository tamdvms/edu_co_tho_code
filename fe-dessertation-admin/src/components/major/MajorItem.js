import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import * as status from './../../contants/status';

class MajorItem extends Component {

    constructor(props) {
        super(props);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        })
    }

    render() {
        let { major } = this.props;
        let icon = status.renIcon(major.status.status);
        return (
            <tr>
                <td>{major.name}</td>
                <td>{major.code}</td>
                <td>{major.school.name}</td>
                <td className="text-center">
                    {this.props.update &&
                        <Fragment>
                            <a
                                data-toggle="tooltip"
                                data-placement="top"
                                data-original-title={major.status.status === status.ACTIVE ? 'lock' : 'active'}
                                className="h-hand" onClick={this.props.updateStatus}
                                onClick={() => this.props.updateStatus(major.id, major.status.status === status.ACTIVE ? status.LOCK : status.ACTIVE)}
                            >
                                <i className={"w-1 fa fa-1x pd-rl-1 bd-r " + icon}></i>
                            </a>
                            <Link
                                to={'/major/update/' + major.id}
                                data-toggle="tooltip"
                                data-placement="top"
                                data-original-title="Edit"
                            >
                                <i className="w-1 fa fa-1x fa-edit bd-r pd-rl-1"></i>
                            </Link>
                        </Fragment>
                    }
                    {this.props.delete &&
                        <a
                            className="h-hand"
                            onClick={() => this.props.updateStatus(major.id, status.DELETE)}
                            data-toggle="tooltip"
                            data-placement="top"
                            data-original-title="Delete"
                        >
                            <i className="w-1 fa fa-1x fa-trash pd-rl-1"></i>
                        </a>
                    }
                </td>
            </tr>
        );
    }
}

export default MajorItem;