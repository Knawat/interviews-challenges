import React from "react";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import DevicesIcon from "@material-ui/icons/Devices";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import PregnantWomanIcon from "@material-ui/icons/PregnantWoman";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";


const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClick = (e) => {
    e.preventDefault()
    console.log(e.currentTarget.id)
    history.push(`?category=${e.currentTarget.id}`)
  }

  const drawerTabs =
    [{ id: 1, label: "Electronics", slug: "electronics" },
    { id: 2, label: "Jewelery", slug: "jewelery" },
    { id: 3, label: "Man clothing", slug: "man clothing" },
    { id: 3, label: "Woman Clothing", slug: "woman clothing" },
    ]

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom"
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {drawerTabs.map(
          (item, index) => (
            <ListItem button key={item.id} id={item.slug} onClick={handleClick}>
              <ListItemIcon>
                {index === 0 ? <DevicesIcon /> : ""}
                {index === 1 ? <AttachMoneyIcon /> : ""}
                {index === 2 ? <AccessibilityIcon /> : ""}
                {index === 3 ? <PregnantWomanIcon /> : ""}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}><MenuIcon /></Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}