import React from 'react';
import YPath from '../YPath';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import YMap from '../YMap';

configure({adapter: new Adapter() });


describe('YPath test', ()=>{

  const wrapper = shallow(<YPath />);

  it('YPath renders without crashing', () => {
    expect(wrapper.find(YMap)).toHaveLength(1) ;
  });


});
