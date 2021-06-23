import styled from "styled-components";


export const CartWrapper = styled.aside`
    font-family: Arial, Helvetica, sans-serif;
    width: 500px;
    padding: 20px;

    @media (max-width: 960px) {
        width: 300px;
    }
    .main-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .link {
        background-color: gray;
        border-radius: 10px;
        padding: 10px;
        width: min-content;
        display: flex;
        align-items: center;
        color: white; 
        a {
            text-align: center;
            color: white;
        }
    }
    svg {
        height: 3rem;
        width: 3rem;
        margin-left: 1rem;
    }
    
`