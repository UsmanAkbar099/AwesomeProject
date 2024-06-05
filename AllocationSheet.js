import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const AllocationDetails = ({ route }) => {
  const session = route?.params?.session || ' Session Fall-2024';

  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [meritBaseShortListed, setMeritBaseShortListed] = useState([]);
  const [needBaseTotalAmount, setNeedBaseTotalAmount] = useState(0);
  const [meritBaseTotalAmount, setMeritBaseTotalAmount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const applications = [
      { aridNo: '2023-3989', name: 'Hameed', degree: 'BSc', gender: 'Male', cgpa: '3.5', prevCgpa: '3.4', exemptedAmount: '5000', applicationID: '1' },
      { aridNo: '2023-3990', name: 'Hina', degree: 'BSc', gender: 'Female', cgpa: '3.8', prevCgpa: '3.7', exemptedAmount: '6000', applicationID: '2' },
    ];

    const meritShortListed = [
      { aridNo: '2022-3999', name: 'Kainat', degree: 'BSc', semester: '5', section: 'A', gender: 'Female', cgpa: '3.9', prevCgpa: '3.8', position: '1', amount: '7000', studentId: '101' },
      { aridNo: '2022-4033', name: 'JASON GILL', degree: 'BSc', semester: '5', section: 'B', gender: 'Male', cgpa: '3.6', prevCgpa: '3.5', position: '2', amount: '3000', studentId: '102' },
    ];

    setAcceptedApplications(applications);
    setMeritBaseShortListed(meritShortListed);
    setNeedBaseTotalAmount(applications.reduce((total, app) => total + parseInt(app.exemptedAmount), 0));
    setMeritBaseTotalAmount(meritShortListed.reduce((total, student) => total + parseInt(student.amount), 0));
  }, []);

  const calculateGrandTotal = () => {
    return needBaseTotalAmount + meritBaseTotalAmount;
  };

  const renderNeedBaseRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.aridNo}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.name}>{item.degree}</Text>
      <Text style={styles.name}>{item.gender}</Text>
      <Text style={styles.name}>{item.cgpa}</Text>
      <Text style={styles.name}>{item.prevCgpa}</Text>
      <Text style={styles.name}>{item.exemptedAmount}</Text>
    </View>
  );

  const renderMeritBaseRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.aridNo}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.name}>{item.degree}</Text>
      <Text style={styles.name}>{item.semester}</Text>
      <Text style={styles.name}>{item.section}</Text>
      <Text style={styles.name}>{item.gender}</Text>
      <Text style={styles.name}>{item.cgpa}</Text>
      <Text style={styles.name}>{item.prevCgpa}</Text>
      <Text style={styles.name}>{item.position}</Text>
      <Text style={styles.name}>{item.amount}</Text>
    </View>
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocation Details</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.summaryText}>Allocation Summary</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Allocation Summary</Text>
            <Text style={styles.sectionTitles}>Need-Based Total Amount: {needBaseTotalAmount}</Text>
            <Text style={styles.sectionTitles} >Merit-Based Total Amount: {meritBaseTotalAmount}</Text>
            <Text style={styles.sectionTitles}>Grand Total: {calculateGrandTotal()}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={[{ key: 'needBase' }, { key: 'meritBase' }]}
        renderItem={({ item }) => (
          <>
            {item.key === 'needBase' && (
              <>
                <Text style={styles.sectionTitle}>Need-Based Allocations</Text>
                <FlatList
                  data={acceptedApplications}
                  renderItem={renderNeedBaseRow}
                  keyExtractor={(item) => item.applicationID}
                  ListHeaderComponent={() => (
                    <View style={styles.header}>
                      <View style={styles.columnHeader}><Text>Arid No</Text></View>
                      <View style={styles.columnHeader}><Text>Name</Text></View>
                      <View style={styles.columnHeader}><Text>Discipline</Text></View>
                      <View style={styles.columnHeader}><Text>Gender</Text></View>
                      <View style={styles.columnHeader}><Text>Current CGPA</Text></View>
                      <View style={styles.columnHeader}><Text>Previous CGPA</Text></View>
                      <View style={styles.columnHeader}><Text>Fee Exempted</Text></View>
                    </View>
                  )}
                />
                 <Text style={styles.totalAmount}>Total Amount: {needBaseTotalAmount}</Text>
              </>
            )}
            {item.key === 'meritBase' && (
              <>
                <Text style={styles.sectionTitle}>Merit-Based Allocations</Text>
                <FlatList
                  data={meritBaseShortListed}
                  renderItem={renderMeritBaseRow}
                  keyExtractor={(item) => item.studentId.toString()}
                  ListHeaderComponent={() => (
                    <View style={styles.header}>
                      <View style={styles.columnHeader}><Text>Arid No</Text></View>
                      <View style={styles.columnHeader}><Text>Name</Text></View>
                      <View style={styles.columnHeader}><Text>Discipline</Text></View>
                      <View style={styles.columnHeader}><Text>Semester</Text></View>
                      <View style={styles.columnHeader}><Text>Section</Text></View>
                      <View style={styles.columnHeader}><Text>Gender</Text></View>
                      <View style={styles.columnHeader}><Text>Current CGPA</Text></View>
                      <View style={styles.columnHeader}><Text>Previous CGPA</Text></View>
                      <View style={styles.columnHeader}><Text>Position</Text></View>
                      <View style={styles.columnHeader}><Text>Amount</Text></View>
                    </View>
                  )}
                />
                <Text style={styles.totalAmount}>Total Amount: {meritBaseTotalAmount}</Text>
              </>
            )}
          </>
        )}
        keyExtractor={(item) => item.key}
        ListFooterComponent={() => (
          <Text style={styles.summaryTexts}>{session} Allocation Summary</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#82b7bf',
      },
      title: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      name:{
        color:'green',
        fontSize: 15,

      },
      
      sectionTitles: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color:'green',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'black',
      },
      columnHeader: {
        flex: 1,
        alignItems: 'center',
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
      },
      totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color:'black',
      },
      summaryText: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 10,
        textDecorationLine: 'underline',
        color: 'blue',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        minWidth: 300,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color:'black',
      },
      closeButton: {
        textAlign: 'center',
        marginTop: 20,
        color: 'blue',
      },
    });

export default AllocationDetails;