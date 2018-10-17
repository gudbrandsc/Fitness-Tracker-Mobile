import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, CardSection, Button, Input, Spinner, Header } from "../components/common";
import UserList from '../components/userSearch/UserList';
import axios from 'axios';


export default class SearchUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: false,
      users:[]
    };

    this.onButtonPress = this.onButtonPress.bind(this)
  }

  onButtonPress() {
    console.log('Button is clicked: ' + this.state.term);
    axios.get('http://localhost:8000/api/searchuser/' + this.state.term).then(response => this.setState({ users: response.data }));
  }

  loadData(){
    if(this.state.users && this.state.users.length > 0){
      return <UserList users={this.state.users}/>
    }else{
      return <Text>No users matching the search term!</Text>
    }
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size={"small"} />;
    }
    return <Button onPress={this.onButtonPress}>Search</Button>;
  }

  render() {
    return (
      <View>
        <Header headerText={"Search for user"} />
        <Card>
          <CardSection>
            <Input
              placeholder="Enter search term..."
              label="term"
              onChangeText={term => this.setState({ term })}
            />
          </CardSection>
          <CardSection>
            {this.renderButton()}
          </CardSection>
          <CardSection>
            {this.loadData()}
          </CardSection>
        </Card>
      </View>
    );
  }
}
