import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from './logo.png'; // This import seems unused, consider removing if not needed
import scholarship from './scholarship.png';
import Need from './Need.png';
import Merit from './Merit.png';
import Help from './Help.png';
import { BASE_URL } from './config';

const StudentDashboard = (props) => {
  const [profileId, setProfileId] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
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
        setStudentInfo(data);
        console.log('Fetched student info:', data);

        try {
          await AsyncStorage.setItem('studentInfo', JSON.stringify(data));
          console.log('Student info stored in AsyncStorage');

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
    fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/getStudentApplicationStatus?id=${studentId}`, {
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
        setApplicationStatus(data);
        console.log('Fetched application status:', data);
      })
      .catch(error => {
        //console.error('Error fetching application status:', error);
        //Alert.alert('Error', 'Failed to fetch application status. Please try again later.');
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const storedProfileId = await AsyncStorage.getItem('profileId');
      if (storedProfileId !== null) {
        fetchStudentInfo(storedProfileId);
      } else {
        console.log('Profile ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving profile ID from AsyncStorage:', error);
    }
    setRefreshing(false);
  };

  const navigateToScholarship = () => {
    if (!applicationStatus || applicationStatus.length === 0 || applicationStatus[0].applicationStatus === 'Rejected') {
      props.navigation.navigate("INFOFROM");
    } else {
      Alert.alert('Cannot Apply', 'Your scholarships at the moment is in processing.');
    }
  };

  const navigateToMerit = () => {
    props.navigation.navigate("MeritBaseCriteria");
  };
  const navigateToMerits = () => {
    
  };
  const navigateToNeed = () => {
    props.navigation.navigate("NeedBaseCriteria");
  };

  const navigateToHelp = () => {
    props.navigation.navigate("NeedHelp");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
        <TouchableOpacity style={styles.buttonss} onPress={navigateToMerits}>
          
          <Text style={styles.buttonTexts}>Accept</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonss} onPress={navigateToScholarship}>
          
        <Text style={styles.buttonTextss}>Decline</Text>
          
        </TouchableOpacity>
       
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginLeft: 50,
  },
  wel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft: 20,
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
    marginLeft: 90,
  },
  stat: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
    marginLeft: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 40,
  },
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    height: '110%',
  },
  buttons: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    height: '110%',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTexts: {
    flexDirection: 'row',
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  buttonTextss: {
    flexDirection: 'row',
    color: 'red',
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
