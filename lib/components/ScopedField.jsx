import { Component, Children, cloneElement } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { change } from 'redux-form';

export class ScopedField extends Component {
  componentDidUpdate(oldProps) {
    const { scope, resetFieldValue } = this.props;
    if (scope !== oldProps.scope) {
      resetFieldValue();
    }
  }

  render() {
    const {
      children,
      scope,
      scopeName,
      options: {
        allowEmptyScope,
        missingScopePlaceholderText
      } = {} } = this.props;
    const child = Children.only(children);
    const childProps = { ...child.props };

    let scopeRequiredButEmpty = !scope && !allowEmptyScope;
    if (scopeRequiredButEmpty) {
      childProps.disabled = true;
      childProps.placeholder = missingScopePlaceholderText || `Choose ${scopeName} first`;
    }

    return cloneElement(child, { ...childProps, key: scope });
  }
}

ScopedField.propTypes = {
  children: PropTypes.node.isRequired,
  scope: PropTypes.string.isRequired,
  scopeName: PropTypes.string.isRequired,
  onReset: PropTypes.func,
  options: PropTypes.shape({
    allowEmptyScope: PropTypes.bool,
    missingScopePlaceholderText: PropTypes.string,
  })
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  resetFieldValue: () => {
    const { _owner, props } = Children.only(ownProps.children);
    dispatch(change(
      _owner._context._reduxForm.form,
      props.name.split('.')[0],
      ownProps.onReset ? ownProps.onReset() : '',
    ));
  },
});


export default connect(null, mapDispatchToProps)(ScopedField);
