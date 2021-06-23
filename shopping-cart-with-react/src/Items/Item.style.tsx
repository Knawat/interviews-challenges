import styled from "styled-components";

export const ItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    border: 1px solid lightblue;
    border-radius: 20px;
    height: 100%;
    
    button {
        border-radius: 0 0 20px 20px;
    }
    img {
        min-height: 450px;
        object-fit: cover;
        border-radius: 20px 20px 0 0;
    }
    div {
        font-family: Arial, Helvetica, sans-serif;
        padding: 1rem;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    h3 {
        min-height: 50px;
        align-self: flex-end;
    }
    h2 {
        min-height: 50px;
    }

`;