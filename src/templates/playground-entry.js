import 'react-hot-loader';

import { SandboxComponentHot } from './playground-app';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    React.createElement(SandboxComponentHot),
    document.getElementById('app')
);
