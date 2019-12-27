import React, { Component } from 'react';

class Content extends Component {
    render() {
        console.log(this.props.children);
        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý
                        <small>admin</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Level</a></li>
                        <li className="active">Here</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    {/*------------------------
                    | Your Page Content Here |
                    ------------------------*/}
                    {this.props.children}
                </section>
                {/* /.content */}
            </div>
        );
    }
}

export default Content;