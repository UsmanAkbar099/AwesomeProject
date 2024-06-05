import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { fetchAcceptedApplications, fetchMeritBaseShortListed } from '../../Services/Admin/AdminApiHandler';
//import { NeedBaseTotalAmountContext } from '../../context/NeedBaseTotalAmountContext';

const AllocationDetails = ({ route }) => {
  //const { session } = route.params;
  const [needBaseTotalAmount, setNeedBaseTotalAmount] = useState(0);
  const [meritBaseTotalAmount, setMeritBaseTotalAmount] = useState(0);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [meritBaseShortListed, setMeritBaseShortListed] = useState([]);
  const [loading, setLoading] = useState(true);

  //const needBaseTotalAmountContext = useContext(NeedBaseTotalAmountContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const applications = await fetchAcceptedApplications();
        const meritShortListed = await fetchMeritBaseShortListed();
        setAcceptedApplications(applications);
        setMeritBaseShortListed(meritShortListed);
        setNeedBaseTotalAmount(
          applications.reduce((total, app) => total + parseInt(app.amount), 0)
        );
        setMeritBaseTotalAmount(
          meritShortListed.reduce((total, student) => total + parseInt(student.amount), 0)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderNeedBaseRow = ({ item }) => (
    <View style={styles.row}>
      <Text>{item.aridNo}</Text>
      <Text>{item.name}</Text>
      <Text>{item.degree}</Text>
      <Text>{item.gender}</Text>
      <Text>{item.cgpa}</Text>
      <Text>{item.prevCgpa}</Text>
      <Text>{item.exemptedAmount}</Text>
    </View>
  );

  const renderMeritBaseRow = ({ item }) => (
    <View style={styles.row}>
      <Text>{item.aridNo}</Text>
      <Text>{item.name}</Text>
      <Text>{item.degree}</Text>
      <Text>{item.semester}</Text>
      <Text>{item.section}</Text>
      <Text>{item.gender}</Text>
      <Text>{item.cgpa}</Text>
      <Text>{item.prevCgpa}</Text>
      <Text>{item.position}</Text>
      <Text>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocation Details</Text>
      <ScrollView horizontal>
        <ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View>
              <FlatList
                data={acceptedApplications}
                renderItem={renderNeedBaseRow}
                keyExtractor={(item) => item.applicationID}
                ListHeaderComponent={() => (
                  <View style={styles.header}>
                    <Text>Arid No</Text>
                    <Text>Name</Text>
                    <Text>Discipline</Text>
                    <Text>Gender</Text>
                    <Text>Current CGPA</Text>
                    <Text>Previous CGPA</Text>
                    <Text>Fee Exempted</Text>
                  </View>
                )}
              />
              <Text>Total Amount: {needBaseTotalAmount}</Text>
              <FlatList
                data={meritBaseShortListed}
                renderItem={renderMeritBaseRow}
                keyExtractor={(item) => item.studentId.toString()}
                ListHeaderComponent={() => (
                  <View style={styles.header}>
                    <Text>Arid No</Text>
                    <Text>Name</Text>
                    <Text>Discipline</Text>
                    <Text>Semester</Text>
                    <Text>Section</Text>
                    <Text>Gender</Text>
                    <Text>Current CGPA</Text>
                    <Text>Previous CGPA</Text>
                    <Text>Position</Text>
                    <Text>Amount</Text>
                  </View>
                )}
              />
              <Text>Total Amount: {meritBaseTotalAmount}</Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      <Text>{session} Allocation Summary</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AllocationDetails;
