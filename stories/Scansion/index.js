import React from 'react'

import Annotatable, { createEditorState } from '../../src'
import { argonautica } from '../stubs'
import {
  addScansionToBlocks,
  greekProsodyDecorator,
} from '../../src'

export default class Scansion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...addScansionToBlocks(argonautica)
    }
  }

  render() {
    const { blocks, entityMap } = this.state
    return (
      <Annotatable
        editorState={
          createEditorState(blocks, entityMap, [greekProsodyDecorator])
        }
      />
    )
  }
}
