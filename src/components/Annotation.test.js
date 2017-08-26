import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Annotation from './Annotation'

describe('Annotation component', () => {
  const noop = () => {}

  it('renders correctly', () => {
    const C = Annotation('', noop, noop)
    const tree = renderer.create(
      <C>text</C>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls `onClick` prop on click', () => {
    const onClick = jest.fn()
    const C = Annotation('', noop, onClick)
    const annotation = shallow(
      <C>text</C>
    )
    annotation.find('span').simulate('click')

    expect(onClick).toHaveBeenCalled()
  })

  it('calls `onHover` prop on mouseout', () => {
    const onHover = jest.fn()
    const C = Annotation('', onHover, noop)
    const annotation = shallow(
      <C>text</C>
    )
    annotation.find('span').simulate('mouseout')

    expect(onHover).toHaveBeenCalled()
  })

  it('calls `onHover` prop on mouseover', () => {
    const onHover = jest.fn()
    const C = Annotation('', onHover, noop)
    const annotation = shallow(
      <C>text</C>
    )
    annotation.find('span').simulate('mouseover')

    expect(onHover).toHaveBeenCalled()
  })
})
