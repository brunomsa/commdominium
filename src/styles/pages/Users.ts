import styled from 'styled-components';

export const Users = styled.div`
  img.background-image {
    position: absolute;
    right: 0;
    top: 0;
    width: 40%;
    opacity: 10%;
    height: 100%;
    z-index: 0;
  }

  h1 {
    margin-bottom: 32px;
  }

  .form {
    width: 40%;

      .ant-form-item {
        min-width: 350px;
      }


    div.ant-form-item:last-child {
      text-align: end;
      button {
        margin-top: 40px
        width: 150px;
      }
    }
  }
`;
