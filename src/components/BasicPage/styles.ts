import styled, { css } from 'styled-components';
import theme from '../../styles/theme';

export const BasicPage = styled.div`
  height: 100vh;
  background-color: ${theme.colors.BACKGROUND};

  h1 {
    margin: 0;
  }

  main {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: calc(100% - ${theme.header.HEIGHT}px);
    padding: 2rem ${theme.main.PADDING_X}px;
  }

  @media screen and (max-width: 1080px) {
    main {
      padding: 2rem;
    }
  } ;
`;

interface MobileMenuProps {
  menuVisibility: boolean;
}

export const MobileMenu = styled.div<MobileMenuProps>`
  position: absolute;
  backdrop-filter: blur(3px);
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.BACKGROUND};
  background: linear-gradient(34deg, ${theme.colors.PRIMARY} 0%, ${theme.colors.BACKGROUND} 95%);
  opacity: 0;
  pointer-events: none;
  transition: 0.5s;
  transform: translateY(-100vh);

  > button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    border: none;

    svg {
      font-size: 24px;
      transform: rotate(45deg);
      transition: 0.7s;
    }
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
    transform: scale(0.7);
    transition: 0.7s;

    a {
      color: ${theme.colors.TEXT};
      font-size: 1.5rem;

      :active,
      :hover {
        color: ${theme.colors.PRIMARY};
      }
    }
  }

  ${({ menuVisibility }) =>
    menuVisibility &&
    css`
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0px);

      > button {
        svg {
          transform: rotate(0deg);
        }
      }

      nav {
        transform: scale(1);
      }
    `}
`;
