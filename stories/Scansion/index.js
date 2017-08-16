import React from 'react'

import Annotatable, { createEditorState } from '../../src'
import { argonautica } from '../stubs'
import GreekProsody, {
  addScansionToBlocks,
  scansionStrategy,
} from '../../src/decorators/GreekProsody'

export default class Scansion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...addScansionToBlocks(argonautica)
    }
  }

  render() {
    const { blocks, entityMap } = this.state
    const decorator = { strategy: scansionStrategy, component: GreekProsody }
    return <Annotatable
      editorState={createEditorState(blocks, entityMap, [decorator])}
    />
  }
}
