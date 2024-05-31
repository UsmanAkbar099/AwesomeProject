import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

const FacultyMember = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [filteredFacultyMembers, setFilteredFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [noGraderAssigned, setNoGraderAssigned] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/FacultyMembers`);
      const data = await response.json();
      setFacultyMembers(data);
      setFilteredFacultyMembers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchModalData = async (facultyId) => {
    try {
      setModalLoading(true);
      setNoGraderAssigned(false);
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/gradersInformation?id=${facultyId}`);
      const data = await response.json();
      
      if (data.Message === "No Grader Assigned") {
        setNoGraderAssigned(true);
        setModalData([]);
      } else {
        setNoGraderAssigned(false);
        setModalData(data);
      }
    } catch (error) {
      console.error('Error fetching modal data:', error);
      Alert.alert('Error', 'Failed to fetch modal data. Please try again later.');
    } finally {
      setModalLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterFacultyMembers = () => {
      const filtered = facultyMembers.filter(member =>
        member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFacultyMembers(filtered);
    };

    filterFacultyMembers();
  }, [searchQuery, facultyMembers]);

  const handleRemoveButtonPress = async (facultyId) => {
    console.log('Removing faculty with ID:', facultyId);
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/RemoveFacultyMember?facultyId=${facultyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedFacultyMembers = facultyMembers.filter(member => member.facultyId !== facultyId);
        setFacultyMembers(updatedFacultyMembers);
        setFilteredFacultyMembers(updatedFacultyMembers);
        console.log('Faculty member removed successfully');
      } else {
        console.error('Error removing faculty member');
        Alert.alert('Error', 'Failed to remove faculty member. Please try again later.');
      }
    } catch (error) {
      console.error('Error removing faculty member:', error);
      Alert.alert('Error', 'Failed to remove faculty member. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveFacultyMember = (facultyId) => {
    Alert.alert(
      "Remove Faculty Member",
      "Are you sure you want to remove this faculty member?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => handleRemoveButtonPress(facultyId)
        }
      ],
      { cancelable: false }
    );
  };

  const handleAddIconPress = () => {
    props.navigation.navigate('AddFacultyMembers');
  };

  const handleFacultyNamePress = (facultyId) => {
    console.log('Faculty ID:', facultyId);
    setModalVisible(true);
    fetchModalData(facultyId);
  };

  const handleModalNamePress = (studentId) => {
    Alert.alert(
      "Remove Garder",
      "Are you sure you want to remove this Garder?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.setItem('student_id', studentId.toString());
              console.log('Stored student ID:', studentId);

              // API POST request
              const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/Removegrader?id=${studentId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId })
              });

              if (response.ok) {
                console.log('Student removed successfully');
                // Update modal data after removal
                const updatedModalData = modalData.filter(item => item.studentId !== studentId);
                setModalData(updatedModalData);
              } else {
                console.error('Error removing student');
                Alert.alert('Error', 'Failed to remove student. Please try again later.');
              }
            } catch (error) {
              console.error('Error storing student ID:', error);
              Alert.alert('Error', 'Failed to remove student. Please try again later.');
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <Image
        source={item.profilePic ? { uri: `${BASE_URL}/FinancialAidAllocation/Content/ProfileImages/${item.profilePic}` } : require('./logo.png')}
        style={styles.facultyMemberImage}
      />
      <View style={styles.facultyMemberInfo}>
        <TouchableOpacity onPress={() => handleFacultyNamePress(item.facultyId)}>
          <Text style={styles.facultyMemberName}>{item.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmRemoveFacultyMember(item.facultyId)}>
          <View style={styles.removeButton}>
            <Text style={styles.addButtonText}>Remove</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModalFacultyMember = ({ item }) => (
    <TouchableOpacity onPress={() => handleModalNamePress(item.studentId)}>
      <View style={styles.modalFacultyMemberContainer}>
        <Image
          source={item.profile_image ? { uri: `${BASE_URL}/FinancialAidAllocation/Content/ProfileImages/${item.profile_image}` } : require('./logo.png')}
          style={styles.modalFacultyMemberImage}
        />
        <Text style={styles.modalFacultyMemberName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Faculty Members</Text>
        <TouchableOpacity onPress={handleAddIconPress}>
          <Image source={require('./Add.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Faculty Members"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="black" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredFacultyMembers}
            renderItem={renderFacultyMember}
            keyExtractor={(item, index) => (item.facultyId ? item.facultyId.toString() : index.toString())}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Garder Details</Text>
            {modalLoading ? (
              <ActivityIndicator size="large" color="black" style={styles.loader} />
            ) : (
              noGraderAssigned ? (
                <Text style={styles.noGraderText}>No Grader Assigned</Text>
              ) : (
                <FlatList
                  data={modalData}
                  renderItem={renderModalFacultyMember}
                  keyExtractor={(item, index) => `${item.facultyId}_${index}`}
                />
              )
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
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
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  facultyMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: 10,
  },
  facultyMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  facultyMemberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  facultyMemberName: {
    fontSize: 18,
    color: 'black',
  },
  removeButton: {
    backgroundColor: 'red',
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loader: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'green',
  },
  modalFacultyMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalFacultyMemberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  modalFacultyMemberName: {
    fontSize: 18,
    color: 'black',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noGraderText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default FacultyMember;