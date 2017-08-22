import React from 'react'
import { EditorState } from 'draft-js'

import Annotatable, {
  AnnotationEditor,
  addNoteEntityToAnnotatable,
  annotationDecorator,
  createEditorState,
} from '../../src'
import { argonautica } from '../stubs'

export default class Annotating extends React.Component {
  constructor(props) {
    super(props)

    this.cancelEditing = this.cancelEditing.bind(this)
    this.handleAnnotatableChange = this.handleAnnotatableChange.bind(this)
    this.handleAnnotationEditorChange =
      this.handleAnnotationEditorChange.bind(this)
    this.saveAnnotation = this.saveAnnotation.bind(this)

    this.state = {
      annotationEditorReadOnly: true,
      noteEditorState: EditorState.createEmpty(),
      annotatableEditorState: createEditorState(argonautica, {}, [annotationDecorator])
    }
  }

  cancelEditing(e) {
    e.preventDefault()

    this.setState({ annotationEditorReadOnly: true })
  }

  handleAnnotatableChange(annotatableEditorState) {
    const selectionState = annotatableEditorState.getSelection()

    this.setState({
      annotatableEditorState,
      annotationEditorReadOnly: !this.state.annotationEditorReadOnly ||
        selectionState.isCollapsed()
    })
  }

  handleAnnotationEditorChange(noteEditorState) {
    this.setState({ noteEditorState })
  }

  saveAnnotation(e) {
    e.preventDefault()

    const {
      annotatableEditorState,
      noteEditorState,
    } = this.state

    this.setState({
      annotatableEditorState: addNoteEntityToAnnotatable(
        annotatableEditorState,
        noteEditorState
      )
    })
  }

  render() {
    const {
      annotatableEditorState,
      noteEditorState,
      annotationEditorReadOnly
    } = this.state

    return (
      <div>
        <AnnotationEditor
          editorState={noteEditorState}
          onChange={this.handleAnnotationEditorChange}
          readOnly={annotationEditorReadOnly}
        />
        <div style={{ marginBottom: 10 }}>
          <button
            disabled={annotationEditorReadOnly}
            onClick={this.cancelEditing}
          >
            Cancel
          </button>
          <button
            disabled={annotationEditorReadOnly}
            onClick={this.saveAnnotation}
          >
            Add note
          </button>
        </div>
        <Annotatable
          editorState={annotatableEditorState}
          onChange={this.handleAnnotatableChange}
        />
      </div>
    )
  }
}
