import React, { useState, useContext, useEffect } from "react";
import uuid from "react-native-uuid";

import Dialog from "react-native-dialog";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import {
  container,
  h1,
  input,
  blue,
  submit_button,
  submit_button_text,
  colors,
  font,
  caption1,
  subheadline,
  caption2,
  body,
  size,
  account,
  accounts__add,
} from "../styles/styles";
import { URL } from "../config";
import axios from "axios";
import { UsersContext } from "../context/UsersContext";
import { AccountsContext } from "../context/AccountsContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function NewAccount({ navigation }) {
  const { login, user } = useContext(UsersContext);
  const {
    getAccountsOfUser,
    activeAccount,
    iconColors,
    createSubcatAlert,
    accountData,
    getRandomColor,
    setAccountData,
    randomColor,
    type,
  } = useContext(AccountsContext);
  const [message, setMessage] = useState("");

  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentSubcat, setCurrentSubcat] = useState(null);
  const [newSubcatName, setNewSubcatName] = useState("");

  useEffect(() => {
    if (type === "edit") {
      setAccountData(activeAccount);
    } else {
      getRandomColor();
    }
    console.log("type: ", type);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //   axios.defaults.headers.common["Authorization"] = token;
      if (type !== "edit") {
        const response = await axios.post(
          `${URL}/accounts/addaccount`,
          accountData
        );
        setMessage(response.data.data);
        console.log(response.data.data);
        setTimeout(() => {
          setMessage("");
        }, 2000);
        if (response.data.ok) {
          getAccountsOfUser();
          navigation.navigate("Dashboard");
        }
      } else {
        const response = await axios.post(`${URL}/accounts/updateaccount`, {
          accountData: accountData,
        });
        setMessage(response.data.data);
        console.log(response.data.data);
        setTimeout(() => {
          setMessage("");
        }, 2000);
        if (response.data.ok) {
          getAccountsOfUser();
          navigation.navigate("Dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showEditDialog = (subcat) => {
    setCurrentSubcat(subcat);
    setNewSubcatName(subcat.subcategory);
    setDialogVisible(true);
  };
  const handleChange = (value, name) => {
    setAccountData({ ...accountData, [name]: value });
  };



  const editAlert = () => {
    if (currentSubcat && newSubcatName.length > 0) {
      let index = accountData.subcategories
        .map((e) => e.id)
        .indexOf(currentSubcat.id);

      let newData = { ...accountData };
      newData.subcategories[index] = {
        id: currentSubcat.id,
        subcategory: newSubcatName,
      };
      setAccountData(newData);
    }
    setDialogVisible(false);
  };

  const deleteSubcat = () => {
    if (currentSubcat && newSubcatName.length > 0) {
      let newData = { ...accountData };
      newData.subcategories = newData.subcategories.filter(
        (subcat) => subcat.id !== currentSubcat.id
      );
      setAccountData(newData);
    }
    setDialogVisible(false);
  };
  return (
    <View
      style={{
        ...container,
        padding: 20,
        alignItems:'center',
        minHeight: "100%",
        maxHeight: "100%",
      }}
    >
      <View style={{ ...account }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Choose icon")}
          style={{
            ...accounts__add,
            backgroundColor: accountData.icon.color,
          }}
        >
          <MaterialCommunityIcons
            name={
              !accountData.icon
                ? activeAccount.icon.icon_value
                : accountData.icon.icon_value
            }
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <Text style={{ ...subheadline, color: colors.gray, fontWeight: "600" }}>
          Icon
        </Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange(text, "name")}
        name={"name"}
        value={accountData?.name}
        inlineImageLeft="search_icon"
        placeholderTextColor={colors.primaryGreen}
        placeholder="Title*"
        clearButtonMode={"while-editing"}
        maxLength={20}
        selectionColor={"#primaryGreen"}
        lineBreakStrategyIOS={"push-out"}
      ></TextInput>
      <Text style={{ ...styles.h1, width: "100%" }}>Subcategories</Text>
      {accountData?.subcategories?.map((subcat) => (
        <Text
          onPress={() =>
            showEditDialog(
              accountData.subcategories[
                accountData.subcategories.map((e) => e.id).indexOf(subcat.id)
              ]
            )
          }
          key={uuid.v4()}
          style={{...caption1,width: "100%",paddingLeft:8}}
        >
          {subcat.subcategory}
        </Text>
      ))}
      <TouchableOpacity style={styles.submit_button} onPress={handleSubmit}>
        <Text style={styles.submit_button_text}>Save</Text>
      </TouchableOpacity>

      <View style={{ alignSelf: "flex-start" }}>
        <Button
          title="Add"
          onPress={createSubcatAlert}
        ></Button>
      </View>

      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Edit Subcategory</Dialog.Title>
        <Dialog.Description>
          Enter your new subcategory below
        </Dialog.Description>
        <Dialog.Input value={newSubcatName} onChangeText={setNewSubcatName} />
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Delete" onPress={deleteSubcat} />
        <Dialog.Button label="Save" onPress={editAlert} />
      </Dialog.Container>

    </View>
  );
}

const styles = StyleSheet.create({
  green: {
    color: colors.primaryGreen,
  },
  container,
  h1,
  input,
  blue,
  submit_button,
  submit_button_text,
  colors,
  font,
});
export default NewAccount;
