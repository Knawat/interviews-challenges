import styled, { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
* {
    text-decoration: none;
  }

  html {
    margin: 0;
    box-sizing: boder-box;
    -webkit-font-smoothing: antialiased;
    font-size: 65%;
  }

  body {
    margin: 0;
    font-size: 1.6rem;
    height: 100%;

    main {
      background-color: #fff;
    }
  }

  a {
    text-decoration: none;
    color: #000;
  }
  span {
      font-size: 1.2rem;
  }
  nav {
    display: flex;
    align-items: center;
  }
  li {
      margin-left: 25px;
      font-size: 1.8rem;
  }
  ul {
      display: flex;
  }
`


export const AppWrapper = styled.div`
  
`