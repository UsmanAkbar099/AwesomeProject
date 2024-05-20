import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Login from './login'; // Import your screen components
import StudentDashboard from './StudentDashboard';
import INFOFROM from './INFOFROM';
import PersonalDetails from './PersonalDetails';
import NeedBaseCriteria from './NeedBaseCriteria';
import MeritBaseCriteria from './MeritBaseCriteria';
import NeedHelp from './NeedHelp';
import ADMINDASHBOARD from './ADMINDASHBOARD';
import MeritBaseShortListing from './MeritBaseShortListing';
import NeedBaseApplication from './NeedBaseApplication';
import AcceptedApplication from './AcceptedApplication';
import RejectApp from './RejectApp';
import CommitteeMember from './CommitteeMember';
import AssignGrader from './AssignGrader';
import { View, StyleSheet, Text,Alert, } from 'react-native';
import { Avatar, Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNExitApp from 'react-native-exit-app';
import BudgetHistory from './AddBudget';
import AddCommitteeMember from './AddCommitteeMember';
import FacultyMember from './FacultyMember';
import AddPolicies from './AddPolicies';
import AddStudent from './AddStudent';
import AddFacultyMembers from './AddFacultyMembers';
import ADDPOLICIESS from './ADDPOLICIESS'
import GraderInfo from './GraderInfo';
import AddBudgetScreen from './AddBudgetScreen';
import StudentData from './StudentData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom drawer header component
const CustomDrawerHeader = () => {
  const [profileId , setProfileId] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
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
         // fetchApplicationStatus(data.student_id);
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
  return (
    <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
      <Avatar.Image
        source={require('./logo.png')} // Replace 'your-profile-image-path.jpg' with your actual image path
        size={50}
      />
      <View style={{ marginLeft: 10, flexDirection: 'column' }}>
      {studentInfo && (
          <>
        <Title style={styles.title}>{studentInfo.name}</Title>
        <Text style={styles.caption}>{studentInfo.arid_no}</Text>
        </>
        )}
      </View>
    </View>
  );
};
const CustomDrawerHeader1 = () => {
  const [profileId , setProfileId] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  useEffect(() => {
    // Fetch profileId from AsyncStorage or wherever it's stored
    getStoredProfileId();
  }, []);

  const getStoredProfileId = async () => {
    try {
      const storedProfileId = await AsyncStorage.getItem('profileId');
      if (storedProfileId !== null) {
        setProfileId(storedProfileId);
        fetchAdminInfo(storedProfileId);
      } else {
        console.log('Profile ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving profile ID from AsyncStorage:', error);
    }
  };
  
  const fetchAdminInfo = (profileId) => {
    fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/getAdminInfo?id=${profileId}`, {
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
      setAdminInfo(data); // Update state with fetched student info
      console.log('Fetched Admin info:', data); // Log the fetched data
  
      // Store student info in AsyncStorage
      try {
        await AsyncStorage.setItem('Admin', JSON.stringify(data));
        console.log('Admin info stored in AsyncStorage');
  
        // Fetch application status based on student_id
        if (data && data.adminId) {
        //  fetchApplicationStatus(data.adminId);
        }
      } catch (error) {
        console.error('Error storing Admin info in AsyncStorage:', error);
      }
    })
    .catch(error => {
      console.error('Error fetching Admin information:', error);
      Alert.alert('Error', 'Failed to fetch Admin information. Please try again later.');
    });
  };
  
  return (
    <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
      <Avatar.Image
        source={require('./logo.png')} // Replace 'your-profile-image-path.jpg' with your actual image path
        size={50}
      />
      <View style={{ marginLeft: 10, flexDirection: 'column' }}>
      {adminInfo && (
          <>
        <Title style={styles.title}>{adminInfo.name}</Title>
        <Text style={styles.caption}>ADMIN </Text>
        </>
        )}


        
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="StudentDashBoard" options={{ headerShown: false }}>
          {() => (
            <Drawer.Navigator drawerContent={CustomDrawerContent}>
              <Drawer.Screen name="StudentDashBoard" component={StudentDashboard}
              options={{
                headerShown: true, // Ensure header is shown if needed
                headerStyle: { backgroundColor: 'lightblue' }, // Change header background color
                drawerStyle: { backgroundColor: 'lightblue' }, // Change drawer background color
                headerTitleAlign: 'center',
                headerRight: () => (
                  <Image
                    source={require('./logo.png')} // Replace 'path/to/your/image.png' with the correct path
                    style={{ width: 40, height: 40, marginRight: 10 }} // Adjust the width, height, and margin as needed
                  />
                ),
                
              }} />
              
            </Drawer.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="INFOFROM" component={INFOFROM} />
        <Stack.Screen name="MeritBaseCriteria" component={MeritBaseCriteria} />
        <Stack.Screen name="NeedBaseCriteria" component={NeedBaseCriteria} />
        <Stack.Screen name="NeedHelp" component={NeedHelp} />
        <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
        <Stack.Screen name="AdminDashBoard" options={{ headerShown: false }}>
          {() => (
            <Drawer.Navigator drawerContent={CustomDrawerContent1}>
      <Drawer.Screen
  name="AdminDashBoard"
  component={ADMINDASHBOARD}
  options={{
    headerShown: true, // Ensure header is shown if needed
    headerStyle: { backgroundColor: 'lightblue' }, // Change header background color
    drawerStyle: { backgroundColor: 'lightblue' }, // Change drawer background color
    headerTitleAlign: 'center',
    headerRight: () => (
      <Image
        source={require('./logo.png')} // Replace 'path/to/your/image.png' with the correct path
        style={{ width: 40, height: 40, marginRight: 10 }} // Adjust the width, height, and margin as needed
      />
    ),
    
  }}
/>
         </Drawer.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="MeritBaseShortListing" component={MeritBaseShortListing} />
        <Stack.Screen name="NeedBaseApplication" component={NeedBaseApplication} />
        <Stack.Screen name="AcceptedApplication" component={AcceptedApplication} />
        <Stack.Screen name="RejectedApplication" component={RejectApp} />
        <Stack.Screen name="CommitteeMember" component={CommitteeMember} />
        <Stack.Screen name="AssignGrader" component={AssignGrader} />
        <Stack.Screen name="BudgetHistory" component={BudgetHistory} />
        <Stack.Screen name="AddBudgetScreen" component={AddBudgetScreen} />
        <Stack.Screen name="AddStudent" component={AddStudent} />
        <Stack.Screen name="Policies" component={AddPolicies} />
        <Stack.Screen name="ADDPolicies" component={ADDPOLICIESS} />
        <Stack.Screen name="FacultyMember" component={FacultyMember} />
        <Stack.Screen name="AddFacultyMembers" component={AddFacultyMembers} />
        <Stack.Screen name="AddCommitteeMember" component={AddCommitteeMember} />
        <Stack.Screen name="GraderInfo" component={GraderInfo} />
        <Stack.Screen name="StudentData" component={StudentData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Custom drawer content component
const CustomDrawerContent = (props) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // Handle logout here
            // For example, you can navigate to the login screen or close the application
            // Replace the following line with your logout logic
             props.navigation.navigate('Login');
            // Or close the application
             //RNExitApp.exitApp();
            // Note: You need to import RNExitApp from 'react-native-exit-app'
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <CustomDrawerHeader />
      <DrawerItemList {...props} />
      <DrawerItem
        label="LogOut"
        onPress={handleLogout}
        labelStyle={{
          fontWeight: 'bold', // Set font weight to bold
          textAlign: 'center', // Align text center
          color:'black',
          fontSize:20
        }}
      />
    </DrawerContentScrollView>
  );
};
const CustomDrawerContent1 = (props) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            
             props.navigation.navigate('Login');
            // Or close the application
            // RNExitApp.exitApp();
           
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleBudget = () => {
   
           
             props.navigation.navigate('BudgetHistory');
            
          
        
      
  };
 
  const handleStudents = () => {
           
    props.navigation.navigate('StudentData');

};
  const handlePolicies = () => {
           
             props.navigation.navigate('Policies');
            
    
  };
  const handleFaculty = () => {

             props.navigation.navigate('FacultyMember');
    
  };
  const handleCommittee = () => {
           
             props.navigation.navigate('AddCommitteeMember');
        
  };

  return (
    <DrawerContentScrollView {...props}>
      <CustomDrawerHeader1 />
      <DrawerItemList {...props} />
      <DrawerItem
        label=" BUDGET"
        onPress={handleBudget}
        labelStyle={{
          fontWeight: 'bold', // Set font weight to bold
          textAlign: 'center', // Align text center
          color:'black',
          fontSize:20
        }}
      />
     
<DrawerItem
  label="STUDENTS"
  onPress={handleStudents}
  labelStyle={{
    fontWeight: 'bold', // Set font weight to bold
    textAlign: 'center', // Align text center
    color:'black',
    fontSize:20
  }}
/>
      <DrawerItem
        label=" POLICIES"
        onPress={handlePolicies}
        labelStyle={{
          fontWeight: 'bold', // Set font weight to bold
          textAlign: 'center', // Align text center
          color:'black',
          fontSize:20
        }}
        
      />
      <DrawerItem
        label=" FACULTY MEMBER"
        onPress={handleFaculty}
        labelStyle={{
          fontWeight: 'bold', // Set font weight to bold
          textAlign: 'center', // Align text center
          color:'black',
          fontSize:20
        }}
      /><DrawerItem
      label=" COMMITTEE MEMBER"
      onPress={handleCommittee}
      labelStyle={{
        fontWeight: 'bold', // Set font weight to bold
        textAlign: 'center', // Align text center
        color:'black',
        fontSize:20
      }}
    />
      <DrawerItem
        label="LogOut"
        onPress={handleLogout}
        labelStyle={{
          fontWeight: 'bold', // Set font weight to bold
          textAlign: 'center', // Align text center
          color:'black',
          fontSize:20
        }}
      />
    </DrawerContentScrollView>
  );
};


const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    marginTop: 3,
    color:'green',
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 13,
    lineHeight: 14,
    width: '100%',
    color:'red',
    fontWeight: 'bold',
  },
});

export default App;
