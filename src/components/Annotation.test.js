import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Annotation from './Annotation'

describe('Annotation component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Annotation onClick={() => {}}>text</Annotation>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls `onClick` prop on click', () => {
    const onClick = jest.fn()
    const annotation = shallow(
      <Annotation onClick={onClick}>text</Annotation>
    )
    annotation.find('span').simulate('click')

    expect(onClick).toHaveBeenCalled()
  })

  it('calls `onMouseOut` prop on mouseout', () => {
    const onMouseOut = jest.fn()
    const annotation = shallow(
      <Annotation onMouseOut={onMouseOut}>text</Annotation>
    )
    annotation.find('span').simulate('mouseout')

    expect(onMouseOut).toHaveBeenCalled()
  })

  it('calls `onMouseOver` prop on mouseover', () => {
    const onMouseOver = jest.fn()
    const annotation = shallow(
      <Annotation onMouseOver={onMouseOver}>text</Annotation>
    )
    annotation.find('span').simulate('mouseover')

    expect(onMouseOver).toHaveBeenCalled()
  })
})
