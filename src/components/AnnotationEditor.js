// @flow

import React from 'react'
import {
  Editor,
  EditorState,
  Modifier,
  convertToRaw,
} from 'draft-js'

import type {
  EditorState as EditorStateType
} from 'draft-js'

export type Props = {
  editorState: EditorStateType,
  onCancel: Event => void,
  onChange: EditorState => void,
  onSave: (Event, EditorStateType) => void,
  readOnly: boolean,
  reset: void => void,
  style: ?{ [key: string]: any },
}

export const NOTE_ENTITY_TYPE = '--annotatable-NOTE'

export const addNoteEntityToAnnotatable = (
  annotatableEditorState: EditorStateType,
  noteEditorState: EditorStateType,
): EditorStateType => {
  const contentState = annotatableEditorState.getCurrentContent()
  const selectionState = annotatableEditorState.getSelection()
  const body = convertToRaw(noteEditorState.getCurrentContent())
  const contentStateWithEntity = contentState.createEntity(
    NOTE_ENTITY_TYPE,
    'MUTABLE',
    body,
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
  const contentStateWithNote = Modifier.applyEntity(
    contentStateWithEntity,
    selectionState,
    entityKey
  )

  return EditorState.set(
    annotatableEditorState, {
      currentContent: contentStateWithNote
    }
  )
}

export default class AnnotationEditor extends React.Component {
  editor: Editor
  focus: Function
  handleCancel: Function
  handleChange: Function
  handleSave: Function
  state: { editorState: EditorStateType }

  static defaultProps = {
    editorState: EditorState.createEmpty(),
    onChange: () => {},
    readOnly: false,
    reset: () => {},
    style: {
      border: '1px solid #d3d3d3',
      borderRadius: 2,
      maxWidth: 480,
      padding: '0.5em',
    }
  }

  constructor(props: Props) {
    super(props)

    this.focus = () => this.editor.focus()
    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  handleChange(editorState: EditorState) {
    this.props.onChange(editorState)

    this.setState({ editorState })
  }

  handleCancel(e: Event) {
    this.props.onCancel(e)
  }

  handleSave(e: Event) {
    this.props.onSave(e, this.state.editorState)
  }

  render() {
    return (
      <div onClick={this.focus} role="present" style={this.props.style}>
        <Editor
          editorState={this.props.editorState}
          onChange={this.handleChange}
          readOnly={this.props.readOnly}
          ref={c => { this.editor = c }}
          spellCheck
        />
      </div>
    )
  }
}
