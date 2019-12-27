import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/SectorActions';

class Sector extends Component {

    componentDidMount() {
        this.props.loadSector(1);
    }

    genSectors = () => {
        let { sectors } = this.props;
        let rs = null;
        if (sectors) {
            rs = sectors.map((s, i) => (
                <h2 key={i}>{s.name}</h2>
            ));
        }
        return rs;
    }

    render() {
        return (
            <div>
                <h2>
                    Sector page
                </h2>
                {this.genSectors()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        sectors: state.SectorReducer.sectors
    }
}

const mapDispathToProps = (dispatch, props) => {
    return {
        loadSector: (page) => dispatch(actions.loadAllSectorApi(page))
    }
}

export default connect(mapStateToProps, mapDispathToProps)(Sector);