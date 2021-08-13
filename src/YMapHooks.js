import React, { useState, useEffect, useRef, useCallback, useMemo /*Component*/ } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import MarksList from "./MarksList";
import loadYandexMapScript from "./helpers/loadYandexMapScript";
import "./YMap.css";

let marksIdentity = 0;

const YMapHooks = ( {mapId, apiSrc} ) => {
  const [marks, setMarks] = useState([]);
  const placemarks = useMemo( () => [], []);
  let [polyline, setPolyline] = useState(null);

  const mapRef = useRef( null );

  const addMark = useCallback((txt, coords) => {
    if ( !txt ) {
      txt = "Item " + (marksIdentity + 1);
    }
    if ( !coords ) {
      coords = getCenter();
    }

    setMarks( oldMarks => [ ...oldMarks, {
      id: "mark" + ++marksIdentity,
      val: txt,
      coords: coords,
    } ] );
  }, []);

  const edgeMove = useCallback((a) => {
    let v = a.get("vertexModel");
    let ind = v.getIndex();

    setMarks( oldMarks => {
      let newMarks = [ ...oldMarks ];
      let mark = newMarks[ind];
      newMarks[ind] = {
        id: mark.id,
        val: mark.val,
        coords: v.geometry.getCoordinates(),
      };
      return newMarks;
    });
  }, []);

  const clickMap = useCallback( (e) => {
    let coords = e.get("coords");
    let name = "";

    window.ymaps
      .geocode(coords, { results: 1 })
      .then((res) => {
        var go = res.geoObjects.get(0);
        name = go ? go.properties.get("name") : "";
      })
      .catch((err) => {
        console.log("Couldn't detect address. " + err);
        name = "";
      })
      .then(() => {
        addMark(name, coords);
      });
  }, [addMark]);

  const renderPolygon = useCallback( () => {
    if (mapRef.current) {

      mapRef.current.geoObjects.removeAll();

      let line = new global.ymaps.Polyline(
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
      setPolyline(line);

      line.editor.events.add("vertexdragend", edgeMove);

      mapRef.current.geoObjects.add(line);

      line.editor.startEditing();
    }
  }, [edgeMove]);

  const delMark = useCallback((index) => {
    setMarks( oldMarks => {

      let dm = oldMarks[index];

      mapRef.current.geoObjects.remove(placemarks[dm.id]);
      delete placemarks[dm.id];
      polyline.geometry.splice(index, 1);

      let newMarks = [...oldMarks];
      newMarks.splice(index, 1);
      return newMarks;
    } );
  }, [placemarks, polyline]);

  const moveMark = useCallback((dragIndex, hoverIndex) => {
    setMarks( oldMarks => {
      const dragMark = oldMarks[dragIndex];

      update([oldMarks], {
        marks: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragMark],
          ],
        },
      })
    });
  }, []);

  const renderMark = useCallback((mark, index) => {
    if (polyline) {
      polyline.geometry.set(index, mark.coords);

      if (!placemarks[mark.id]) {
        let pm = new window.ymaps.Placemark(mark.coords, {
          balloonContent: mark.val,
        });
        placemarks[mark.id] = pm;
        mapRef.current.geoObjects.add(pm);
      } else {
        placemarks[mark.id].geometry.setCoordinates(mark.coords);
        placemarks[mark.id].balloon.setData(mark.val);
      }
    }
  }, [placemarks, polyline]);

  useEffect(() => {

    // Connect the initMap() function within this class to the global window context,
    // so Yandex Maps can invoke it
    //window.initMap = initMap;

    // Asynchronously load the Yandex Maps script, passing in the callback reference
    loadYandexMapScript(apiSrc).then(() => {
      window.ymaps.ready(() => {
        mapRef.current = new window.ymaps.Map(mapId, {
          center: [56.735951, 38.853323],
          zoom: 16,
          controls: [],
          autoFitToViewport: "always",
        });

        mapRef.current.events.add("click", clickMap);

        renderPolygon();
      });
    });
  }, [apiSrc, mapId, clickMap, renderPolygon]);

  const getCenter = () => {
    if (mapRef.current) {
      return mapRef.current.getCenter();
    }
  }

  const getMap  = () => {
    return mapRef.current;
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        className="YMap"
        id={mapId}
        ref={ mapRef }
        style={{ height: "100%", width: "100%" }}
      />
      <DndProvider backend={HTML5Backend}>
        <MarksList
          getMap={getMap}
          marks={marks}
          addMark={addMark}
          delMark={delMark}
          moveMark={moveMark}
          renderMark={renderMark}
        />
      </DndProvider>
    </div>
  );
}

export default YMapHooks;