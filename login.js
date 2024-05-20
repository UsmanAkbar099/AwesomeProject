import React, { useState } from "react";
import { StyleSheet, Alert, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import logo from './logo.png'
import emailIcon from './Username.png';
import passwordIcon from './password.png';
import hidePasswordIcon from './hide.png';
import showPasswordIcon from './show.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from "./config";

const Login = (props) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [click, setClick] = useState(false);
  const [hide, setHide] = useState(true);
  const [savedUsername, setSavedUsername] = useState("");
  const [savedPassword, setSavedPassword] = useState("");

  const togglePasswordVisibility = () => {
    setHide(!hide);
  };

  const handleLogin = () => {
    if (username.trim() === "") {
      Alert.alert("Error", "Please enter your userName.");
      return;
    }
  
    if (password.trim() === "") {
      Alert.alert("Error", "Please enter your password.");
      return;
    }
  
    fetch(`http://192.168.47.189/FinancialAidAllocation/api/User/Login?username=${username}&password=${password}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const role = data.role;
        if (role === 1) {
          props.navigation.navigate("StudentDashBoard");
          const profileId = data.profileId;
          AsyncStorage.setItem('profileId', profileId.toString());
          AsyncStorage.setItem('savedUsername', username);
        } else if (role === 2) {
          props.navigation.navigate("AdminDashBoard");
          const profileId = data.profileId;
          AsyncStorage.setItem('profileId', profileId.toString());
          AsyncStorage.setItem('savedUsername', username);
        } else {
          Alert.alert("Error", "Invalid role.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert("Error", "Failed to authenticate. Please try again.");
      });
  };
  
  
  
  

  return (
    <View style={styles.container}>
      <Image source={logo} style={{ width: 100, height: 100 }} />
      <Text style={styles.title}>BIIT FINANCIAL AID ALLOCATION TOOL</Text> 

      <View style={styles.inputView}>
        <Image source={emailIcon} style={styles.icon} />
        <TextInput
          style={styles.TextInput}
          placeholder="UserName"
          placeholderTextColor="#003f5c"
          value={click ? savedUsername : username}
          onChangeText={(username) => setUserName(username)}
        />
      </View>

      <View style={styles.inputView}>
        <Image source={passwordIcon} style={styles.icon} />
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={hide}
          value={click ? savedPassword : password}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.passwordToggle} onPress={togglePasswordVisibility}>
          <Image source={hide? showPasswordIcon : hidePasswordIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82b7bf',
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    flexDirection: "row", 
    backgroundColor: "white",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10, 
    color:"black",
  },
  button: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonView: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "white"
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10, 
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
  },
});

export default Login;
