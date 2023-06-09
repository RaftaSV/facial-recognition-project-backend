import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    background: #21295C;
  }

  .appface{
    display: flex;
    width: 100vw;
    flex-direction: flex;
    align-items: start;
    justify-content: start;
  }
  .canva{
    position: absolute;
  }

  `;

export default GlobalStyle;
