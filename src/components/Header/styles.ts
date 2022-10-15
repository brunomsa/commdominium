import styled from 'styled-components';
import theme from '../../styles/theme';

export const Header = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 ${theme.main.padding_x}px;
  background-color: ${theme.colors.dark_grey};
  font-weight: 500;
  height: ${theme.header.height}px;

  div:first-child {
    display: flex;
    flex-grow: 1;
    align-items: center;

    .logo {
      flex: 0;
      margin-right: 56px;
    }

    nav {
      width: 100%;
      flex: 1;

      .ant-menu {
        background-color: transparent;
        border: none;
        font-size: 16px;
        line-height: inherit;

        span {
          color: ${theme.colors.text};
        }

        .ant-menu-item-selected::after,
        .ant-menu-item:hover::after {
          top: 24px;
          border-width: 4px;
        }
      }
    }
  }

  .profile {
    min-width: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    svg {
      color: ${theme.colors.text};
      font-size: 20px;
    }

    .ant-avatar {
      background-color: ${theme.colors.background};
    }
  }
`;
