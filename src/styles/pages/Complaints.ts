import styled from 'styled-components';

export const Complaints = styled.div`
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 32px;

    h1 {
      min-width: max-content;
    }

    > div {
      z-index: 1;
      flex: 1;
      text-align: end;
    }
  }

  @media screen and (max-width: 720px) {
    .title {
      flex-direction: column;

      button {
        margin-top: 16px;
        min-height: 2.5rem;
        min-width: 2.5rem;
      }
    }

    .ant-list-item {
      justify-content: end;
    }
  }
`;
