import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './custom/App'

import 'fixed-data-table/dist/fixed-data-table.css'
import './index.css'

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
