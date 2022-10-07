import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100px;
  padding: 32px;
  background-color: #1c1c21;
  font-size: 20px;
  font-weight: 500;

  div:first-child {
    display: flex;

    .logo {
      width: 100px;
    }

    nav {
      max-width: 700px;

      .ant-menu {
        background-color: transparent;
        border: none;
        font-size: 20px;
        line-height: inherit;

        span {
          color: ${theme.colors.text};
        }

        .ant-menu-item-selected::after,
        .ant-menu-item:hover::after {
          top: 30px;
          border-width: 4px;
        }
      }
    }

    .profile {
      justify-content: space-around;

      .ant-badge {
        align-self: center;
      }

      svg {
        font-size: 24px;
      }
    }
  }
`;
