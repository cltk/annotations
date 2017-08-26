import React from 'react'
import {
  CompositeDecorator,
  EditorState,
  RichUtils,
  convertFromRaw,
} from 'draft-js'

import Annotatable, {
  AnnotationEditor,
  addNoteEntityToAnnotatable,
  annotationDecorator,
  createEditorState,
} from '../../src'
import { PENDING_ANNOTATION_STYLE } from '../../src/constants'
import { argonautica } from '../stubs'

export default class Annotating extends React.Component {
  constructor(props) {
    super(props)

    this.cancelEditing = this.cancelEditing.bind(this)
    this.handleAnnotatableChange = this.handleAnnotatableChange.bind(this)
    this.handleAnnotationClick = this.handleAnnotationClick.bind(this)
    this.handleAnnotationHover = this.handleAnnotationHover.bind(this)
    this.handleNoteEditorBlur = this.handleNoteEditorBlur.bind(this)
    this.handleNoteEditorChange =
      this.handleNoteEditorChange.bind(this)
    this.handleNoteEditorFocus =
      this.handleNoteEditorFocus.bind(this)
    this.saveAnnotation = this.saveAnnotation.bind(this)

    this.state = {
      hoverEntityKey: '',
      noteEditorReadOnly: true,
      noteEditorState: EditorState.createEmpty(),
      annotatableEditorState: createEditorState(
        argonautica,
        {},
        [annotationDecorator(
          '',
          this.handleAnnotationHover,
          this.handleAnnotationClick
        )]
      )
    }
  }

  cancelEditing(e) {
    e.preventDefault()

    this.setState({
      annotatableEditorState: RichUtils.toggleInlineStyle(
        this.state.annotatableEditorState,
        PENDING_ANNOTATION_STYLE
      ),
      noteEditorReadOnly: true,
      noteEditorState: EditorState.createEmpty(),
    })
  }

  handleAnnotatableChange(annotatableEditorState) {
    const selectionState = annotatableEditorState.getSelection()

    this.setState({
      annotatableEditorState: RichUtils.toggleInlineStyle(
        annotatableEditorState,
        PENDING_ANNOTATION_STYLE
      ),
      noteEditorReadOnly: !this.state.noteEditorReadOnly ||
        selectionState.isCollapsed()
    })
  }

  handleAnnotationHover(entityKey) {
    this.setState({
      annotatableEditorState: EditorState.set(
        this.state.annotatableEditorState, {
          decorator: new CompositeDecorator([
            annotationDecorator(
              entityKey,
              this.handleAnnotationHover,
              this.handleAnnotationClick
            )
          ])
        }
      ),
    })
  }

  handleAnnotationClick(entityKey) {
    const { annotatableEditorState } = this.state
    const contentState = annotatableEditorState.getCurrentContent()
    const entity = contentState.getEntity(entityKey)
    const data = entity.getData()

    this.setState({
      noteEditorReadOnly: false,
      noteEditorState: EditorState.createWithContent(convertFromRaw(data))
    })
  }

  handleNoteEditorBlur() {
    const { noteEditorState } = this.state

    if (!noteEditorState.getCurrentContent().hasText()) {
      this.setState({
        noteEditorReadOnly: true,
      })
    }
  }

  handleNoteEditorChange(noteEditorState) {
    this.setState({ noteEditorState })
  }

  handleNoteEditorFocus() {
    const { annotatableEditorState } = this.state
    const selectionState = annotatableEditorState.getSelection()

    if (!selectionState.isCollapsed()) {
      this.setState({
        annotatableEditorState: EditorState.forceSelection(
          annotatableEditorState,
          selectionState
        )
      })
    }
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
      ),
      noteEditorReadOnly: true,
      noteEditorState: EditorState.createEmpty(),
    })
  }

  render() {
    const {
      annotatableEditorState,
      noteEditorState,
      noteEditorReadOnly
    } = this.state

    return (
      <div>
        <AnnotationEditor
          editorState={noteEditorState}
          onBlur={this.handleNoteEditorBlur}
          onChange={this.handleNoteEditorChange}
          onFocus={this.handleNoteEditorFocus}
          readOnly={noteEditorReadOnly}
        />
        <div style={{ marginBottom: 10 }}>
          <button
            disabled={noteEditorReadOnly}
            onClick={this.cancelEditing}
          >
            Cancel
          </button>
          <button
            disabled={noteEditorReadOnly}
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
