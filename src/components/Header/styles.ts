import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100px;
  padding: 32px 64px;
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
      justify-content: space-between;

      svg {
        color: ${theme.colors.text};
        font-size: 25px;
      }

      .ant-badge {
        align-self: center;
      }

      .ant-avatar {
        background-color: ${theme.colors.background};
      }
    }
  }
`;
