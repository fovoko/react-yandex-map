import {Component} from 'react';

export default class MarkMapItem extends Component {

	renderMapMark() {
		this.props.renderMark(this.props.mark, this.props.index);
	}

  render(){
    this.renderMapMark();

    return null;
  }
}