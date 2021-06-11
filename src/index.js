import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import YMap from './YMap';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<YMap id="map" apiSrc="https://api-maps.yandex.ru/2.1/?lang=en_RU" />, document.getElementById('root'));
registerServiceWorker();
