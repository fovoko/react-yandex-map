import React from 'react';
import { configure, shallow,  mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import MarksList from '../MarksList';
import MarkItem from '../MarkItem';

// it('simulates click events', () => {
//   const onButtonClick = sinon.spy();
//   const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
//   wrapper.find('button').simulate('click');
//   expect(onButtonClick).to.have.property('callCount', 1);
// });

configure({adapter: new Adapter() });

//https://react-dnd.github.io/react-dnd/docs-testing.html
describe('MarksList tests', ()=>{

  it('MarksList test text change + add button click calls this.props.addMark', () => {

    const marks = [{
      coords: [99, 98],
      id: 'mark1',
      val: 'Point'
    },{
      coords: [1, 2],
      id: 'mark2',
      val: 'Item 2'
    }
    ];

    let onAddMark = jest.fn();

    const OriginalMarkList = MarksList.DecoratedComponent;

    const identity = el => el;

    const wrapper = shallow(<OriginalMarkList marks={marks} connectDragSource={identity} addMark={onAddMark}  />);

    expect(wrapper.find(MarkItem)).toHaveLength(2) ;

    const sMarkName = 'Some text';

    wrapper.find('input#txtMark').simulate('change', {target: {value: sMarkName}});

    const instance = wrapper.instance();
    instance.refs = {
      txtMark: {
            value: sMarkName
        }
    };

    wrapper.find('#btnAdd').simulate('click', { preventDefault() {} });
    expect(onAddMark).toBeCalled();
    

//    expect(wrapper.contains('<MarkItem>')).toBeFalsy() ;

  });

  // it('MarksList ', () => {
  //   const wrapper = mount(<YMap />);

  //   const onInit = jest.fn(()=>{});

  //   wrapper.setProps({init: onInit});
  //   expect(onInit).toBeCalled();
  // });


});
