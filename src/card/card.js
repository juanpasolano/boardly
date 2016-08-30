import React, { Component } from 'react';

class Card extends Component {
    render () {
        console.log(this.props);
        return (
            <div className="ui cards">
            <div className="card">
                <div className="content">
                <div className="header">{this.props.creator}</div>
                <div className="meta">{this.props.date.toDateString()}</div>
                <div className="description">
                    {this.props.body}
                </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Card;