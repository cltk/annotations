import React from 'react'
import { ContentState, Editor, EditorState, genKey } from 'draft-js'
import { shallow } from 'enzyme'

import Annotatable, { createEditorState } from './Annotatable'

describe('Annotatable', () => {
  it('renders', () => {
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} />
    )

    expect(annotatable).toBeDefined()
  })

  it('sets `state.readOnly` to `false` on mousedown', () => {
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} />
    )

    expect(annotatable.state().readOnly).toBe(true)

    const div = annotatable.find('div').first()

    div.simulate('mouseDown')

    expect(annotatable.state('readOnly')).toBe(false)
  })

  it('resets `state.readOnly` to `true` on mouseup', () => {
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} />
    )

    const div = annotatable.find('div')

    div.simulate('mouseDown')

    expect(annotatable.state().readOnly).toBe(false)

    div.simulate('mouseUp')

    expect(annotatable.state().readOnly).toBe(true)
  })

  it('accepts a starting `editorState`', () => {
    const text = "Arma virumque cano"
    const content = ContentState.createFromText(text)
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createWithContent(content)} />
    )
    const editorState = annotatable.childAt(0).props().editorState

    expect(editorState.getCurrentContent().hasText(text)).toBe(true)
  })

  it('accepts an `onBlur` prop and calls it on blur', () => {
    const onBlur = jest.fn()
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} onBlur={onBlur} />
    )
    const editor = annotatable.find(Editor)

    editor.simulate('blur')

    expect(onBlur).toHaveBeenCalled()
  })

  it('accepts an `onChange` prop and calls it on change', () => {
    const onChange = jest.fn()
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} onChange={onChange} />
    )
    const editor = annotatable.find(Editor)

    editor.simulate('change')

    expect(onChange).toHaveBeenCalled()
  })

  it('accepts an `onFocus` prop and calls it on focus', () => {
    const onFocus = jest.fn()
    const annotatable = shallow(
      <Annotatable editorState={EditorState.createEmpty()} onFocus={onFocus} />
    )
    const editor = annotatable.find(Editor)

    editor.simulate('focus')

    expect(onFocus).toHaveBeenCalled()
  })

  describe('createEditorState()', () => {
    it('returns an instance of EditorState', () => {
      const blocks = [{
        depth: 1,
        key: genKey(),
        text: 'text',
        type: 'unstyled'
      }]
      const editorState = createEditorState(blocks)

      expect(editorState).toBeInstanceOf(EditorState)
    })

    it('accepts an `entityMap`', () => {
      const blocks = [{
        depth: 1,
        entityRanges: [{
          key: '0',
          length: 5,
          offset: 1,
        }],
        key: genKey(),
        text: 'lorem ipsum',
        type: 'unstyled',
      }]
      const entityMap = {
        '0': {
          mutability: 'IMMUTABLE',
          type: 'BOLD',
          data: {}
        }
      }
      const editorState = createEditorState(blocks, entityMap)
      const contentState = editorState.getCurrentContent()
      const entity = contentState.getEntity('1').toJSON()

      expect(entity).toMatchObject(entityMap[0])
    })
  })
})
