// @flow

import React from 'react'
import autobind from 'react-autobind'
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

import type { SyntheticMouseEvent } from 'react-dom'

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

export type State = {
  readOnly: boolean,
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
  onBlur: (e: SyntheticFocusEvent) => void
  onChange: (e: SyntheticFocusEvent) => void
  onFocus: (e: SyntheticFocusEvent) => void
  onMouseDown: (e: SyntheticMouseEvent) => void
  onMouseUp: (e: SyntheticMouseEvent) => void
  state: State
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

    this.state = {
      readOnly: true,
    }

    autobind(this)
  }

  onBlur(e: SyntheticFocusEvent) {
    this.props.onBlur(e)
  }

  onChange(editorState: EditorState) {
    this.props.onChange(editorState)
  }

  onFocus(e: SyntheticFocusEvent) {
    this.props.onFocus(e)
  }

  // These mouse event handlers allow selections,
  // but they disallow actually modifying the text.
  onMouseDown() {
    this.setState({ readOnly: false })
  }

  onMouseUp() {
    this.setState({ readOnly: true })
  }

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        style={this.props.style.container}
      >
        <Editor
          customStyleMap={customStyleMap}
          editorState={this.props.editorState}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          readOnly={this.state.readOnly}
          spellCheck
          style={this.props.style.editor}
        />
      </div>
    )
  }
}
