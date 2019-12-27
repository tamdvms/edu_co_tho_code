import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <footer className="main-footer">
                {/* To the right */}
                <div className="pull-right hidden-xs">
                    Banana
                </div>
                {/* Default to the left */}
                <strong>Copyright © 2018 <a href="#">Company</a>.</strong> All rights reserved.
            </footer>
        );
    }
}

export default Footer;