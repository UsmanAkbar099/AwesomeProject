import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { BASE_URL } from './config';

const StudentData = (props) => {
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
      `Name: ${item.name || 'N/A'}\nStudent ID: ${item.student_id || 'N/A'}\nARID NO: ${item.arid_no || 'N/A'}\nSemester: ${item.semester || 'N/A'}\nSection: ${item.section || 'N/A'}\nCGPA: ${item.cgpa || 'N/A'}\nPrevious Cgpa: ${item.prev_cgpa || 'N/A'}`,
      [{ text: "OK" }]
    );
  };

  const handleAddIconPress = () => {
    Alert.alert(
      "Choose Action",
      "Do you want to add a new student or update an existing student?",
      [
        { text: "Add Student", onPress: () => props.navigation.navigate('AddStudent') },
        { text: "Update Student", onPress: () => props.navigation.navigate('UpdateStudent') },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const renderStudent = ({ item }) => {
    const isHighlighted = item.cgpa && item.prev_cgpa && item.cgpa < item.prev_cgpa;

    return (
      <View style={[styles.studentContainer, isHighlighted && styles.highlighted]}>
        <TouchableOpacity style={styles.nameContainer} onPress={() => handleNamePress(item)}>
          <Text style={styles.studentName} numberOfLines={1} ellipsizeMode="tail">{item.name || 'N/A'}</Text>
          <Text style={styles.aridNoText}>{item.arid_no || 'N/A'}</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {item.profile_image ? (
            <Image
              source={{ uri: `${BASE_URL}/FinancialAidAllocation/Content/ProfileImages/` + item.profile_image }}
              style={styles.studentImage}
            />
          ) : (
            <Image
              source={require('./logo.png')}
              style={styles.studentImage}
            />
          )}
        </View>
      </View>
    );
  };

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
        <Text style={styles.name}>Students List</Text>
        <TouchableOpacity onPress={handleAddIconPress}>
          <Image source={require('./Add.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />

      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
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
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
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
  highlighted: {
    backgroundColor: 'yellow',
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
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    overflow: 'hidden',
  },
  studentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: 'black',
  },
});

export default StudentData;
