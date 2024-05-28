import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
const AddBudgetScreen = () => {
  const [budget, setBudget] = useState('');
  const [storedBudget, setStoredBudget] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getStoredBudget();
  }, []);

  const handleAddBudget = async () => {
    try {
      await postBudgetToAPI(budget);
      await AsyncStorage.setItem('budget', budget);
      console.log('Budget:', budget);
      getStoredBudget();
      setSuccessMessage('Budget added successfully.');
      // Set timeout to clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // 5 seconds in milliseconds
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const getStoredBudget = async () => {
    try {
      const storedBudget = await AsyncStorage.getItem('budget');
      setStoredBudget(storedBudget);
      console.log('Stored Budget:', storedBudget);
    } catch (error) {
      console.error('Error retrieving stored budget:', error);
    }
  };

  const postBudgetToAPI = async (budget) => {
    const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AddBudget?amount=${budget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to add budget');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Budget"
        onChangeText={text => setBudget(text)}
        value={budget}
      />
      <Button title="Add Budget" onPress={handleAddBudget} />
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}
      {storedBudget && (
        <Text style={styles.storedBudgetText}>Budget Entered: {budget}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82b7bf',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 60,
    width: '80%',
    borderColor: 'white',
    borderWidth: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  storedBudgetText: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
  },
  successMessage: {
    fontSize: 18,
    color: 'green',
    marginTop: 20,
  },
});

export default AddBudgetScreen;
