import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { BASE_URL } from './config'; // Ensure this URL is correct

const UserFormScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [profileId, setProfileId] = useState('');

  const handleAddUser = async () => {
    if (!username || !password || !role) {
      Alert.alert('Error', 'Username, password, and role are required fields.');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AddUser?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}&profileId=${encodeURIComponent(profileId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Check if the response has content-type application/json
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('User added:', data);
          Alert.alert('Success', 'User added successfully!');
          // Optionally, clear the form fields
          setUsername('');
          setPassword('');
          setRole('');
          setProfileId('');
        } else {
          console.log('User added successfully!');
          Alert.alert('Success', 'User added successfully!');
          // Optionally, clear the form fields
          setUsername('');
          setPassword('');
          setRole('');
          setProfileId('');
        }
      } else {
        const errorText = await response.text(); // Get the error text response
        console.error('Error adding user:', errorText);
        Alert.alert('Error', `Failed to add user: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add User</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Role</Text>
      <TextInput
        style={styles.input}
        placeholder="Role"
        keyboardType="numeric"
        value={role}
        onChangeText={setRole}
      />

      <Text style={styles.label}>Profile ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Profile ID"
        keyboardType="numeric"
        value={profileId}
        onChangeText={setProfileId}
      />

      <Button title="Add User" onPress={handleAddUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#82b7bf',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default UserFormScreen;