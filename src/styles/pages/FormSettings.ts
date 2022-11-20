import styled from 'styled-components';

export const FormSettings = styled.div`
  img.background-image {
    position: fixed;
    right: 0;
    top: 0;
    width: 40%;
    opacity: 10%;
    height: 100%;
    z-index: 0;
  }

  .form {
    width: 40%;

    .ant-form-item {
      min-width: 350px;
    }

    div.ant-form-item:last-child {
      text-align: end;
      button {
        margin-top: 40px;
        margin-bottom: 20px;
        width: 150px;
      }
    }
  }

  @media screen and (max-width: 1080px) {
    img.background-image {
      display: none;
    }

    .form {
      width: 100%;
    }
  }
`;
