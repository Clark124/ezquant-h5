import React from 'react';
import ReactDOM from 'react-dom';

// import 'antd-mobile/dist/antd-mobile.css'
import store from './store'
import './asstes/css/common.css'
import { Provider } from 'react-redux'
import Routers from '../src/router/router';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
        <Routers />
    </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
