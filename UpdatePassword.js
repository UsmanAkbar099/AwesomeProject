import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
const YourScreenComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch student ARID number and ID from AsyncStorage
    getStudentDataFromAsyncStorage();
  }, []);

  const getStudentDataFromAsyncStorage = async () => {
    try {
      const aridNo = await AsyncStorage.getItem('arid_no');
      const studentId = await AsyncStorage.getItem('student_id');
      
      if (aridNo !== null) {
        setUsername(aridNo);
        console.log('ARID NO:', aridNo);
      } else {
        console.log('ARID NO not found in AsyncStorage');
      }
      
      if (studentId !== null) {
        console.log('Student ID:', studentId);
      } else {
        console.log('Student ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error getting student data from AsyncStorage:', error);
    }
  };

  const handleUpdatePassword = async () => {
    // Basic validation
    if (!username.trim()) {
      Alert.alert('Validation Error', 'Please enter a username.');
      return;
    }
  
    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter a password.');
      return;
    }
  
    try {
      const studentId = await AsyncStorage.getItem('student_id');
      if (studentId !== null) {
        const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/UpdatePassword?id=${studentId}&username=${username}&password=${password}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Clear the password field
          setPassword('');
          Alert.alert('Password Updated', 'Password has been updated successfully!');
        } else {
          Alert.alert('Error', 'Failed to update password.');
        }
      } else {
        Alert.alert('Error', 'Student ID not found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Update Password"
        onPress={handleUpdatePassword}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#82b7bf',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: 'red',
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default YourScreenComponent;