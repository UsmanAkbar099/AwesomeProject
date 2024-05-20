import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from './logo.png';
import scholarship from './scholarship.png';
import Need from './Need.png';
import Merit from './Merit.png';
import Help from './Help.png';
import {BASE_URL} from './config';

const StudentDashboard = (props) => {
  const navigateToScholarship = () => {
    if (!applicationStatus || applicationStatus.length === 0 || applicationStatus[0].applicationStatus === 'Rejected') {
      props.navigation.navigate("INFOFROM");
    } else {
      // Handle other cases, like showing an alert or taking alternative actions
      Alert.alert('Cannot Apply', 'Your scholarships at the moment is in processing.');
    }
  };

  const navigateToMerit = () => {
    props.navigation.navigate("MeritBaseCriteria");
  };

  const navigateToNeed = () => {
    props.navigation.navigate("NeedBaseCriteria");
  };
  
  const navigateToHelp = () => {
    props.navigation.navigate("NeedHelp");
  };

  const navigateToLog = () => {
    props.navigation.navigate("Login");
  };

  const [profileId , setProfileId] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    // Fetch profileId from AsyncStorage or wherever it's stored
    getStoredProfileId();
  }, []);

  const getStoredProfileId = async () => {
    try {
      const storedProfileId = await AsyncStorage.getItem('profileId');
      if (storedProfileId !== null) {
        setProfileId(storedProfileId);
        fetchStudentInfo(storedProfileId);
      } else {
        console.log('Profile ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving profile ID from AsyncStorage:', error);
    }
  };
  
  const fetchStudentInfo = (profileId) => {
    fetch(`${BASE_URL}/FinancialAidAllocation/api/Student/getStudentInfo?id=${profileId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(async data => {
      setStudentInfo(data); // Update state with fetched student info
      console.log('Fetched student info:', data); // Log the fetched data
  
      // Store student info in AsyncStorage
      try {
        await AsyncStorage.setItem('studentInfo', JSON.stringify(data));
        console.log('Student info stored in AsyncStorage');
  
        // Fetch application status based on student_id
        if (data && data.student_id) {
          fetchApplicationStatus(data.student_id);
        }
      } catch (error) {
        console.error('Error storing student info in AsyncStorage:', error);
      }
    })
    .catch(error => {
      console.error('Error fetching student information:', error);
      Alert.alert('Error', 'Failed to fetch student information. Please try again later.');
    });
  };
  
  const fetchApplicationStatus = (studentId) => {
    fetch(`${BASE_URL}/FinancialAidAllocation/api/Student/getStudentApplicationStatus?id=${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      setApplicationStatus(data); // Update state with fetched application status
      console.log('Fetched application status:', data); // Log the fetched data
    })
    .catch(error => {
      console.error('Error fetching application status:', error);
      Alert.alert('Error', 'Failed to fetch application status. Please try again later.');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.frombox}>
        <Text style={styles.wel}>Welcome</Text>
        {studentInfo && (
          <>
            <Text style={styles.nam}>{studentInfo.name}</Text>
            <Text style={styles.ard}>{studentInfo.arid_no}</Text>
          </>
        )}
        <Text style={styles.app}>Application Status</Text>
        <Text style={styles.stat}>
          {applicationStatus && applicationStatus.length > 0 ? applicationStatus[0].applicationStatus : "Not Submitted"}
        </Text>
      </View>
      
      <View>
  {!applicationStatus || applicationStatus.length === 0 && (
    <View style={styles.DATE}>
      <Text style={styles.heading}>Apply Before Due Date</Text>
      <Text style={styles.date}>11 May</Text>
    </View>
  )}
</View>



      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToScholarship}>
          <Image source={scholarship} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>Apply for Scholarship</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToNeed}>
          <Image source={Need} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>NeedBase Criteria</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainers}>
        <TouchableOpacity style={styles.buttons} onPress={navigateToMerit}>
          <Image source={Merit} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>MeritBase Criteria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={navigateToHelp}>
          <Image source={Help} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>Need Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#82b7bf',
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'red',
    marginLeft: 50
  },
  wel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft: 20
  },
  nam: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
  },
  ard: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
  },
  app: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft: 90
  },
  stat: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
    marginLeft: 150
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 40, // Adjust margin bottom to provide spacing between button rows
  },

  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 30, // Adjust margin bottom to provide spacing between button rows
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%', // Adjusted width to fit two buttons in one row with some spacing
    height: '110%'
  },
  buttons: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%', // Adjusted width to fit two buttons in one row with some spacing
    height: '110%'
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  horizontalLine: {
    backgroundColor: 'black',
    height: 2,
    width: '100%',
    marginBottom: 30,
  },
  frombox: {
    backgroundColor: '#fff',
    padding: 20,
    height: '30%',
    width: '90%',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 30,
    marginTop: 1,
  },
});

export default StudentDashboard;
