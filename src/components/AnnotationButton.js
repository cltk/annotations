// @flow

import React from 'react'
import PropTypes from 'prop-types'

export default class AnnotationButton extends React.Component {
  handleClick: Function

  static defaultProps = {
    onClick: () => {},
  }

  static propTypes = {
    onClick: PropTypes.func,
  }

  constructor(props: {
    onClick: Function,
  }) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e: Event) {
    this.props.onClick(e)
  }

  render() {
    return (
      <button onClick={this.handleClick}>Add note</button>
    )
  }
}
