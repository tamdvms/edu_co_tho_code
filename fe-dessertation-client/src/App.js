import React, { Component, Fragment } from 'react';
import { init_first, init_all } from './assets/js/all';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reload: false
        }
    }

    componentDidMount() {
        init_first();
        // init_all();
    }

    // componentWillReceiveProps(nextProps) {
    //     if (JSON.stringify(this.props.location.pathname) !== JSON.stringify(nextProps.location.pathname)) {
    //         this.setState({ reload: true });
    //     }
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     let { reload } = this.state;
    //     if (reload) {
    //         init_all();
    //         reload = !reload;
    //         this.setState({ reload });
    //     }
    // }

    render() {
        let { loading } = this.props;
        return (
            <Fragment>
                {loading && (
                    <div className="page-loader" style={{ display: 'block !important' }}>
                        <div className="loader">Loading...</div>
                    </div>
                )}
                {this.props.children}
            </Fragment>
        );
    }
}

App.propTypes = {
    loading: PropTypes.bool
}

const mapStateToProps = state => {
    return {
        loading: state.LoadingReducer.loading
    }
}

export default connect(mapStateToProps)(App);