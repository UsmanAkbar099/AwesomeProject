import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

const ViewApplication = () => {
    const [studentData, setStudentData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const data = await AsyncStorage.getItem('selectedApplication');
                if (data !== null) {
                    const parsedData = JSON.parse(data);
                    console.log('Fetched student data:', parsedData);
                    setStudentData(parsedData);
                } else {
                    console.log('No student data found in AsyncStorage');
                }
            } catch (error) {
                console.error('Failed to fetch student data from AsyncStorage', error);
            }
        };

        fetchStudentData();
    }, []);

    const handleAccept = () => {
        setIsModalVisible(true);
    };

    const handleSubmit = async () => {
        if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than zero.');
            return;
        }

        try {
            await AsyncStorage.setItem('acceptedAmount', amount);

            const applicationId = studentData.re.applicationID;

            const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AcceptApplication?amount=${amount}&applicationid=${applicationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await response.json();
            console.log('API Response:', responseData);

            if (response.ok) {
                Alert.alert('Success', 'Application Accepted successfully');
                console.log('Amount submitted successfully');
            } else {
                Alert.alert('Error', responseData.Message || 'Failed to submit amount');
                console.error('Failed to submit amount', responseData);
            }
        } catch (error) {
            console.error('Error while submitting amount:', error);
            Alert.alert('Error', 'An error occurred while submitting the amount. Please try again.');
        }

        setIsModalVisible(false);
        setAmount('');
    };

    const handleReject = async () => {
        try {
            const applicationId = studentData.re.applicationID;

            const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/RejectApplication?applicationid=${applicationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await response.json();
            console.log('API Response:', responseData);

            if (response.ok) {
                Alert.alert('Success', 'Application Rejected successfully');
                console.log('Application rejected successfully');
            } else {
                Alert.alert('Error', responseData.Message || 'Failed to reject application');
                console.error('Failed to reject application', responseData);
            }
        } catch (error) {
            console.error('Error while rejecting application:', error);
            Alert.alert('Error', 'An error occurred while rejecting the application. Please try again.');
        }
    };

    const confirmReject = () => {
        Alert.alert(
            'Confirm Reject',
            'Do you want to reject this application?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: handleReject,
                },
            ],
            { cancelable: true }
        );
    };

    const handleBack = () => {
        setIsModalVisible(false);
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                {item.type === 'image' ? (
                    <Image source={{ uri:` ${BASE_URL}/FinancialAidAllocation/Content/ProfileImages/` + item.profile_image }} style={styles.documentImage} />
                ) : (
                    <Text style={styles.documentText}>{item.name}</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={studentData ? studentData.documents : []}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                contentContainerStyle={styles.horizontalList}
                style={styles.flatList}
            />

            {studentData && (
                <View style={styles.studentInfoContainer}>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Name: </Text> {studentData.re.name}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Arid No: </Text> {studentData.re.arid_no}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Father Name: </Text> {studentData.re.father_name}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Father Status: </Text> {studentData.re.father_status}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Required Amount: </Text> {studentData.re.requiredAmount}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Reasons: </Text> {studentData.re.reason}
                    </Text>
                </View>
            )}

            <Text style={styles.boldTexts}>Suggestion from Committee Members:</Text>
            {studentData && (
                <View style={styles.studentInfoContainer}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.studentInfoText}>
                            <Text style={styles.boldText}>{studentData.re.comment}</Text>
                        </Text>
                    </ScrollView>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'green' }]}
                    onPress={handleAccept}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]}
                onPress={confirmReject}>
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Enter Amount</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAmount}
                            value={amount}
                            keyboardType="numeric"
                            placeholder="Enter amount"
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={handleBack}
                            >
                                <Text style={styles.buttonText}>Back</Text>
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
        backgroundColor: '#82b7bf',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        color: 'red',
        fontSize: 20,
    },
    boldTexts: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 20,
        marginTop: 0,
        marginBottom: 0,
    },
    horizontalList: {
        flexGrow: 1,
        height: '89%',
        marginTop: 20, // Adjusted to match marginTop of studentInfoContainer
    },
    flatList: {
        width: '100%',
    },
    item: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginRight: 10,
    },
    documentImage: {
        width: 100,
        height: 100,
    },
    documentText: {
        color: 'black',
    },
    studentInfoContainer: {
        marginBottom: 50,
        marginTop: 5,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
    },
    studentInfoText: {
        fontSize: 16,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10, // Add margin between buttons
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: 'black',
    },
    modalButton: {
        backgroundColor: 'green',
    },
    modalButtons: {
        backgroundColor: 'red',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
    },
});

export default ViewApplication;