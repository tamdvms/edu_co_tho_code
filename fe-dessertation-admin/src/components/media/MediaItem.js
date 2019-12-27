import React, { Component, Fragment } from 'react';
import * as status from './../../contants/status';
import { toastrOption } from './../../custom/Custom';
import toastr from 'toastr';

class NewItem extends Component {

    constructor(props) {
        super(props);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.state = {
            clicked: false
        }
        toastr.options = toastrOption;
    }

    copy = () => {
        this.setState({ clicked: true });
        let el = document.getElementById('link' + this.props.index);
        el.select();
        $(el).tooltip('hide');
        document.execCommand("copy");
        toastr.success('Copied to clipboard!');
    }

    render() {
        let { media } = this.props;
        let icon = status.renIcon(media.status.status);
        return (
            <tr>
                <td>
                    {media.kind === 'image' ? (
                        <img
                            width="70px" src={media.link}
                            alt='media'
                            style={{ border: '1px solid rgb(171, 171, 171)' }}
                        />
                    ) : media.link}
                </td>
                <td>
                    <div className="input-group">
                        <input
                            type="text" className="form-control h-hand" placeholder="link"
                            defaultValue={media.link}
                            data-original-title={this.state.clicked ? 'Copied' : 'Copy to clipboard'}
                            data-toggle="tooltip"
                            onClick={this.copy}
                            id={'link' + this.props.index}
                            onBlur={() => this.setState({ clicked: false })}
                        />
                    </div>
                </td>
                <td>
                    {media.kind}
                </td>
                <td className="text-center">
                    {this.props.update &&
                        <Fragment>
                            <a
                                data-toggle="tooltip"
                                data-original-title={media.status.status === status.ACTIVE ? 'lock' : 'active'}
                                className="h-hand" onClick={this.props.updateStatus}
                                onClick={() => this.props.updateStatus(media.id, media.status.status === status.ACTIVE ? status.LOCK : status.ACTIVE)}
                            >
                                <i className={"w-1 fa fa-1x pd-rl-1 bd-r " + icon}></i>
                            </a>
                            <a
                                data-original-title="Edit"
                                data-toggle="tooltip"
                            // to={'/media/update/' + media.id}
                            >
                                <i className="w-1 fa fa-1x fa-edit bd-r pd-rl-1"></i>
                            </a>
                        </Fragment>
                    }
                    {this.props.delete &&
                        <a
                            className="h-hand"
                            data-original-title="Delete"
                            data-toggle="tooltip"
                            onClick={() => this.props.updateStatus(media.id, status.DELETE)}
                        >
                            <i className="w-1 fa fa-1x fa-trash pd-rl-1"></i>
                        </a>
                    }
                </td>
            </tr>
        );
    }
}

export default NewItem;