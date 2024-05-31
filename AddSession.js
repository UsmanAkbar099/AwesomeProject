import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
const SemesterScreen = () => {
  const [semester, setSemester] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lastDate, setLastDate] = useState('');

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const calculateEndDate = (start) => {
    let date = new Date(start);
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const addSession = async () => {
    if (!semester || !startDate || !endDate) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Calculate the last date if not already calculated
    let finalLastDate = lastDate;
    if (!finalLastDate) {
      finalLastDate = calculateEndDate(startDate);
      setLastDate(finalLastDate);
      await AsyncStorage.setItem('lastDate', finalLastDate);
      console.log("Stored Last Date in AsyncStorage:", finalLastDate);
    }

    // Log session details to the console
    console.log("Adding session with parameters:", { semester, startDate, endDate, lastDate: finalLastDate });

    // API call to add session
    const apiUrl = `${BASE_URL}/FinancialAidAllocation/api/Admin/AddSession?name=${semester}&startDate=${startDate}&EndDate=${endDate}&lastDate=${finalLastDate}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        Alert.alert("Success", "Session added successfully");
        console.log('Success:', await response.text());
        setSemester('');
        setStartDate('');
        setEndDate('');
        setLastDate('');
      } else if (response.status === 302) {
        Alert.alert("Exists", "Session already exists");
        console.log('Already Exist:', await response.text());
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        Alert.alert("Error", errorText);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert("Fetch Error", error.toString());
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Semester</Text>
      <RNPickerSelect
        onValueChange={(value) => setSemester(value)}
        items={[
          { label: `Spring ${new Date().getFullYear()}`, value: `Spring ${new Date().getFullYear()}` },
          { label: `Summer ${new Date().getFullYear()}`, value: `Summer ${new Date().getFullYear()}` },
          { label: `Fall ${new Date().getFullYear()}`, value: `Fall ${new Date().getFullYear()}` },
          { label: `Spring ${new Date().getFullYear() + 1}`, value: `Spring ${new Date().getFullYear() + 1}` },
          { label: `Summer ${new Date().getFullYear() + 1}`, value: `Summer ${new Date().getFullYear() + 1}` },
          { label: `Fall ${new Date().getFullYear() + 1}`, value: `Fall ${new Date().getFullYear() + 1}` },
        ]}
        style={pickerSelectStyles}
      />

      <Text style={styles.label}>Starting Date</Text>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.datePicker}>{startDate || "Select starting date"}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          testID="startDateTimePicker"
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      <Text style={styles.label}>Ending Date</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.datePicker}>{endDate || "Select ending date"}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          testID="endDateTimePicker"
          value={endDate ? new Date(endDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <Button title="Add Session" onPress={addSession} />

      {lastDate ? (
        <Text style={styles.result}>Last Date: {lastDate}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#82b7bf',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
  },
  datePicker: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 9,
    textAlign: 'center',
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
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
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20,
  },
});

export default SemesterScreen;