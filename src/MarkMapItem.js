import React, {
  Component
} from 'react';
//import logo from './logo.svg';
//import './YPath.css';

export default class MarkMapItem extends Component {

	renderMapMark() {
		this.props.renderMark(this.props.mark, this.props.index);
	}


  render(){
    this.renderMapMark();

    return null;
  }

}