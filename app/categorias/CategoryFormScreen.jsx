import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "./../../config/Service.Config";
const CategoryFormScreen = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [subName, setSubName] = useState("");
  const [subImage, setSubImage] = useState("");

  const category = route.params?.category;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setImage(category.image);
      setSubcategories(category.subcategories);
    }
  }, [category]);

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, { name: subName, image: subImage }]);
    setSubName("");
    setSubImage("");
  };

  const handleSaveCategory = async () => {
    const newCategory = { name, image, subcategories };
    try {
      if (category) {
        await axios.put(
          `${API_BASE_URL}/categories/${category._id}`,
          newCategory
        );
      } else {
        await axios.post(`${API_BASE_URL}/categories`, newCategory);
      }
      navigation.navigate("CategoryList");
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const pickSubImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSubImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Image</Text>
      <TouchableOpacity onPress={pickImage}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
      <Text>Subcategories</Text>
      <FlatList
        data={subcategories}
        keyExtractor={(sub, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Subcategory Name"
        value={subName}
        onChangeText={setSubName}
      />
      <TouchableOpacity onPress={pickSubImage}>
        <Text>Select Subcategory Image</Text>
      </TouchableOpacity>
      {subImage ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : null}
      <Button title="Add Subcategory" onPress={handleAddSubcategory} />
      <Button title="Save Category" onPress={handleSaveCategory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default CategoryFormScreen;
