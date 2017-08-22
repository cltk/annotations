import React from 'react'
import renderer from 'react-test-renderer'
import { ContentState, EditorState } from 'draft-js'
import { shallow } from 'enzyme'

import Annotatable from './Annotatable'

test('Annotatable', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Annotatable editorState={EditorState.createEmpty()} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('sets `state.readOnly` to `false` on mousedown', () => {
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} />
    )

    expect(annotatable.state.readOnly).toBe(true)

    const div = annotatable.find('div')[0]

    div.simulate('mousedown')

    expect(annotatable.state.readOnly).toBe(false)
  })

  it('resets `state.readOnly` to `true` on mouseup', () => {
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} />
    )

    expect(annotatable.state.readOnly).toBe(true)

    const div = annotatable.find('div')[0]

    div.simulate('mousedown')

    expect(annotatable.state.readOnly).toBe(false)

    div.simulate('mousedown')

    expect(annotatable.state.readOnly).toBe(true)
  })

  it('accepts a starting `editorState`', () => {
    const text = "Arma virumque cano"
    const content = ContentState.createFromText(text)
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createWithContent(content)} />
    )
    const editorState = annotatable.state.editorState.toRaw()

    expect(editorState.blocks[0]).toEqual(text)
  })

  it('accepts an `onBlur` prop and calls it on blur', () => {
    const onBlur = jest.fn()
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} onBlur={onBlur} />
    )
    const editor = annotatable.find('div')[0].firstChild

    editor.simulate('blur')

    expect(onBlur).toHaveBeenCalled()
  })

  it('accepts an `onChange` prop and calls it on change', () => {
    const onChange = jest.fn()
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} onChange={onChange} />
    )
    const editor = annotatable.find('div')[0].firstChild

    editor.simulate('change')

    expect(onChange).toHaveBeenCalled()
  })

  it('accepts an `onFocus` prop and calls it on focus', () => {
    const onFocus = jest.fn()
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} onFocus={onFocus} />
    )
    const editor = annotatable.find('div')[0].firstChild

    editor.simulate('focus')

    expect(onFocus).toHaveBeenCalled()
  })
})
