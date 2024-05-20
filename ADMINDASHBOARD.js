import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import logo from './logo.png';
import Need from './Needed.png'
import Merit from './Merit.png'
import Accepted from './assept-document.png'
import rejected from './reject.png'
import committee from './comm.png'
import Grader from './audience.png'
import { BASE_URL } from './config';

const ADMINDASHBOARD = (props) => {
  const navigateToMeritBaseShortListing = () => {
    props.navigation.navigate("MeritBaseShortListing");
  };

  const navigateToAcceptedApplication = () => {
    props.navigation.navigate ("AcceptedApplication");
  };

  const navigateToNeed = () => {
    props.navigation.navigate ("NeedBaseApplication");
  };
  const navigateToReject = () => {
    props.navigation.navigate ("RejectedApplication");
  };
  const navigateToCommitteeMember = () => {
    props.navigation.navigate ("CommitteeMember");
  };
  const navigateToAssignGrader = () => {
    props.navigation.navigate ("AssignGrader");
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToMeritBaseShortListing}>
            <Image source={Merit} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>MeritBase ShortListing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToNeed}>
        <Image source={Need} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>NeedBase Applications</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainers}>
        <TouchableOpacity style={styles.buttons} onPress={navigateToAcceptedApplication}>
        <Image source={Accepted} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>Accepted Applications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={navigateToReject}>
        <Image source={rejected} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>Rejected Applications</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainerSS}>
        <TouchableOpacity style={styles.buttonSS} onPress={navigateToCommitteeMember}>
            <Image source={committee} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>Committee Members</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSS} onPress={navigateToAssignGrader}>
        <Image source={Grader} style={{ width: 60, height: 60 }} />
          <Text style={styles.buttonText}>Assign Graders</Text>
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
  
  stat: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
    marginLeft:150
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 40, // Adjust margin bottom to provide spacing between button rows
  },
  buttonContainerSS: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 40, // Adjust margin bottom to provide spacing between button rows
  },  
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 50, // Adjust margin bottom to provide spacing between button rows
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%', // Adjusted width to fit two buttons in one row with some spacing
    height:'110%',
    marginTop:5,
    marginBottom:2
  },
  buttons: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%', // Adjusted width to fit two buttons in one row with some spacing
    height:'110%',
    marginTop:10,
    marginBottom:2
  },
  buttonSS: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%', // Adjusted width to fit two buttons in one row with some spacing
    height:'110%',
    marginTop:5,
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
    marginBottom: 80,
  },
 
});

export default ADMINDASHBOARD;
