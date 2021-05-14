import React from "react";
import { ScrollView, Image, View, Text, StyleSheet, SafeAreaView, Button, Alert } from "react-native";
import "react-native-get-random-values";
import { openDatabase } from "../database/Database";
import Spinner from "react-native-loading-spinner-overlay";

export default class ReceipeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  onDelete = async () => {
    const { route, navigation } = this.props;
    const { id } = route.params;
    this.setState({ isLoading: true });
    var db = await openDatabase();
    db.transaction(
      (txn) => {
        txn.executeSql("DELETE FROM food_receipe WHERE id = ?", [id], (_, { rowsAffected }) => {
          this.setState({ isLoading: false });
          console.log("rowsAffected ", rowsAffected);
          if (rowsAffected === 1) {
            Alert.alert("Action Successful", "Recipe Deleted", [
              {
                text: "OK",
                onPress: () => navigation.goBack(),
              },
            ]);
          }
        });
      },
      (err) => {
        this.setState({ isLoading: false });
        console.log("Error @ DELETE FROM food_receipe WHERE id = ?", err);
        Alert.alert("Error!", err, [
          {
            text: "OK",
          },
        ]);
      }
    );
  };
  render() {
    const { route, navigation } = this.props;
    const { id, title, photo, steps, ingredients, type } = route.params;
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.isLoading} textContent={"Loading..."} overlayColor={"rgba(0,0,0, 0.75)"} textStyle={{ color: "#FFF" }} />
        <ScrollView>
          <Image source={{ uri: photo }} style={{ height: 200, width: "100%" }} />
          <Text style={styles.title}>{title ?? "N/A"}</Text>
          <View style={styles.steps}>
            <Text style={styles.label}>Ingredients:-</Text>
            <Text>{ingredients ?? "N/A"}</Text>
          </View>
          <View style={styles.steps}>
            <Text style={styles.label}>Steps:-</Text>
            <Text>{steps?.replace(/\\n/g, "\n") ?? "N/A"}</Text>
          </View>
        </ScrollView>
        <Button
          title="Edit"
          onPress={() =>
            navigation.navigate("ReceipeForm", {
              image: photo,
              name: title,
              type,
              ingredients,
              steps,
              id,
              isEdit: true,
            })
          }
        />
        <Button color="red" title="Delete" onPress={this.onDelete} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#444444",
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  steps: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "left",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
});
