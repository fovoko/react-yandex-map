import React from 'react';
import { configure, shallow,  mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import YMap from '../YMap';

configure({adapter: new Adapter() });

describe('YPath tests', ()=>{

  // it('YMap test', () => {
  //   const wrapper = shallow(<YMap />);
  //   expect(wrapper.find('div.YMap')).toHaveLength(1) ;

  //   expect(wrapper.contains('<MarksList>')).toBeFalsy() ;

  // });

  it('YMap test point add func', () => {
    const wrapper = shallow(<YMap />);

    //const onInit = jest.fn(()=>{});
    //wrapper.setProps({init: onInit});
    //expect(onInit).toBeCalled();

    //expect(wrapper.state({})).tobee

    wrapper.instance().map = {};
    wrapper.instance().getCenter = jest.fn(()=>{return [99, 98]});
    wrapper.update();

    wrapper.instance().addMark( 'Point');

    expect(wrapper.state()).toEqual({marks:
      [{
        coords: [99, 98],
        id: 'mark1',
        val: 'Point'
      }]});

    wrapper.instance().addMark(undefined, [1, 2]);
    expect(wrapper.state()).toEqual({marks:
      [{
        coords: [99, 98],
        id: 'mark1',
        val: 'Point'
      },{
        coords: [1, 2],
        id: 'mark2',
        val: 'Item 2'
      }
      ]});
      

  });


});
