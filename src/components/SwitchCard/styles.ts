import styled from 'styled-components';
import theme from '../../styles/theme';

export const SwitchCard = styled.div`
  padding: 12px;
  flex: 1;
  box-shadow: ${theme.boxShadow};

  .cardHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div:first-child {
      font-size: 16px;
      display: flex;
      align-items: center;
    }

    div:last-child {
      margin-left: 8px;
    }
  }

  .seeMore-btn {
    width: 100%;
    text-align: end;
  }
`;
