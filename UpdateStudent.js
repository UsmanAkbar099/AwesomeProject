import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from './config';

const StudentDataUpdate = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filteredData = students.filter((student, index, self) =>
        student.arid_no &&
        student.arid_no.toLowerCase().includes(searchQuery.toLowerCase()) &&
        index === self.findIndex((s) => s.arid_no === student.arid_no)
      );
      console.log('Filtered data:', filteredData);
      setFilteredStudents(filteredData);
    }
  }, [searchQuery, students]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/getAllStudent`);
      const data = await response.json();
      const filteredData = data.filter(student => !isAllDataNa(student));
      console.log('Filtered fetched data:', filteredData);
      setStudents(filteredData);
      setIsLoading(false);
      
      // Store data in AsyncStorage
      await AsyncStorage.setItem('students', JSON.stringify(filteredData));
      
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError(error);
      setIsLoading(false);
    }
  };

  const isAllDataNa = (student) => {
    return (!student.name || student.name.trim() === '') &&
           (!student.arid_no || student.arid_no.trim() === '') &&
           (!student.student_id) &&
           (!student.cgpa) &&
           (!student.degree || student.degree.trim() === '') &&
           (!student.father_name || student.father_name.trim() === '') &&
           (!student.gender || student.gender.trim() === '') &&
           (!student.profile_image || student.profile_image.trim() === '') &&
           (!student.section || student.section.trim() === '') &&
           (!student.semester);
  };

  const handleNamePress = (item) => {
    Alert.alert(
      "Student Details",
      `Name: ${item.name || 'N/A'}\nStudent ID: ${item.student_id || 'N/A'}\nARID NO: ${item.arid_no || 'N/A'}\nSemester: ${item.semester || 'N/A'}\nSection: ${item.section || 'N/A'}\nCGPA: ${item.cgpa || 'N/A'}`,
      [{ text: "OK" }]
    );
  };

  const handleUpdatePress = async (item) => {
    try {
      // Store student_id in AsyncStorage
      await AsyncStorage.setItem('student_id', item.student_id.toString());
      await AsyncStorage.setItem('arid_no', item.arid_no);
      // Navigate to UpdatePassword screen
      props.navigation.navigate('UpdatedPassword');
    } catch (error) {
      console.error('Error storing student_id in AsyncStorage:', error);
      console.error('Error storing Arid_No in AsyncStorage:', error);
      // Handle error
    }
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentContainer}>
      <TouchableOpacity style={styles.nameContainer} onPress={() => handleNamePress(item)}>
        <Text style={styles.studentName} numberOfLines={1} ellipsizeMode="tail">{item.name || 'N/A'}</Text>
        <Text style={styles.aridNoText}>{item.arid_no || 'N/A'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdatePress(item)}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Students Update</Text>
      </View>
      <View style={styles.horizontalLine} />

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by ARID NO"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item, index) => item.student_id ? item.student_id.toString() : `student-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82b7bf',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingVertical: 1,
    color: 'red',
    fontSize: 24,
    marginTop: 10,
  },
  horizontalLine: {
    backgroundColor: 'black',
    height: 2,
    width: '100%',
    marginTop: 1,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  nameContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
  },
  aridNoText: {
    fontSize: 16,
    color: 'gray',
  },
  updateButton: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: 'black',
  },
});

export default StudentDataUpdate;