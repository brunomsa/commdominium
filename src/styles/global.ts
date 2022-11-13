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

  .ant-card-body{
    padding: 0;
  }

  .ant-popover-inner {
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 48%), 0 6px 16px 0 rgb(0 0 0 / 32%), 0 9px 28px 8px rgb(0 0 0 / 60%);
  }

  .ant-form-item-label > label .ant-form-item-tooltip {
    margin-left: 10px;
  }
`;
