import React, { Component, Fragment } from 'react';

class DashBoard extends Component {
    render() {
        return (
            <Fragment>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        DashBoard
                        <small>Main</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> DashBoard</a></li>
                        <li className="active">Main</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    {/*------------------------
                    | Your Page Content Here |
                    ------------------------*/}
                </section>
                {/* /.content */}
            </Fragment>
        );
    }
}

export default DashBoard;