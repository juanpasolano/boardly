import React, {Component} from 'react';
import { Link } from 'react-router';

class Login extends Component {
    render() {
        return (
            <div>
                this is the login
                <Link to="/board">Board</Link>    
            </div>
        );
    }
}

export default Login;