import React from 'react'
import { shallow, mount } from './enzyme'
import { spy } from 'sinon'

import App from '../app'
import fetchData from '../supplement/fetch'
import LeftPanel from '../components/leftPanel'
import Directions from '../components/directions'


const setup = (props={}, state=null) => {
  const wrapper = shallow(<App {...props} />)
  if (state) wrapper.setState(state)
  return wrapper;
}

describe('App component', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<App debug />);
    const wrapper = shallow(<App/>)
    expect(wrapper.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  });
});

describe('Left panel component', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<LeftPanel classes={'drawerHeader'} theme={'direction'} />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  })
})


