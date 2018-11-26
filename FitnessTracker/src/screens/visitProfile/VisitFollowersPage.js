import React, { Component } from "react";
import { AsyncStorage, View, Text } from "react-native";
import { Spinner, Header } from "../../components/common";
import axios from "axios";
import FollowingList from "../../components/followingList/FollowingList";

class VisitFollowersPage extends Component {
  static navigationOptions = {
    headerTitle: "Followers",
    headerStyle: {
      backgroundColor: '#00e6d3',
      height: 60,

    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: "600",
      color: "#fff",
      fontSize: 22,
      fontFamily: "arial"
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: true,
      users: [],
      userId: "",
      otherUserId: ""
    };
  }

  componentDidMount() {
    this.getFollowingList();
  }

  getFollowingList(){
    const { navigation } = this.props;
    const id = navigation.getParam('otherUserId');
    const userId = navigation.getParam('userid');
    this.setState({ otherUserId: id, userId: userId });
    this.fetchData(id);
  }

  fetchData(id) {
    axios
      .get("http://localhost:8000/api/listfollowers/" + id)
      .then(response => this.setState({ users: response.data }))
      .then(this.checkSearchResp.bind(this));
  }

  checkSearchResp() {
    if (this.state.users && this.state.users.length > 0) {
      this.setState({ error: "", loading: false });
    } else {
      this.setState({
        error: "This user does not have any followers yet...",
        loading: false
      });
    }
  }

  resetComponent = () => {
    console.log("lol")
  } 

  checkResponse(users, loading) {
    if (loading) {
      return <Spinner size={"small"} />;
    }
    if (users && users.length > 0) {
      return <FollowingList users={users} userId={this.state.userId} followingRequest={false} resetComponent={this.resetComponent.bind(this)}/>;
    }
  }

  render() {
    const { users, loading } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor:'#f7f6ef' }}>
        {this.checkResponse(users, loading)}
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default VisitFollowersPage;
