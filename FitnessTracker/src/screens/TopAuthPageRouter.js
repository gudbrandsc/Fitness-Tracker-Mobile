import React, { Component } from "react";
import AuthPageRouter from "./AuthPageRouter";

/**
 * This script only loads the AuthPageRouter. It was created because the navigation didn’t allow me to navigate directly
 * to the AuthPageRouter because it is a router page and not a react native component.
 * So I had to create this page to only load the AuthPageRouter.
 */
class TopAuthPageRouter extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return <AuthPageRouter />;
  }
}

export default TopAuthPageRouter;
