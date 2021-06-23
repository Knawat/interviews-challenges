import { useQuery } from "react-query";
//Components from Material-UI
import Item from "./../Items/Item";
import CircularProgress  from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid"
//Styles 
import { Wrapper } from "./Home.style"
//types
import { CartItemTypes } from "../App";

const getProducts = async (): Promise<CartItemTypes[]> => 
  await (await fetch('https://limitless-lake-55070.herokuapp.com/product/')).json()


const Home: React.FC = () => {
  const {data, isLoading, error} = useQuery<CartItemTypes[]>('products', getProducts)

  const dataMap = () => {
    return data?.map((item, key) => {
      return (
        item.imageURL.length < 15 ? null : 
          <Grid item key={key} xs={12} sm={4}>
            <Item item={item} />
          </Grid>
      )
    })
  }

  if(isLoading) return <CircularProgress />
  if(error) return <>Something goes wrong refresh page again !!!!</>

  return (
    <Wrapper>
      <Grid container spacing={3}>
        {dataMap()}
      </Grid>
    </Wrapper>
  )
} 

export default Home;
