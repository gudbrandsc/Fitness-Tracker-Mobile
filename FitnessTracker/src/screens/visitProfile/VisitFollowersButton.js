import React, { Component } from "react";
import { Text, View } from "react-native";
import { Spinner } from "../../components/common";

class VisitFollowingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followersCount: 0,
      loading: true
    };
  }

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData() {
    try {
      this.setState({ loading: true });
      console.log("VisitFollowingButton for id: " + this.props.userid);
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
          this.setState({ loading: false });
        });
    } catch (error) {
      console.log("error");
      this.setState({ loading: false });
    }
  }

  renderCount() {
    if (!this.state.loading) {
      return (
        <View style={{ flexDirection: "column" }}>
          <Text
            style={{ fontSize: 15, fontWeight: "bold", textAlign: "center" }}
          >
            {this.state.followersCount}
          </Text>
          <Text style={{ fontSize: 15, textAlign: "center", color: "#a0a0a0" }}>
            Followers
          </Text>
        </View>
      );
    } else {
      return <Spinner size="small" />;
    }
  }

  render() {
    return <React.Fragment>{this.renderCount()}</React.Fragment>;
  }
}

export default VisitFollowingButton;
