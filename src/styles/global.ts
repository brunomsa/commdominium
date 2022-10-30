import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body{
  font: 400 16px Roboto, sans-serif;
}

nav ul {
  list-style-type: none;
}

.ant-btn.delete {
    background-color: #c01616;
    border-color: #c01616;
    color: #fff !important;

    :hover {
      background-color: #8e1e1e;
      border-color: #8e1e1e;
    }
  }
`;
