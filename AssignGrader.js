import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const AssignGrader = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedTeacherName, setSelectedTeacherName] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [AssignGrader, setAssignGrader] = useState([
    { id: 1, name: 'Usman Akbar', aridNo: '2020-ARID-4236',Section:'BSCS 8D' ,assigned: false },
    { id: 2, name: 'Abdul Islam', aridNo: '2020-ARID-3777',Section:'BSCS 8D' , assigned: false },
    { id: 3, name: 'M Amir Shahzad', aridNo: '2020-ARID-3690',Section:'BSCS 8D' , assigned: false },
    { id: 4, name: 'M Bashir', aridNo: '2020-ARID-3777',Section:'BSCS 8D' , assigned: false },
    { id: 5, name: 'Umair Ali', aridNo: '2020-ARID-4232',Section:'BSCS 8D' ,assigned: false },
    { id: 6, name: 'Abdul Hanan', aridNo: '2020-ARID-3767',Section:'BSCS 8D' , assigned: false },
    { id: 7, name: 'M Amir ', aridNo: '2020-ARID-3694',Section:'BSCS 8D' , assigned: false },
    { id: 8, name: 'M Aftab', aridNo: '2020-ARID-3755',Section:'BSCS 8D' , assigned: false },
    // Add more faculty members here
  ]);

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <View>
        <TouchableOpacity onPress={() => handleTouchFlatlist()}>
          <Text style={styles.facultyMemberName}>{item.name}</Text>
          <Text style={styles.aridNoText}>{item.aridNo}</Text>
          <Text style={styles.aridNoText}>{item.Section}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleAssignButtonPress(item)}>
          <View style={[styles.addButton, { backgroundColor: item.assigned ? 'gray' : 'green' }]}>
            <Text style={styles.addButtonText}>{item.assigned ? 'Assigned' : 'Assign'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const handleAssignButtonPress = (faculty) => {
    if (faculty.assigned) return; // If already assigned, do nothing
    
    setSelectedTeacherId(faculty.id);
    setSelectedTeacherName(faculty.name);
    setIsModalVisible(true);
  };

  const handleAssignConfirm = () => {
    if (selectedOption) {
      // Update faculty member's assigned status
      setAssignGrader(prevState =>
        prevState.map(member =>
          member.id === selectedTeacherId ? { ...member, assigned: true } : member
        )
      );
      // Close modal
      setIsModalVisible(false);
    }
  };
  const handleTouchFlatlist = () => {
    // Your form submission logic goes here
    props.navigation.navigate ("GraderInfo");
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Assign Grader</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="ARID NO#"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={AssignGrader}
        renderItem={renderFacultyMember}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Teacher:</Text>
            <Text style={styles.modalTeacher}>{selectedTeacherName}</Text>
            <Text style={styles.inputs}>Select Teacher:</Text>
            <RNPickerSelect
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                viewContainer: styles.pickerContainer,
                placeholder: styles.placeholder,
              }}
              onValueChange={(value) => setSelectedOption(value)}
              items={[
                { label: 'ALi', value: 'Ali' },
                { label: 'ZAHID', value: 'Zahid' },
                { label: 'Umer', value: 'Umer' },
                // Add more grades as needed
              ]}
              value={selectedOption}
              placeholder={{
                label: 'Select Teacher',
                value: null,
              }}
              placeholderTextColor="black"
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'red' }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'green' }]}
                onPress={handleAssignConfirm}
                disabled={!selectedOption}
              >
                <Text style={styles.modalButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#82b7bf',
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
    marginBottom: 60,
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
  facultyMemberName: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  aridNoText: {
    fontSize: 16,
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ffffff',
    color: 'black',
    borderRadius: 10,
    width: '90%',
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  inputs: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingVertical: 1,
    color: 'black',
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 2,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  pickerContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    color: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTeacher: {
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '40%',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AssignGrader;
