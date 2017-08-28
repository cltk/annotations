import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import { AnnotationComponent as Annotation } from './Annotation'

describe('Annotation component', () => {
  const noop = () => {}

  it('renders correctly', () => {
    const tree = renderer.create(
      <Annotation
        entityKey="key"
        hoverEntityKey=""
        onClick={noop}
        onHover={noop}
      >
        text
      </Annotation>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls `onClick` prop on click', () => {
    const onClick = jest.fn()
    const annotation = shallow(
      <Annotation
        entityKey="key"
        hoverEntityKey=""
        onClick={onClick}
        onHover={noop}
      >
        text
      </Annotation>
    )
    annotation.find('span').simulate('click')

    expect(onClick).toHaveBeenCalled()
  })

  it('calls `onHover` prop on mouseenter', () => {
    const onHover = jest.fn()
    const annotation = shallow(
      <Annotation
        entityKey="key"
        hoverEntityKey=""
        onClick={noop}
        onHover={onHover}
      >
        text
      </Annotation>
    )
    annotation.find('span').simulate('mouseenter')

    expect(onHover).toHaveBeenCalled()
  })

  it('calls `onHover` prop on mouseleave', () => {
    const onHover = jest.fn()
    const C = Annotation('', onHover, noop)
    const annotation = shallow(
      <Annotation
        entityKey="key"
        hoverEntityKey=""
        onClick={noop}
        onHover={onHover}
      >
        text
      </Annotation>
    )
    annotation.find('span').simulate('mouseleave')

    expect(onHover).toHaveBeenCalled()
  })
})
