import { render } from 'react-dom';
import React, { FunctionComponent} from 'react';
import './index.css';
import { Map } from './map';

const App: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Map />
    </React.Fragment>
  );
};
render(<App />, document.getElementById('root'));