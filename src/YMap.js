import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import MarksList from "./MarksList";
import loadYandexMapScript from "./helpers/loadYandexMapScript";
import "./YMap.css";

let marksIdentity = 0;

class YMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      marks: [],
    };

    this.placemarks = [];
  }

  componentDidMount() {
    let that = this;

    // Connect the initMap() function within this class to the global window context,
    // so Yandex Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Yandex Maps script, passing in the callback reference
    loadYandexMapScript(this.props.apiSrc).then(() => {
      window.ymaps.ready(() => {
        var map = new window.ymaps.Map(that.refs.map.id, {
          center: [56.735951, 38.853323],
          zoom: 16,
          controls: [],
          autoFitToViewport: "always",
        });
        this.map = map;

        map.events.add("click", this.clickMap.bind(this));

        this.renderPolygon();
      });
    });
  }

  clickMap(e) {
    let coords = e.get("coords");
    let name = "";

    window.ymaps
      .geocode(coords, { results: 1 })
      .then(function (res) {
        var go = res.geoObjects.get(0);
        name = go ? go.properties.get("name") : "";
      })
      .catch(function (err) {
        console.log("Couldn't detect address. " + err);

        name = "";
      })
      .then(() => {
        this.addMark(name, coords);
      });
  }

  getCenter() {
    if (this.map) {
      return this.map.getCenter();
    }
  }

  renderPolygon() {
    if (this.map) {
      let map = this.map;

      map.geoObjects.removeAll();

      var line = new global.ymaps.Polyline(
        [],
        {},
        {
          strokeColor: "#00000088",
          strokeWidth: 4,

          editorMaxPoints: 0,

          editorMenuManager: function (items) {
            items.length = 0;
            return items;
          },
        }
      );
      this.polyline = line;

      line.editor.events.add("vertexdragend", this.edgeMove, this);

      map.geoObjects.add(line);

      line.editor.startEditing();
    }
  }

  edgeMove(a) {
    let v = a.get("vertexModel");

    const marks = this.state.marks.slice();

    let ind = v.getIndex();
    let mark = marks[ind];
    marks[ind] = {
      id: mark.id,
      val: mark.val,
      coords: v.geometry.getCoordinates(),
    };

    this.setState({
      marks: marks,
    });
  }

  renderMark(mark, index) {
    if (this.polyline) {
      this.polyline.geometry.set(index, mark.coords);

      if (!this.placemarks[mark.id]) {
        let pm = new window.ymaps.Placemark(mark.coords, {
          balloonContent: mark.val,
        });
        this.placemarks[mark.id] = pm;
        this.map.geoObjects.add(pm);
      } else {
        this.placemarks[mark.id].geometry.setCoordinates(mark.coords);
        this.placemarks[mark.id].balloon.setData(mark.val);
      }
    }
  }

  getMap() {
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
            [hoverIndex, 0, dragMark],
          ],
        },
      })
    );
  }

  addMark(txt, coords) {
    let marks = this.state.marks.slice();

    if (!txt) {
      txt = "Item " + (marksIdentity + 1);
    }
    if (!coords) {
      coords = this.getCenter();
    }

    marks.push({
      id: "mark" + ++marksIdentity,
      val: txt,
      coords: coords,
    });

    this.setState({
      marks: marks,
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
      marks: marks,
    });
  }

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div
          className="YMap"
          id={this.props.id}
          ref="map"
          style={{ height: "100%", width: "100%" }}
        />
        <DndProvider backend={HTML5Backend}>
          <MarksList
            getMap={this.getMap.bind(this)}
            marks={this.state.marks}
            moveMark={this.moveMark.bind(this)}
            addMark={this.addMark.bind(this)}
            delMark={this.delMark.bind(this)}
            renderMark={this.renderMark.bind(this)}
          />
        </DndProvider>
      </div>
    );
  }
}

export default YMap;
