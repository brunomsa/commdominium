import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled.header`
  width: 100%;
  padding: 0 ${theme.main.padding_x}px;
  background-color: ${theme.colors.dark_grey};
  font-size: 20px;
  font-weight: 500;
  height: ${theme.header.height}px;

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
