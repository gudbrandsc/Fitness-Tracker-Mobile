import React, { Component } from "react";
import { View, Text } from "react-native";
import { Spinner } from "../../components/common";
import axios from "axios";
import FollowingList from "../../components/followingList/FollowingList";


/**
 * Page component that renders the entire following page for a visited profile. 
 */
class VisitFollowingPage extends Component {

  /** Load top header */
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
      error: "",
      loading: true,
      users: [],
      loggedInUserID: "",
      visitedUserId: ""
    };
  }

  componentDidMount() {
    this.getFollowingList();
  }

  /**Load in props from navigation and set state values. */
  getFollowingList(){
    const { navigation } = this.props;
    const visitedUserId = navigation.getParam('visitedUserId');
    const loggedInUserID = navigation.getParam('loggedInUserID');
    this.setState({ visitedUserId: visitedUserId, loggedInUserID: loggedInUserID });
    this.fetchData(loggedInUserID, visitedUserId);
  }

  /** Load get a list of all the users that the visited user follows */
  fetchData(loggedInUserID, visitedUserId) {
    console.log("listfollows/"+ loggedInUserID + "/" + visitedUserId)

    axios
      .get("http://localhost:8000/api/listfollows/" + loggedInUserID + "/" + visitedUserId)
      .then(response => this.setState({ users: response.data }))
      .then(this.checkSearchResp.bind(this));
  }

  /** Check the respons to see if the user has any followers */
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

  //TODO
  resetComponent = () => {
    console.log("lol")
  } 

  /** Waits for backend to respond with a list of users that the visited userprofile is following. */
  renderFollowingList(users, loading) {
    if (loading) {
      return <Spinner size={"small"} />;
    }
    if (users && users.length > 0) {
      return <FollowingList users={users} loggedInUserID={this.state.loggedInUserID} followingRequest={true} resetComponent={this.resetComponent.bind(this)}/>;
    }
  }

  render() {
    const { users, loading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor:'#f7f6ef' }}>
        {this.renderFollowingList(users, loading)}
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default VisitFollowingPage;
