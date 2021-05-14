import React from "react";
import { Dimensions, SafeAreaView, ScrollView, View, Text, Button, StyleSheet, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ReceipeTypesDropdown from "./ReceipeTypesDropdown";
import { openDatabase } from "../database/Database";
import Spinner from "react-native-loading-spinner-overlay";
import isEmpty from "lodash/isEmpty";
import trim from "lodash/trim";

export default class ReceipeForm extends React.Component {
  constructor(props) {
    super(props);
    const { route } = props;
    const { image, name, type, ingredients, steps } = route.params || {};
    this.state = {
      image,
      name,
      type,
      ingredients,
      steps,
      isLoading: false,
    };
  }

  save = async () => {
    const { route, navigation } = this.props;
    const { id, isEdit } = route.params || {};
    const { image, name, type, ingredients, steps } = this.state;
    this.setState({ isLoading: true });
    var db = await openDatabase();
    if (isEdit) {
      db.transaction(
        (txn) => {
          txn.executeSql(
            "UPDATE food_receipe SET title = ?, photo = ?, ingredients = ?, type = ?, steps = ? WHERE id = ?",
            [name, image, ingredients, type, steps, id],
            (_, { rowsAffected }) => {
              console.log("rowsAffected :: ", rowsAffected);
              this.setState({ isLoading: false });
              Alert.alert("Action Successful", "Receipe Updated!", [
                {
                  text: "OK",
                  onPress: () => navigation.popToTop(),
                },
              ]);
            }
          );
        },
        (err) => {
          console.log("Err @ SELECT * FROM food_receipe :: ", err);
          this.setState({ isLoading: false });
          Alert.alert("Error!", err, [
            {
              text: "OK",
            },
          ]);
        }
      );
    } else {
      if (image && !isEmpty(trim(name)) && !isEmpty(trim(ingredients)) && type && !isEmpty(trim(steps))) {
        db.transaction(
          (txn) => {
            txn.executeSql(
              "INSERT INTO food_receipe(title, photo, ingredients, type, steps) VALUES (?,?,?,?,?)",
              [name, image, ingredients, type, steps],
              (_, { rowsAffected }) => {
                console.log("rowsAffected :: ", rowsAffected);
                this.setState({ isLoading: false });
                Alert.alert("Action Successful", "Receipe Created!", [
                  {
                    text: "OK",
                    onPress: () => navigation.popToTop(),
                  },
                ]);
              }
            );
          },
          (err) => {
            console.log("Err @ SELECT * FROM food_receipe :: ", err);
            this.setState({ isLoading: false });
            Alert.alert("Error!", err, [
              {
                text: "OK",
              },
            ]);
          }
        );
      } else {
        this.setState({ isLoading: false });
        Alert.alert("Create Failed", "One or more of the fields is empty", [
          {
            text: "OK",
          },
        ]);
      }
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    const { image, name, type, ingredients, steps, isLoading } = this.state;
    const { width } = Dimensions.get("window");
    const { route } = this.props;
    const { isEdit } = route.params || { isEdit: false };

    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={isLoading} textContent={"Loading..."} overlayColor={"rgba(0,0,0, 0.75)"} textStyle={{ color: "#FFF" }} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.label}>Image:</Text>
            <Image
              source={image ? { uri: image } : require("../../assets/noimage.png")}
              resizeMode={"contain"}
              style={{ marginVertical: 20, width: "100%", height: (width * 0.75 * 3) / 4 }}
            />
            <Button title="Pick an Image" onPress={this.pickImage} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} placeholder="eg. Egg Benedict" value={name} onChangeText={(name) => this.setState({ name })} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={{ marginTop: 5 }}>
              <ReceipeTypesDropdown onChange={(val) => this.setState({ type: val })} initialValue={type} />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ingredients</Text>
            <TextInput
              style={styles.input}
              placeholder="eg. Egg, Cooking Oil, Salt, Peper..."
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              value={ingredients}
              onChangeText={(ingredients) => this.setState({ ingredients })}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Steps</Text>
            <TextInput
              style={styles.input}
              placeholder={"eg: \n\t1. Boil the egg\n\t2.Slice the bread"}
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              value={steps}
              onChangeText={(steps) => this.setState({ steps })}
            />
          </View>
        </ScrollView>
        <Button title={isEdit ? "Save" : "Create"} onPress={this.save} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 15,
  },
  formGroup: {
    marginVertical: 10,
  },
  input: {
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});
