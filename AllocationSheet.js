import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { BASE_URL } from './config';
const AllocationDetails = ({ route }) => {
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [meritBaseShortListed, setMeritBaseShortListed] = useState([]);
  const [needBaseTotalAmount, setNeedBaseTotalAmount] = useState(0);
  const [meritBaseTotalAmount, setMeritBaseTotalAmount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [needBaseMaleCount, setNeedBaseMaleCount] = useState(0);
  const [needBaseFemaleCount, setNeedBaseFemaleCount] = useState(0);
  const [meritBaseMaleCount, setMeritBaseMaleCount] = useState(0);
  const [meritBaseFemaleCount, setMeritBaseFemaleCount] = useState(0);
  const [displayNeedBase, setDisplayNeedBase] = useState(true); // Start with need-based data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API calls for need-based and merit-based data
        const needBasedResponse = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AcceptedApplication`);
        const meritBasedResponse = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AcceptedApplication`);

        const needBasedData = await needBasedResponse.json();
        const meritBasedData = await meritBasedResponse.json();

        console.log('Fetched Need-Based Data:', needBasedData);
        console.log('Fetched Merit-Based Data:', meritBasedData);

        // Set state based on fetched data
        setAcceptedApplications(needBasedData);
        setMeritBaseShortListed(meritBasedData);
        setNeedBaseTotalAmount(calculateTotalAmount(needBasedData));
        setMeritBaseTotalAmount(calculateTotalAmount(meritBasedData));

        // Example calculation for male and female counts
        setNeedBaseMaleCount(calculateGenderCount(needBasedData, 'M'));
        setNeedBaseFemaleCount(calculateGenderCount(needBasedData, 'F'));
        setMeritBaseMaleCount(calculateGenderCount(meritBasedData, 'M'));
        setMeritBaseFemaleCount(calculateGenderCount(meritBasedData, 'F'));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateTotalAmount = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.amount), 0);
  };

  const calculateGenderCount = (data, gender) => {
    return data.filter(item => item.gender === gender).length;
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderNeedBaseRow = ({ item, index }) => {
    const isCGPALower = parseFloat(item.cgpa) < parseFloat(item.prev_cgpa);
    
    return (
      <View style={[styles.row, isCGPALower && styles.highlightedRow]}>
        <Text style={[styles.cell, styles.lineNumber]}>{index + 1}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.arid_no}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.name}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.degree}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.gender}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.cgpa}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.prev_cgpa}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.amount}</Text>
      </View>
    );
  };

  const renderMeritBaseRow = ({ item, index }) => {
    const isCGPALower = parseFloat(item.cgpa) < parseFloat(item.prev_cgpa);
    
    return (
      <View style={[styles.row, isCGPALower && styles.highlightedRow]}>
        <Text style={[styles.cell, styles.lineNumber]}>{index + 1}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.arid_no}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.name}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.degree}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.semester}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.section}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.gender}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.cgpa}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.prev_cgpa}</Text>
        <Text style={[styles.cell, isCGPALower && styles.highlightedCell]}>{item.amount}</Text>
      </View>
    );
  };

  // Calculate grand total amount
  const grandTotalAmount = needBaseTotalAmount + meritBaseTotalAmount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocation Details</Text>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setDisplayNeedBase(true)} style={[styles.toggleButton, displayNeedBase && styles.activeButton]}>
          <Text style={styles.toggleText}>Need-Based Allocation</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDisplayNeedBase(false)} style={[styles.toggleButton, !displayNeedBase && styles.activeButton]}>
          <Text style={styles.toggleText}>Merit-Based Allocation</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Allocation Summary */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.summaryText}>Allocation Summary</Text>
      </TouchableOpacity>
      

      {/* Modal Content */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Allocation Summary</Text>
            {displayNeedBase ? (
              <>
                <Text style={styles.modalText}>Need-Based Total Amount: {needBaseTotalAmount}</Text>
                <Text style={styles.modalText}>Male Count: {needBaseMaleCount}</Text>
                <Text style={styles.modalText}>Female Count: {needBaseFemaleCount}</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>Merit-Based Total Amount: {meritBaseTotalAmount}</Text>
                <Text style={styles.modalText}>Male Count: {meritBaseMaleCount}</Text>
                <Text style={styles.modalText}>Female Count: {meritBaseFemaleCount}</Text>
              </>
            )}
            <Text style={styles.modalText}>Grand Total Amount: {grandTotalAmount}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      {displayNeedBase ? (
        <>
          <Text style={styles.sectionTitle}>Need-Based Allocations</Text>
          <FlatList
            data={acceptedApplications}
            renderItem={renderNeedBaseRow}
            keyExtractor={(item) => item.applicationID.toString()}
          />
          <Text style={styles.modalText}>Total Amount: {needBaseTotalAmount}</Text>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Merit-Based Allocations</Text>
          <FlatList
            data={meritBaseShortListed}
            renderItem={renderMeritBaseRow}
            keyExtractor={(item) => item.student_id.toString()}
          />
          <Text style={styles.modalText}>Total Amount: {meritBaseTotalAmount}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  totalAmount:{
color:'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color:"green",
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#62d1bc',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color:'green',
  },
  closeButton: {
    textAlign: 'center',
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  // New styles for highlighting
  highlightedRow: {
    backgroundColor: '#FFC0CB', // Light pink background
  },
  highlightedCell: {
    color: 'red', // Red text color for highlighted cells
  }, totalAmount: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default AllocationDetails;
