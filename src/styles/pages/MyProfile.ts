import styled from 'styled-components';

export const MyProfile = styled.div`
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 32px;
    width: 40%;
    min-width: 350px;

    h1 {
      min-width: max-content;
    }

    > div {
      z-index: 1;
      text-align: end;
    }
  }

  @media screen and (max-width: 720px) {
    .title {
      width: 100%;
    }
  }
`;
