import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, CardSection, Button, Input, Spinner, Header } from "../components/common";

export default class SearchUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: false,
      data: ""
    };
  }

  onButtonPress() {
    const { term, error, data } = this.state;
    console.log(this.state.term);
    //  this.setState({error: '', loading: true })
    this.setState({ data: "hello from data" });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size={"small"} />;
    }
    return <Button onPress={this.onButtonPress.bind(this)}>Search</Button>;
  }

  render() {
    return (
      <View>
        <Header headerText={"Search for user"} />
        <Card>
          <CardSection>
            <Input
              placeholder="Search term"
              label="term"
              onChangeText={term => this.setState({ term })}
            />
          </CardSection>
          <CardSection>
            {this.renderButton()}
            <Text>{this.state.data}</Text>
          </CardSection>
        </Card>
      </View>
    );
  }
}
