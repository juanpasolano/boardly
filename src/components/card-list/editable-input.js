import React, {Component, PropTypes} from 'react';

const propTypes = {
    onSubmit: PropTypes.func,
    value: PropTypes.string,
    children: PropTypes.element.isRequired,
}
const defaultProps = {
  value: '',
};

const styles = {
    hidden: {
        display: 'none'
    }
}
class EditableInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false
        }
    }
    onSubmit(e) {
        e.preventDefault();
        this.setState({isEditing:!this.state.isEditing});
        if(this.props.onSubmit) this.props.onSubmit(this.refs)
    }
    toggle() {
        this.setState({isEditing:!this.state.isEditing});
    }
    render() {
        return (
            <div className="m-b-2">
                <div onClick={this.toggle.bind(this)} style={Object.assign({}, (!this.state.isEditing) ? {}: styles.hidden, {cursor: 'pointer'})}>
                    {this.props.children}
                </div> 
                <div className="ui input" style={(this.state.isEditing) ? {}: styles.hidden}>
                    <form onSubmit={this.onSubmit.bind(this) }>
                        <div className="ui right labeled input">
                            <input placeholder="Set a title" type="text" ref="title" defaultValue={this.props.value} />
                            <button type="button" className="ui label" onClick={this.toggle.bind(this)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
EditableInput.propTypes = propTypes;
EditableInput.defaultProps = defaultProps;

export default EditableInput;