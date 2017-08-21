import React from 'react'
import renderer from 'react-test-renderer'
import { EditorState } from 'draft-js'
import Annotatable from './Annotatable'

test('Annotatable', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Annotatable editorState={EditorState.createEmpty()} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
