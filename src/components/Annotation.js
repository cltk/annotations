// @flow

import React from 'react'

export type Props = {
  annotationHoverEntityKey: string,
  children: string | Object,
  entityKey: string,
  onClick: string => void,
  onMouseOut: string => void,
  onMouseOver: string => void,
  revealedEntityKey: string,
  setCurrentTextState: Function,
}

export default class Annotation extends React.Component {
  handleClick: Function
  handleMouseOut: Function
  handleMouseOver: Function
  isHoverTarget: void => boolean

  static defaultProps = {
    annotationHoverEntityKey: '',
    revealedEntityKey: '',
  }

  constructor(props: Props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.isHoverTarget = this.isHoverTarget.bind(this)
  }

  handleClick() {
    this.props.onClick(this.props.entityKey)
  }

  handleMouseOut() {
    this.props.onMouseOut(this.props.entityKey)
  }

  handleMouseOver() {
    this.props.onMouseOver(this.props.entityKey)
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
