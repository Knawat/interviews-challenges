import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { ProductContext } from "../context/ProductContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: theme.spacing(4, 0, 2)
  },
  avatar: {
    margin: theme.spacing(2, 4)
  }
}));
export default function InteractiveList() {
  const { products, removeProduct } = React.useContext(ProductContext);


  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={4}

      >
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.title}>
            Checkout
          </Typography>
          <div className={classes.demo}>
            {products?.map((product) => {
              return (
                <List>
                  <ListItem>
                    <ListItemAvatar className={classes.avatar} >
                      <img
                        src={product.image}
                        alt=""
                        style={{ width: "6rem", height: "6rem" }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={product.title}
                      secondary={product.price}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon onClick={() => removeProduct(product.id)} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>);
            })}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

