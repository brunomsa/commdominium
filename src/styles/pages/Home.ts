import styled from 'styled-components';

export const Home = styled.div`
  .alertTitle {
    font-size: 20;
    line-height: 20px;
    margin-bottom: 16;
  }

  .cards {
    display: flex;
    flex-grow: 1;
    gap: 40;
  }

  @media screen and (max-width: 1080px) {
    .cards {
      flex-direction: column;
    }
  }
`;
