// @flow

import React from 'react'
import PropTypes from 'prop-types'

export default class Annotation extends React.Component {
  handleClick: Function
  handleMouseOut: Function
  handleMouseOver: Function

  static propTypes = {
    annotationHoverEntityKey: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    revealedEntityKey: PropTypes.string,
    setCurrentTextState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    annotationHoverEntityKey: '',
    revealedEntityKey: '',
  }

  constructor(props: Object) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
  }

  handleClick() {
    this.props.revealAnnotationEntity(this.props.entityKey)
  }

  handleMouseOut() {
    this.props.setAnnotationHoverEntityKey('')
  }

  handleMouseOver() {
    this.props.setAnnotationHoverEntityKey(this.props.entityKey)
  }

  isHoverTarget() {
    return this.props.entityKey === this.props.annotationHoverEntityKey
  }

  render() {
    const style = {
      cursor: 'pointer',
      backgroundColor: this.isHoverTarget() ? '#acd9e7' : '#71bed6',
    }

    return (
      <span
        onClick={this.handleClick}
        onMouseOut={this.handleMouseOut}
        onMouseOver={this.handleMouseOver}
        role="presentation"
        style={style}
      >
        {this.props.children}
      </span>
    )
  }
}
