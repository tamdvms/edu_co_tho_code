import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

class Test extends Component {

    responseFacebook = (response) => {
        console.log(response);
    }

    componentClicked = () => {
        console.log('click');
    }

    render() {
        return (
            <div>
                <FacebookLogin
                    appId="284637609076699"
                    autoLoad={true}
                    fields="name,email,picture"
                    onClick={this.componentClicked}
                    callback={this.responseFacebook} />
            </div>
        );
    }
}

export default Test;