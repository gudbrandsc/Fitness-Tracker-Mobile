import React, { Component } from "react";
import { Text, View } from "react-native";
import { Spinner } from "../common";

/**
 * Component that renders a navigation button for the profile page. 
 * It displays the number of people the current user is following as the button body
 */
class FollowingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followersCount: 0,
      loading: true
    };
  }

  //Get number of users the current user is followers
  componentDidMount() {
    this.retrieveData();
  }

  // If the user follows or unfollows a user, then update number of followers.  
  componentDidUpdate(prevProps) {
    if (prevProps.identifier !== this.props.identifier) {
      this.retrieveData();
    }
  }

  // Get number of followers
  retrieveData() {
    try {
      this.setState({ loading: true });
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

export default FollowingButton;
