import React, {
  Component
} from 'react';
import update from 'immutability-helper';
//import logo from './logo.svg';
//import './YPath.css';
import MarksList from './MarksList';
import loadYandexMapScript from './helpers/loadYandexMapScript'
import MarkMapItem from './MarkMapItem';

let marksIdentity = 0;

class YMap extends Component {

  constructor(props){
    super(props);

    this.state = {
      marks: []
    };

    this.placemarks = [];

  }

  componentDidMount() {
    let that = this;

    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadYandexMapScript(this.props.apiSrc)
      .then(() => {
        window.ymaps.ready(() => {
          //console.log('YMap ready this', this);
          var map = new window.ymaps.Map(that.refs.map.id, {
            center: [56.735951, 38.853323],
            zoom: 16,
            controls: [],
            autoFitToViewport: 'always'
          });
          this.map = map;

          // window.addEventListener("resize", ()=>{
          //   this.map.container.fitToViewport();
          // });

          map.events.add('click', this.clickMap.bind(this));

          if (typeof that.props.init === 'function') {
            that.props.init(map);
          }

          this.renderPolygon();

        });
      });
  }

  clickMap(e) {
    let coords = e.get('coords');

    if (this.addMark) {
      this.addMark("", coords);
    }

  }

  getCenter() {
    if (this.map) {
      return this.map.getCenter();
    }
  }

  // polylineChange(e) {

  //   var coordinates = e.get('newCoordinates'),
  //     newLength = coordinates.length,
  //     oldCoordinates = e.get('oldCoordinates'),
  //     oldLength = oldCoordinates.length;

  //   if (newLength === oldLength) {

  //     let arrChanged = [];

  //     for (let i = 0; i < newLength; ++i) {
  //       if ((coordinates[i][0] !== oldCoordinates[i][0]) && (coordinates[i][1] !== oldCoordinates[i][1])) {
  //         arrChanged.push(i);
  //       }
  //     }

  //     const marks = this.state.marks.slice();
      
  //     for (let k = 0; k<arrChanged.length; ++k){

  //       let l = arrChanged[k];

  //       let mark = marks[l];
  //       marks[l] = { id: mark.id, val: mark.val, coords: coordinates[l] };
    
  //     }
  //     // this.setState({
  //     //   marks: marks
  //     // });

  //   }
  // }

  renderPolygon() {
    if ( this.map ) {
      let map = this.map;

      map.geoObjects.removeAll();

      var line = new global.ymaps.Polyline([] /*marks.map((item) => {
        return item.coords
      })*/, {}, {
        strokeColor: "#00000088",
        strokeWidth: 4,

        editorMaxPoints: 0,//marks.length, //remove intermediate points - avoiding adding new vertices via map 
        // editorMinPoints: marks.length,
        editorMenuManager: function (items) {
          items.length = 0;
          return items;
      }        
      });
      this.polyline = line;

      //this.polyline.editor.options.set( {maxPoints: 0} );
      //line.geometry.events.add('change', this.polylineChange, this);

      line.editor.events.add('vertexdragend', this.edgeMove, this);

      map.geoObjects.add(line);

      
      line.editor.startEditing();

    }
  }


  edgeMove(a) {
    //console.log(a.get('vertexModel'));
    let v = a.get('vertexModel');

    const marks = this.state.marks.slice();
    
    let ind = v.getIndex();
    let mark = marks[ind];
    marks[ind] = { id: mark.id, val: mark.val, coords: v.geometry.getCoordinates() };
  
    this.setState({
      marks: marks
    });

  }
  

  renderMark(mark, index){
    if (this.polyline) {
      this.polyline.geometry.set(index, mark.coords);

      if (!this.placemarks[mark.id]) {
        let pm = new window.ymaps.Placemark(mark.coords, {
          balloonContent: mark.val
        });
        this.placemarks[mark.id] = pm;
        this.map.geoObjects.add(pm);
      } else {
        this.placemarks[mark.id].geometry.setCoordinates(mark.coords);
        this.placemarks[mark.id].balloon.setData(mark.val);
      }
    }
  }

  getMap(){
    return this.map;
  }

  moveMark(dragIndex, hoverIndex) {
    const marks = this.state.marks;
    const dragMark = marks[dragIndex];

    this.setState(
      update(this.state, {
        marks: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragMark]
          ],
        },
      })
    );
  }

  addMark(txt, coords) {
    let marks = this.state.marks.slice();

    if (!txt) {
      txt = 'Item ' + (marksIdentity+1);
    }
    if (!coords) {
      coords = this.getCenter();
    }

    marks.push({
      id: 'mark' + (++marksIdentity),
      val: txt,
      coords: coords
    });

    //this.polyline.editor.setOptions({maxPoints: marks.length});
    
    this.setState({
      marks: marks
    });
  }

  delMark(index) {
    let dm = this.state.marks[index];
    this.map.geoObjects.remove(this.placemarks[dm.id]);
    delete this.placemarks[dm.id];


    let marks = this.state.marks.slice();
    marks.splice(index, 1);

    this.polyline.geometry.splice(index, 1);

    this.setState({
      marks: marks
    });
  }
  
 
  render() {
    return ( 
      <div style={{ height: "100%", width: "100%" }} >
        <div className="YMap" id={ this.props.id } ref="map" style={{ height: "100%", width: "100%" }} />
        <MarksList getMap={ this.getMap.bind(this) } marks={ this.state.marks } 
          moveMark={ this.moveMark.bind(this) } addMark={ this.addMark.bind(this) } delMark={ this.delMark.bind(this) } 
          renderMark={ this.renderMark.bind(this) } /> 
				{/* {this.state.marks.map((mark, i) => (
					<MarkMapItem
						key={mark.id}
						index={i}
						id={mark.id}
						text={mark.val}
						// moveMark={this.moveMark.bind(this)}
						// deleteMark={this.deleteMark.bind(this)}
						mark={mark}
						renderMark={ this.renderMark.bind(this) } */}
					/>
				))}				 
      </div >
    );
  }
}

export default YMap;