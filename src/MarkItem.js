import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
//import ItemTypes from './ItemTypes';

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
	position: "relative"
};

const styleCross ={
	float: "right", 
	width: "30px", 
	height: "30px",
	lineHeight: "30px",
	backgroundColor: "white",
	cursor: "pointer",
	position: "absolute",
	top: "2px",
	right: "2px"
};

const markSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
};

const ItemTypes = {
	MARK: 'mark'
};


const markTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveMark(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}


class MarkItem extends Component {
	
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		text: PropTypes.string.isRequired,
		moveMark: PropTypes.func.isRequired,
		renderMark: PropTypes.func.isRequired
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		var res = (nextProps.mark.id !== this.props.mark.id) || 
			( (nextProps.mark.coords[0] !== this.props.mark.coords[0]) || (nextProps.mark.coords[1] !== this.props.mark.coords[1])) ||
			(nextProps.index !== this.props.index) ||
			(nextProps.isDragging === true) || (this.props.isDragging === true);
		return res;
	}

	// renderMapMark() {
	// 	if (this.props.renderMark){
	// 		this.props.renderMark(this.props.mark, this.props.index);
	// 	}
	// }

	render() {
		const {
			text,
			isDragging,
			connectDragSource,
			connectDropTarget,
		} = this.props
		const opacity = isDragging ? 0 : 1

		//this.renderMapMark();

		return connectDragSource(
			connectDropTarget(<div style={{ ...style, opacity }}>
					{text} <a onClick={ (e)=>{ this.props.deleteMark(this.props.index); e.preventDefault(); } } style={ styleCross } >x</a>
				</div>)
		)
	}
}

export default DropTarget(ItemTypes.MARK, markTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))(DragSource(ItemTypes.MARK, markSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))(MarkItem));

/*

*/