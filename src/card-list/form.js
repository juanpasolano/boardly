import React, { Component } from 'react';

export default class Form extends Component {
    _onHandleSubmit(event){
        event.preventDefault();
        if(this.props.handleSubmit) {
            this.props.handleSubmit(this.refs);
        }
    }
    render () {
        return(
            <form onSubmit={this._onHandleSubmit.bind(this)}>
                <div className="ui form">
                    <div className="fields">
                        <div className="field">
                            <label>Name</label>
                            <input type="text" placeholder="Name" ref="creator"/>
                        </div>
                        <div className="field">
                            <label>Body</label>
                            <input type="text" placeholder="Body" ref="body"/>
                        </div>
                    </div>
                </div>
                <button className="ui button" type="submit">Submit</button>
            </form>  
        )
    }
}