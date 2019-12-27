import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { changeText } from '../../custom/index';

class NewItem extends Component {
    render() {

        let { myNew } = this.props;

        return (
            <div>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <div className="news">
                        <div className="img">
                            <Link to={'/new/detail/' + changeText(myNew.title) + '?id=' + myNew.id} >
                                <img className="media-object" src={myNew.image} alt="onirem" />
                            </Link>
                        </div>
                        <div className="caption">
                            <div className="tend">
                                <h3>
                                    <Link to={'/new/detail/' + changeText(myNew.title) + '?id=' + myNew.id} >
                                        Tiêu đề: {myNew.title}
                                    </Link>
                                </h3>
                            </div>
                            <hr></hr>
                            <i className="fa fa-clock-o" aria-hidden="true">06/12/2018 - 999 lượt xem</i>

                            <div className="tomtat">{myNew.description}.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewItem;