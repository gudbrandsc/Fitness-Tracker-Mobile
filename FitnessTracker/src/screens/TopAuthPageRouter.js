import React, { Component } from "react";
import AuthPageRouter from "./AuthPageRouter";

class TopAuthPageRouter extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return <AuthPageRouter />;
  }
}

export default TopAuthPageRouter;
