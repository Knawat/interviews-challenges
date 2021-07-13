import React from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  Image,
  List,
  Segment,
} from "semantic-ui-react";

const Footer = () => {
  return (
    <div>
      <Segment
        inverted
        vertical
        style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
      >
        <Container textAlign="center">
          <Grid divided inverted stackable>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="DISCOVER US" />
              <List link inverted>
                <List.Item as="a">About Us</List.Item>
                <List.Item as="a">Careers</List.Item>
                <List.Item as="a">Contact Us</List.Item>
                <List.Item as="a">Social Responsibilities</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="FOLLOW US" />
              <List link inverted>
                <List.Item as="a">Twitter</List.Item>
                <List.Item as="a">Instagram</List.Item>
                <List.Item as="a">Facebook</List.Item>
                <List.Item as="a">Youtube</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="LET US HELP YOU" />
              <List link inverted>
                <List.Item as="a">Your Account</List.Item>
                <List.Item as="a">Your Orders</List.Item>
                <List.Item as="a">Return & Replacement</List.Item>
                <List.Item as="a">Manage Your Devices</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header inverted as="h4" content="Footer Header" />
              <p>
                Life is hard enough already. Let us make it a little easier.
              </p>
            </Grid.Column>
          </Grid>

          <Divider inverted section />
          <Image
            centered
            size="small"
            src="https://i.pinimg.com/originals/92/0b/3d/920b3d90f07d4f56b37e2d8768d73422.jpg"
          />
          <List horizontal inverted divided link size="small">
            <List.Item as="a" href="#">
              Site Map
            </List.Item>
            <List.Item as="a" href="#">
              Contact Us
            </List.Item>
            <List.Item as="a" href="#">
              Terms and Conditions
            </List.Item>
            <List.Item as="a" href="#">
              Privacy Policy
            </List.Item>
          </List>
        </Container>
      </Segment>
    </div>
  );
};

export default Footer;
