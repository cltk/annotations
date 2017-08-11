// @flow

import React from 'react'
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js'
import PropTypes from 'prop-types'
import 'draft-js/dist/Draft.css'

import Annotation from './Annotation'
import {
  ANNOTATION_ENTITY_TYPE,
  HIGHLIGHT_BLUE,
  PENDING_ANNOTATION_BLUE,
} from '../constants'

const findNoteEntities = (
  contentBlock: ContentBlock,
  callback: Function,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity()

      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === ANNOTATION_ENTITY_TYPE
      )
    },
    callback,
  )
}

export const decorator = new CompositeDecorator([
  {
    strategy: findNoteEntities,
    component: Annotation,
  },
])

export const styleMap = {
  PENDING_ANNOTATION: {
    backgroundColor: PENDING_ANNOTATION_BLUE,
  },
  HIGHLIGHT: {
    backgroundColor: HIGHLIGHT_BLUE,
  }
}

export default class Annotatable extends React.Component {
  handleChange: Function
  handleMouseDown: Function
  handleMouseUp: Function
  state: Object

  static defaultProps = {
    blocks: [],
    entityMap: {},
    style: {},
  }

  static propTypes = {
    blocks: PropTypes.arrayOf(PropTypes.shape({
      depth: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired,
      text: PropTypes.string,
      type: PropTypes.string.isRequired,
    })),
    entityMap: PropTypes.objectOf(PropTypes.object),
    style: PropTypes.shape({
      container: PropTypes.shape({
        // TODO: limit definable container styles
      }),
      editor: PropTypes.shape({
        // TODO: limit definable editor styles
      })
    })
  }

  constructor(props: {
    blocks: Array<Object>,
    entityMap: Object,
    style: Object,
  }) {
    super(props)
    
    this.handleChange = this.handleChange.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)

    this.state = {
      annotationEditorShown: true,
      editorState: EditorState.createEmpty(),
      readOnly: true,
    }
  }

  componentWillMount() {
    if (!this.props.blocks.length) {
      return
    }

    this.setState({
      editorState: EditorState.createWithContent(
        convertFromRaw({
          blocks: this.props.blocks,
          entityMap: this.props.entityMap,
        }),
        decorator
      )
    })
  }

  handleChange(editorState: EditorState) {
    this.setState({ editorState })
  }

  // These mouse event handlers allow selections,
  // but they disallow actually modifying the text.
  handleMouseDown() {
    this.setState({ readOnly: false })
  }

  handleMouseUp() {
    this.setState({ readOnly: true })
  }

  handleAnnotationButtonClick() {
    this.setState({
      annotationEditorShown: true,
    })
  }

  render() {
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        role="presentation"
        {...this.props.style.container}
      >
        <Editor
          customStyleMap={styleMap}
          editorState={this.state.editorState}
          onChange={this.handleChange}
          readOnly={this.state.readOnly}
          spellCheck
          {...this.props.style.editor}
        />
      </div>
    )
  }
}
