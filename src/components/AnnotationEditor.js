// @flow

import React from 'react'
import PropTypes from 'prop-types'
import {
  Editor,
  EditorState,
} from 'draft-js'

export default class AnnotationEditor extends React.Component {
  editor: Editor
  focus: Function
  handleCancel: Function
  handleChange: Function
  handleSave: Function
  state: { editorState: EditorState }

  static defaultProps = {
    editorState: EditorState.createEmpty(),
    onChange: () => {},
    readOnly: false,
    reset: () => {},
  }

  static propTypes = {
    editorState: PropTypes.shape({}),
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    reset: PropTypes.func,
  }

  constructor(props: {
    editorState: EditorState,
    onCancel: Event => void,
    onChange: EditorState => void,
    onSave: (Event, EditorState) => void,
    readOnly: boolean,
    reset: void => void,
  }) {
    super(props)

    this.focus = () => this.editor.focus()
    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)

    this.state = {
      editorState: props.editorState,
    }
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
      <div onClick={this.focus} role="present">
        <Editor
          editorState={this.state.editorState}
          onChange={this.handleChange}
          readOnly={this.props.readOnly}
          ref={c => { this.editor = c }}
          spellCheck
        />
      </div>
    )
  }
}
