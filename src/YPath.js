import React, {
  Component
} from 'react';
// import update from 'immutability-helper';
//import logo from './logo.svg';
import './YPath.css';
import YMap from './YMap';
//import YLine from './YLine';
//import MarksList from './MarksList';

//let marksIdentity = 0;

class YPath extends Component {

  initYandexMaps(map) {
    this.map = map;
  }

  
  render() {
    return (
      <div className="YPath" style={{ height: "100%", width: "100%" }} >
        <YMap id="map" apiSrc="https://api-maps.yandex.ru/2.1/?lang=en_RU" init={ this.initYandexMaps.bind(this) } />
      </div>
    );

  }
}

export default YPath;