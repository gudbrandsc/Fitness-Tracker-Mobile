import React, { Component } from "react";
import { View, Text } from "react-native";
import { Spinner, Header } from "../../components/common";
import axios from "axios";
import FollowingList from "../../components/followingList/FollowingList";

class VisitFollowingPage extends Component {
  static navigationOptions = {
    headerTitle: "Following",
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
      userId: ""
    };
  }

  componentDidMount() {
    this.getFollowingList();
  }

  getFollowingList(){
    const { navigation } = this.props;
    const id = navigation.getParam('userid');
    this.setState({ userId: id });
    this.fetchData(id);
  }

  fetchData(id) {
    console.log("listfollows/"+ id)
    axios
      .get("http://localhost:8000/api/listfollows/" + id)
      .then(response => this.setState({ users: response.data }))
      .then(this.checkSearchResp.bind(this));
  }

  checkSearchResp() {
    if (this.state.users && this.state.users.length > 0) {
      this.setState({ error: "", loading: false });
    } else {
      this.setState({
        error: "This user does not follow anyone yet..",
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
      return <FollowingList users={users} userId={this.state.userId} followingRequest={true} resetComponent={this.resetComponent.bind(this)}/>;
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

export default VisitFollowingPage;
