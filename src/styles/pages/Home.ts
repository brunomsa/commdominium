import styled from 'styled-components';

export const Home = styled.div`
  .alertTitle {
    font-size: 20px;
    line-height: 20px;
    margin-bottom: 16px;
  }

  .cards {
    display: flex;
    flex-grow: 1;
    gap: 40px;

    > div {
      margin-bottom: 32px;
    }
  }

  @media screen and (max-width: 1080px) {
    .cards {
      flex-direction: column;
      gap: 20px;

      > div:first-child {
        margin-bottom: 0;
      }
    }
  }
`;
