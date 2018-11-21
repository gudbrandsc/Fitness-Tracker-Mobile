import React, { Component } from "react";
import { Text, View } from "react-native";

class VisitFollowingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followersCount: 0
    };
  }

  componentDidMount() {
      console.log("Zup")
    fetch("http://localhost:8000/api/getnooffollowers/" + this.props.userid, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response =>
        response.json().then(data => ({
          data: data,
          status: response.status
        }))
      )
      .then(res => {
        if (res.status === 200) {
          const count = res.data.count;
          this.setState({ followersCount: count });
        } else {
          this.setState({ followersCount: 0 });
        }
      });
  }

  render() {
    return (
      <View style={{ flexDirection: "column" }}>
        <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: "center" }}>
          {this.state.followersCount}
        </Text>
        <Text style={{ fontSize: 15, textAlign: "center", color: "#a0a0a0" }}>
          Followers
        </Text>
      </View>
    );
  }
}

export default VisitFollowingButton;
