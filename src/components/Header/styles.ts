import styled from 'styled-components';
import theme from '../../styles/theme';

export const Header = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 ${theme.main.PADDING_X}px;
  background-color: ${theme.colors.DARK_GREY};
  font-weight: 500;
  height: ${theme.header.HEIGHT}px;
  z-index: 10;

  div:first-child {
    display: flex;
    flex-grow: 1;
    align-items: center;

    .logo {
      flex: 0;
      margin-right: 24px;
      max-width: 50px;
      cursor: pointer;
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
          color: ${theme.colors.TEXT};
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
      color: ${theme.colors.TEXT};
      font-size: 20px;
    }

    .ant-avatar {
      cursor: pointer;
      background-color: ${theme.colors.BACKGROUND};
    }
  }
`;

export const ProfileSettings = styled.div`
  padding: 10px;

  h3 {
    margin: 0;
  }

  .email {
    font-size: 11px;
    opacity: 0.3;
  }

  li.ant-menu-item {
    padding: 0 !important;
    background-color: transparent !important;

    :hover {
      color: ${theme.colors.PRIMARY};
    }
  }
`;
