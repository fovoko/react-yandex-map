import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import YMapHooks from './YMapHooks';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<YMapHooks mapId="map" apiSrc="https://api-maps.yandex.ru/2.1/?lang=en_RU" />, document.getElementById('root'));
registerServiceWorker();
