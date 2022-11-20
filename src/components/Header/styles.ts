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
    justify-content: space-between;

    .logo {
      flex: 0;
      margin-right: 24px;
      max-width: 50px;
      cursor: pointer;
    }
  }

  nav {
    width: 100%;
    flex: 1;
    display: flex;
    gap: 1.8rem;

    .item {
      color: ${theme.colors.TEXT};
      height: 1rem;

      :hover {
        color: ${theme.colors.PRIMARY};
      }

      &.selected {
        ::after {
          content: '';
          display: block;
          margin-top: 8px;
          border-bottom: 4px solid ${theme.colors.PRIMARY};
        }
      }
    }
  }

  .nav-btn {
    border: none;
    display: none;
    pointer-events: none;
    font-size: 1.8rem;
    pointer-events: auto;
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

  @media screen and (max-width: 950px) {
    padding: 0 1rem;
    .nav-btn {
      display: block;
    }
    nav {
      display: none;
    }
    .profile {
      min-width: 140px;
    }
  } ;
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
