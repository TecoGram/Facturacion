import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './MainNavigationView';

import 'typeface-roboto';
import './index.css';

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
