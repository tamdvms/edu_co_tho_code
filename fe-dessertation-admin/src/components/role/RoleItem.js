import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import * as roles from './../../contants/roles';
import * as status from './../../contants/status';

class RoleItem extends Component {

    convert = (val) => {
        switch (val) {
            case roles.VIEW: {
                return 'VIEW';
            }
            case roles.UPDATE: {
                return 'UPDATE';
            }
            case roles.ADD: {
                return 'ADD';
            }
            case roles.DELETE: {
                return 'DELETE';
            }
            case roles.ROOT: {
                return 'ROOT';
            }
        }
    }

    constructor(props) {
        super(props);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        })
    }

    render() {
        let { role } = this.props;
        let icon = status.renIcon(role.status.status);
        return (
            <tr>
                <td>{role.name}</td>
                <td>{JSON.parse(role.roles).map(this.convert).join(' - ')}</td>
                <td className="text-center">
                    <a
                        data-toggle="tooltip"
                        data-original-title={role.status.status === status.ACTIVE ? 'lock' : 'active'}
                        className="h-hand" onClick={this.props.updateStatus}
                        onClick={() => this.props.updateStatus(role.id, role.status.status === status.ACTIVE ? status.LOCK : status.ACTIVE)}
                    >
                        <i className={"w-1 fa fa-1x pd-rl-1 bd-r " + icon}></i>
                    </a>
                    <Link
                        to={'/role/update/' + role.id}
                        data-original-title="Edit"
                        data-toggle="tooltip"
                    >
                        <i className="w-1 fa fa-1x fa-edit bd-r pd-rl-1"></i>
                    </Link>
                    <a
                        className="h-hand"
                        data-original-title="Delete"
                        data-toggle="tooltip"
                        onClick={() => this.props.updateStatus(role.id, status.DELETE)}
                    >
                        <i className="w-1 fa fa-1x fa-trash pd-rl-1"></i>
                    </a>
                </td>
            </tr>
        );
    }
}

export default RoleItem;