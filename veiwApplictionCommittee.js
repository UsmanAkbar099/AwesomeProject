import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
import { WebView } from 'react-native-webview';

const ViewApplicationcomm = (props) => {
    const [applicationData, setApplicationData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState('');
    const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
    const [selectedPdfUri, setSelectedPdfUri] = useState('');
    const [committeeId, setCommitteeId] = useState('');
    const [status, setStatus] = useState('');
    const [suggestion, setSuggestion] = useState('');

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                const data = await AsyncStorage.getItem('selectedApplication');
                if (data !== null) {
                    const parsedData = JSON.parse(data);
                    console.log('Fetched application data:', parsedData);

                    const sortedDocuments = parsedData.EvidenceDocuments.sort((a, b) => {
                        if (a.document_type === 'salaryslip') return -1;
                        if (b.document_type === 'salaryslip') return 1;
                        return 0;
                    });

                    parsedData.EvidenceDocuments = sortedDocuments;
                    setApplicationData(parsedData);
                } else {
                    console.log('No application data found in AsyncStorage');
                }
            } catch (error) {
                console.error('Failed to fetch application data from AsyncStorage', error);
            }
        };

        fetchApplicationData();
    }, []);

    const handleAccept = async () => {
        try {
            const committeeId = await AsyncStorage.getItem('committeeId');
            console.log('Retrieved committeeId:', committeeId);
            setCommitteeId(committeeId);
            setStatus('Accept');
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error while retrieving committeeId:', error);
        }
    };

    const handleReject = async () => {
        try {
            const committeeId = await AsyncStorage.getItem('committeeId');
            console.log('Retrieved committeeId:', committeeId);
            setCommitteeId(committeeId);
            setStatus('Reject');
            confirmReject();
        } catch (error) {
            console.error('Error while retrieving committeeId:', error);
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
                    onPress: () => setIsModalVisible(true),
                },
            ],
            { cancelable: true }
        );
    };

    const handleSubmit = async () => {
        try {
            
            const applicationId = applicationData.applicationID;
            const committeeId = await AsyncStorage.getItem('committeeId'); // Assuming committeeId is stored in AsyncStorage
            console.log(committeeId,applicationId,status,suggestion,amount)
            const apiUrl = `${BASE_URL}/FinancialAidAllocation/api/Committee/GiveSuggestion?committeeId=${committeeId}&applicationId=${applicationId}&status=${status}&comment=${suggestion}&amounts=${amount}`;
    
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const responseData = await response.json();
            console.log('API Response:', responseData);
    
            if (response.ok) {
                Alert.alert('Success', `Application ${status}ed successfully`);
                console.log('Status and amount submitted successfully');
                props.navigation.navigate('CommitteeDashBoard');
            } else {
                Alert.alert('Error', responseData.Message || `Failed to ${status.toLowerCase()} application`);
                console.error(`Failed to ${status.toLowerCase()} application`, responseData);
            }
        } catch (error) {
            console.error(`Error while ${status.toLowerCase()}ing application:`, error);
            Alert.alert('Error', `An error occurred while ${status.toLowerCase()}ing the application. Please try again.`);
        }
    
        setIsModalVisible(false);
        setAmount('');
        setSuggestion('');
    };
    const handleBack = () => {
        setIsModalVisible(false);
    };

    const handleImagePress = (uri) => {
        setSelectedImageUri(uri);
        setIsImageModalVisible(true);
    };

    const handlePdfPress = (uri) => {
        setSelectedPdfUri(uri);
        setIsPdfModalVisible(true);
    };

    const renderItem = ({ item }) => {
        if (!item || !item.image) {
            return null;
        }

        const fileExtension = item.image.split('.').pop().toLowerCase();
        let uri;
        if (item.document_type === 'salaryslip') {
            uri = `${BASE_URL}/FinancialAidAllocation/Content/SalarySlip/${item.image}`;
        } else if (item.document_type === 'houseAgreement') {
            uri = `${BASE_URL}/FinancialAidAllocation/Content/HouseAgreement/${item.image}`;
        }
        else if (item.document_type === 'deathcertificate') {
            uri = `${BASE_URL}/FinancialAidAllocation/Content/DeathCertificates/${item.image}`;
        }

        if (fileExtension === 'pdf') {
            return (
                <TouchableOpacity onPress={() => handlePdfPress(uri)}>
                    <View style={styles.item}>
                        <Image source={require('./pdf.png')} style={styles.pdfIcon} />
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => handleImagePress(uri)}>
                    <View style={styles.item}>
                        <Image source={{ uri }} style={styles.documentImage} />
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={applicationData ? applicationData.EvidenceDocuments : []}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                contentContainerStyle={styles.horizontalList}
                style={styles.flatList}
            />

            {applicationData && (
                <View style={styles.studentInfoContainer}>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Name: </Text> {applicationData.name}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Arid No: </Text> {applicationData.arid_no}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Father Name: </Text> {applicationData.father_name}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Father Status: </Text> {applicationData.father_status}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Required Amount: </Text> {applicationData.requiredAmount}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Reasons: </Text> {applicationData.reason}
                    </Text>
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
                    onPress={handleReject}>
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
                        <Text style={styles.modalText}>Enter Suggestion</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSuggestion}
                            value={suggestion}
                            placeholder="Enter suggestion"
                        />
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
                                <Text style={styles.buttonTexts}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={handleBack}
                            >
                                <Text style={styles.buttonTextss}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isImageModalVisible}
                onRequestClose={() => setIsImageModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.imageModalView}>
                        <TouchableOpacity onPress={() => setIsImageModalVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: selectedImageUri }} style={styles.fullSizeImage} />
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isPdfModalVisible}  // Using isPdfModalVisible state
                onRequestClose={() => setIsPdfModalVisible(false)}  // Updated onRequestClose
            >
                <View style={styles.centeredViews}>
                    <View style={styles.imageModalViews}>
                        <TouchableOpacity onPress={() => setIsPdfModalVisible(false)}>  
                            <Text style={styles.closeButtons}>Your File Is Downloading</Text>
                        </TouchableOpacity>
                        <WebView source={{ uri: selectedPdfUri }} style={styles.fullSizeImages} />  
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
        marginTop: 20,
    },
    flatList: {
        width: '100%',
    },
    item: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    documentImage: {
        width: 200,
        height: 200,
    },
    pdfIcon: {
        width: 200,
        height: 200,
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
        marginHorizontal: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTexts: {
        color: 'green',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextss: {
        color: 'red',
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
        fontSize: 18,
        fontWeight: 'bold',
        color:'black',
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        width: '80%',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 5,
        color:"black",
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    modalButton: {
        marginHorizontal: 5,
    },
    imageModalView: {
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
    imageModalViews: {
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
    fullSizeImage: {
        width: 300,
        height: 500,
        resizeMode: 'contain',
    },
    fullSizeImages: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
        fontSize: 16,
        color: 'red',
    },
    closeButtons: {
        alignSelf: 'flex-end',
        padding: 10,
        fontSize: 30,
        color: 'green',
    },
}); 

export default ViewApplicationcomm;