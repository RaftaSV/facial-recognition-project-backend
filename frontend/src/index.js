import React from 'react';
import ReactDOM from 'react-dom/client';
import Enrollment from './pages/Enrollment';
import FaceLogin from './pages/FaceLogin';
import GlobalStyle from './styles/global';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    {/* <Enrollment /> */}
    <FaceLogin />
  </React.StrictMode>
);
