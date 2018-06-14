import React, { Component } from 'react';
//import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MarkItem from './MarkItem';
import MarkMapItem from './MarkMapItem';

const style = {
	//width: "210px",
	float: "left",
	zIndex: 100,
	top: "10px",
	left: "10px",
	position: "absolute",
	border: "2px dashed red",
	minHeight: "40px",
	padding: "3px",
	overflowY: "scroll",
	maxHeight: '95%'
};

class MarksList extends Component {

	componentWillMount(){
		this.setState(	{
			txt: ''
		});		
	}

	moveMark(dragIndex, hoverIndex) {
		if (this.props.moveMark) {
			this.props.moveMark(dragIndex, hoverIndex);
		}
	}

	btnClick(){
		if (this.props.addMark){
			this.props.addMark(this.refs.txtMark.value);
		}
	}

	txtChange(e){
		this.setState(	{
			txt: e.target.value
		});
	}

	deleteMark(index){

		if (this.props.delMark){
			this.props.delMark(index);
		}
	}

	render() {
		const marks = this.props.marks;

		return (
			<div className="MarksList" style={style}>
				<input type="text" id="txtMark" key="txtMark" ref="txtMark" style={ {float: "left", width:"160px"} } onChange={this.txtChange.bind(this)} />
				<button ref="btnAdd" id="btnAdd" disabled={!this.state.txt} onClick={this.btnClick.bind(this)} style={ {float:"left", width: 30, height: 25, cursor: "pointer"} } >+</button>
				<div style={ {clear: "both" } }>
				{marks.map((mark, i) => (
					<MarkItem
						key={mark.id}
						index={i}
						id={mark.id}
						text={mark.val}
						moveMark={this.moveMark.bind(this)}
						deleteMark={this.deleteMark.bind(this)}
						mark={mark}
						renderMark={this.props.renderMark}
					/>
				))}
				{marks.map((mark, i) => (
					<MarkMapItem
						key={mark.id}
						index={i}
						id={mark.id}
						text={mark.val}
						// moveMark={this.moveMark.bind(this)}
						// deleteMark={this.deleteMark.bind(this)}
						mark={mark}
						renderMark={this.props.renderMark}
					/>
				))}				
				</div>
			</div>
		)
	}
};

export default  DragDropContext(HTML5Backend)(MarksList);