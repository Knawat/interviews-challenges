import styled from 'styled-components'
import IconButton from "@material-ui/core/IconButton"



export const HeaderWrapper = styled.div`
    position: fixed;
    height: 60px;
    width: 100%;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    
    svg {
        height: 3rem;
        width: 3rem;
    }
    button {
        margin-right: 6rem;
    }
    @media (max-width: 960px) {
        button {
            margin-right: 10rem;
        }
    }
    
`

export const StyledButton = styled(IconButton)`
`