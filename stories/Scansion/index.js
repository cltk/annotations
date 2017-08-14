import React from 'react'

import Annotatable from '../../src'
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
    return <Annotatable
      blocks={this.state.blocks}
      decorators={[{ strategy: scansionStrategy, component: GreekProsody }]}
      entityMap={this.state.entityMap}
    />
  }
}
