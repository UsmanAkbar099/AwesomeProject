import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { BASE_URL } from './config';

const AddPolicyScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [policy, setPolicy] = useState('');
  const [strength, setStrength] = useState('');
  const [policyFor, setPolicyFor] = useState('need_base');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = async () => {
    if (!description) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
  
    if (policyFor === 'NeedBase') {
      setPolicy('CGPA'); // Set policy to CGPA
      setStrength(1); // Set strength to 1
    } else if (!policyFor || !val1 || (policyFor === 'MeritBase' && !selectedOption) || (policyFor === 'MeritBase' && selectedOption === 'Strength' && !val2)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    let storedVal1, storedVal2;
  
    if (policyFor === 'NeedBase') {
      storedVal1 = 3.5; // Set default value for val1
      storedVal2 = ''; // No need for val2
      setPolicy('CGPA'); // Set policy to CGPA
      setStrength(1); // Set strength to 1
    } else {
      if (policyFor === 'MeritBase' && selectedOption === 'CGPA') {
        storedVal1 = val1;
        setPolicy('CGPA'); // Set policy to CGPA
        setStrength(1); // Set strength to 1
      } else if (policyFor === 'MeritBase' && selectedOption === 'Strength') {
        storedVal1 = val1;
        storedVal2 = val2;
        setPolicy('Strength'); // Set policy to Strength
      }
    }
    
  
    const policyData = {
      description,
      policyFor,
      val1: storedVal1,
      val2: storedVal2,
      policy,
      strength,
    };
  
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AddPolicies?description=${description}&val1=${val1}&val2=${val2}&policyFor=${policyFor}&policy=${policy}&strength=${strength}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData),
      });
  
      
        Alert.alert('Success', 'Policy added successfully!');
      
    } catch (error) {
      console.error('Error adding policy:', error);
      Alert.alert('Error', 'Failed to add policy.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Policy For</Text>
      <RNPickerSelect
        onValueChange={(value) => setPolicyFor(value)}
        items={[
          { label: 'Need Base', value: 'NeedBase' },
          { label: 'Merit Base', value: 'MeritBase' },
        ]}
        value={policyFor}
        style={pickerSelectStyles}
      />
      {policyFor === 'MeritBase' && (
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButton}>
            <Button
              title="CGPA"
              onPress={() => setSelectedOption('CGPA')}
              color={selectedOption === 'CGPA' ? 'red' : 'black'}
            />
          </View>
          <View style={styles.radioButton}>
            <Button
              title="Strength"
              onPress={() => setSelectedOption('Strength')}
              color={selectedOption === 'Strength' ? 'red' : 'black'}
            />
          </View>
        </View>
      )}

      <Text style={styles.label}>{policyFor === 'NeedBase' ? 'Min CGPA Required' : selectedOption === 'CGPA' ? 'Min CGPA' : 'Min Strength'}</Text>
      <TextInput
        style={styles.input}
        value={val1}
        onChangeText={setVal1}
        placeholder={policyFor === 'NeedBase' ? 'Enter min CGPA required' : 'Enter value'}
        keyboardType="numeric"
      />

      {policyFor === 'MeritBase' && selectedOption === 'Strength' && (
        <>
          <Text style={styles.label}>Max Strength</Text>
          <TextInput
            style={styles.input}
            value={val2}
            onChangeText={setVal2}
            placeholder="Enter max strength"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Top Strength</Text>
          <TextInput
            style={styles.input}
            value={strength}
            onChangeText={setStrength}
            placeholder="Enter top strength"
            keyboardType="numeric"
          />
        </>
      )}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      <Button title=" Double Click for ADD" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#82b7bf',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'red',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  radioButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginBottom: 12
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    marginBottom: 12,
  },
});

export default AddPolicyScreen;
