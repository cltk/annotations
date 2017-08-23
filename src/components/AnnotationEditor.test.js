import React from 'react'
import { EditorState } from 'draft-js'
import { shallow } from 'enzyme'

import AnnotationEditor from './AnnotationEditor'

describe('AnnotationEditor', () => {
  it('renders correctly', () => {
    const noop = () => {}
    const aEditor = shallow(
      <AnnotationEditor
        editorState={EditorState.createEmpty()}
        onCancel={noop}
        onChange={noop}
        onSave={noop}
        readOnly={true}
        reset={noop}
      />
    )

    expect(aEditor).toBeDefined()
  })
})
