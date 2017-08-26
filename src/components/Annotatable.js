// @flow

import React from 'react'
import {
  CompositeDecorator,
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'

import {
  PENDING_ANNOTATION_BLUE,
  PENDING_ANNOTATION_STYLE
} from '../constants'

import type {
  CompositeDecorator as CompositeDecoratorType,
  EditorState as EditorStateType,
  SyntheticFocusEvent
} from 'draft-js'

export type Block = {
  depth: number,
  entityRanges: ?Array<{
    key: string,
    length: number,
    offset: number,
  }>,
  inlineStyleRanges: ?Array<{
    key: string,
    length: number,
    offset: number,
    type: string,
  }>,
  key: string,
  text: string,
  type: string,
}

export type EntityMap = {
  [key: string]: {
    mutability: 'IMMUTABLE' | 'MUTABLE' | 'SEGMENTED',
    type: string,
    data: ?{ [key: string]: any }
  }
}

export type Props = {
  blocks: ?Array<Block>,
  customStyleMap: ?Object,
  decorators: ?Array<CompositeDecoratorType>,
  editorState: EditorStateType,
  entityMap: ?EntityMap,
  onBlur: SyntheticFocusEvent => void,
  onChange: EditorStateType => void,
  onFocus: SyntheticFocusEvent => void,
  style: {
    container: ?{ [key: string]: any },
    editor: ?{ [key: string]: any },
  }
}

export const createEditorState = (
  blocks: Array<Block>,
  entityMap: ?EntityMap,
  decorators: ?Array<CompositeDecoratorType>
) => {
  return EditorState.createWithContent(
    convertFromRaw({ blocks, entityMap: entityMap || {} }),
    new CompositeDecorator((decorators || []).length ? [].concat(decorators) : [])
  )
}

export const customStyleMap = {
  [PENDING_ANNOTATION_STYLE]: {
    backgroundColor: PENDING_ANNOTATION_BLUE,
  }
}

export default class Annotatable extends React.Component {
  handleBlur: Function
  handleChange: Function
  handleFocus: Function
  handleMouseDown: Function
  handleMouseUp: Function
  state: Object
  props: Props

  static defaultProps = {
    decorators: [],
    editorState: EditorState.createEmpty(),
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    style: {},
  }

  constructor(props: Props) {
    super(props)

    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)

    this.state = {
      readOnly: true,
    }
  }

  handleBlur(e: SyntheticFocusEvent) {
    this.props.onBlur(e)
  }

  handleChange(editorState: EditorState) {
    this.props.onChange(editorState)
  }

  handleFocus(e: SyntheticFocusEvent) {
    this.props.onFocus(e)
  }

  // These mouse event handlers allow selections,
  // but they disallow actually modifying the text.
  handleMouseDown() {
    this.setState({ readOnly: false })
  }

  handleMouseUp() {
    this.setState({ readOnly: true })
  }

  render() {
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        role="presentation"
        style={this.props.style.container}
      >
        <Editor
          customStyleMap={customStyleMap}
          editorState={this.props.editorState}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          readOnly={this.state.readOnly}
          spellCheck
          style={this.props.style.editor}
        />
      </div>
    )
  }
}
