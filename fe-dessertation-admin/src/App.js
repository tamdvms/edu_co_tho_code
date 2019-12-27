import React, { Component } from 'react';
import Header from './components/main/Header';
import Sidebar from './components/main/Sidebar';
import Footer from './components/main/Footer';
import ControlSidebar from './components/main/ControlSidebar';
import { connect } from 'react-redux';
import Loading from './components/common/Loading';

class App extends Component {

    // componentDidMount() {
    // //     $('[data-toggle="tooltip"]').tooltip();
    // // }

    render() {
        let { user } = this.props;
        const { children } = this.props;

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, { test: '123123' })
        );
        return (
            <div className="wrapper" >
                {/* <Loading /> */}

                {this.props.loading &&
                    <div id="my-loading">
                        <i className="fa fa-fw fa-5x fa-spinner faa-spin animated"></i>
                    </div>
                }

                {/* Main Header */}
                <Header user={user} />

                {/* Left side column. contains the logo and sidebar */}
                <Sidebar user={user} />

                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                    {childrenWithProps}
                </div>

                {/* Main Footer */}
                <Footer />

                {/* Control Sidebar */}
                <ControlSidebar />

                {/* Add the sidebar's background. This div must be placed immediately after the control sidebar */}
                <div className="control-sidebar-bg" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.DifReducer.loading
    }
}

export default connect(mapStateToProps)(App);