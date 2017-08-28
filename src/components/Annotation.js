// @flow

import React from 'react'

import {
  ANNOTATION_BLUE,
  ANNOTATION_HOVER_BLUE
} from '../constants'

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

const Annotation = (
  hoverEntityKey: string,
  onHover: (entityKey: ?string) => void,
  onClick: (entityKey: string) => void
) => {
  return class AnnotationComponent extends React.Component {
    handleClick: Function
    handleMouseOut: Function
    handleMouseOver: Function
    isHoverTarget: void => boolean

    static defaultProps = {
      annotationHoverEntityKey: '',
      onClick: () => {},
      onMouseOut: () => {},
      onMouseOver: () => {},
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
      onClick(this.props.entityKey)
    }

    handleMouseOut() {
      onHover('')
    }

    handleMouseOver() {
      onHover(this.props.entityKey)
    }

    isHoverTarget() {
      return this.props.entityKey === hoverEntityKey
    }

    render() {
      const style = {
        cursor: 'pointer',
        backgroundColor: this.isHoverTarget() ?
          ANNOTATION_HOVER_BLUE :
          ANNOTATION_BLUE,
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
}

export default Annotation
