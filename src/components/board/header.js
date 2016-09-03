import React, {Component} from 'react';

class Header extends Component {
    render() {
        return (
            <header>
                <div className="ui secondary pointing menu">
                    <a className="active item">
                        Current board name
                    </a>
                    <a className="item">
                        Boards
                    </a>
                    <a className="item">
                        Messages
                    </a>
                    <div className="right menu">
                        <a className="ui item">
                            Logout
                        </a>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;