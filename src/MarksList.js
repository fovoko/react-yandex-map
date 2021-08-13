import React, { Component } from 'react';
import MarkItem from './MarkItem';
import MarkMapItem from './MarkMapItem';

const styleMarksList = {
	float: "left",
	zIndex: 100,
	top: "10px",
	left: "10px",
	position: "absolute",
	border: "2px dashed green",
	minHeight: "40px",
	padding: "3px",
	overflowY: "scroll",
	maxHeight: '95%'
};

const styleTxtMark = { 
	float: "left", 
	width:"160px", 
	height: "19px", 
	marginBottom:"0.5rem" 
};

const styleBtnAdd = {
	float:"left", 
	width: 30,
	height: 25, 
	cursor: "pointer"
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
			<div className="MarksList" style={ styleMarksList }>
				<div style={ {} }>
					<input type="text" id="txtMark" key="txtMark" ref="txtMark" style={ styleTxtMark } onChange={this.txtChange.bind(this)} />
					<button ref="btnAdd" id="btnAdd" disabled={!this.state.txt} onClick={this.btnClick.bind(this)} style={ styleBtnAdd } >+</button>
				</div>
				<div style={ {clear: "both" } }>
				{
				marks.map((mark, i) => (
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
				)) }
				{
				marks.map((mark, i) => (
					<MarkMapItem
						key={mark.id}
						index={i}
						id={mark.id}
						text={mark.val}
						mark={mark}
						renderMark={this.props.renderMark}
					/>
				))}				
				</div>
			</div>
		)
	}
}

export default MarksList;