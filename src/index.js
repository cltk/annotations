// @flow

import React from 'react'
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js';
import PropTypes from 'prop-types'

const ANNOTATION_ENTITY_TYPE = '--draft-js-annotations_NOTE'

export class Annotation extends React.Component {
  render() {
    return (
      <span>{this.props.children}</span>
    )
  }
}

export const findNoteEntities = (
  contentBlock: ContentBlock,
  callback: Function,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity();

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
    backgroundColor: '#b1d7ff',
  },
  HIGHLIGHT: {
    backgroundColor: '#eceef1'
  }
}

export default class Annotatable extends React.Component {
  handleChange: Function;
  handleMouseDown: Function;
  handleMouseUp: Function;
  state: Object;

  static defaultProps = {
    blocks: [],
    entityMap: {},
  }

  static propTypes = {
    blocks: PropTypes.arrayOf(PropTypes.shape({
      depth: PropTypes.number.isRequired,
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      text: PropTypes.string,
      type: PropTypes.string.isRequired,
    })),
    entityMap: PropTypes.objectOf(PropTypes.object),
  }

  constructor(props: {
    blocks: Array<Object>,
    entityMap: Object,
  }) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)

    this.state = {
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

  render() {
    return (
      <div
        className="p2"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        role="presentation"
      >
        <Editor
          customStyleMap={styleMap}
          editorState={this.state.editorState}
          onChange={this.handleChange}
          readOnly={this.state.readOnly}
          spellCheck
        />
      </div>
    )
  }
}
