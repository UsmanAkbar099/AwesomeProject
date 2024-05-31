import React, { useEffect, useState } from 'react';
import { View, Alert,Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Button, Dimensions, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
import { WebView } from 'react-native-webview';
import { PieChart } from 'react-native-chart-kit';

const ViewApplicationAdmin = () => {
    const [applicationData, setApplicationData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState('');
    const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
    const [selectedPdfUri, setSelectedPdfUri] = useState('');
    const [visibleCommentId, setVisibleCommentId] = useState(null);
    const [isDataModalVisible, setIsDataModalVisible] = useState(false);
    const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
    const [amount, setAmount] = useState('');

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

    const handleImagePress = (uri) => {
        setSelectedImageUri(uri);
        setIsImageModalVisible(true);
    };
    const handleReject = () => {
      Alert.alert(
          "Reject Application",
          "Are you sure you want to reject this application?",
          [
              {
                  text: "Cancel",
                  style: "cancel"
              },
              { text: "Reject", onPress: () => handleRejectConfirmation() }
          ]
      );
  };

  const handleRejectConfirmation = () => {
      // Handle rejection here, you can put your logic to update the application status or perform any other actions
      console.log("Application rejected");
  };

    const handlePdfPress = (uri) => {
        setSelectedPdfUri(uri);
        setIsPdfModalVisible(true);
    };

    const renderDocumentItem = ({ item }) => {
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

    const renderSuggestionItem = ({ item }) => {
        const statusColor = item.status === 'Accept' ? 'green' : item.status === 'Reject' ? 'red' : 'black';
        return (
            <View style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>
                    <Text style={styles.boldText}>Committee Member Name: </Text> {item.CommitteeMemberName}
                </Text>
                <Text style={[styles.suggestionText, { color: statusColor }]}>
                    <Text style={styles.boldText}>Status: </Text> {item.status}
                </Text>
                {visibleCommentId === item.$id && (
                    <Text style={styles.commentText}>
                        <Text style={styles.boldText}>Comment: </Text> {item.comment}
                    </Text>
                )}
                <TouchableOpacity
                    onPress={() => setVisibleCommentId(visibleCommentId === item.$id ? null : item.$id)}
                >
                    <Text style={styles.viewButton}>
                        {visibleCommentId === item.$id ? 'Hide Comment' : 'View Comment'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const getStatusCounts = () => {
        if (!applicationData || !applicationData.Suggestions) {
            return { accept: 0, reject: 0 };
        }

        const acceptCount = applicationData.Suggestions.filter(item => item.status === 'Accept').length;
        const rejectCount = applicationData.Suggestions.filter(item => item.status === 'Reject').length;

        return { accept: acceptCount, reject: rejectCount };
    };

    const { accept, reject } = getStatusCounts();
    const total = accept + reject;
    const acceptPercent = total > 0 ? (accept / total) * 100 : 0;
    const rejectPercent = total > 0 ? (reject / total) * 100 : 0;

    const pieData = [
        {
            name: 'Accept',
            count: accept,
            color: 'green',
            legendFontColor: 'green',
            legendFontSize: 15,
        },
        {
            name: 'Reject',
            count: reject,
            color: 'red',
            legendFontColor: 'red',
            legendFontSize: 15,
        },
    ];

    const handleAccept = () => {
        setIsAcceptModalVisible(true);
    };

    const handleSaveAmount = async () => {
        try {
            await AsyncStorage.setItem('acceptedAmount', amount);
            setIsAcceptModalVisible(false);
            //alert('Amount saved successfully!');
            console.log(amount);
        } catch (error) {
            console.error('Failed to save amount in AsyncStorage', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Application Status Summary</Text>
            <PieChart
                data={pieData}
                width={Dimensions.get('window').width - 50}
                height={220}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
            <Text style={styles.percentageText}>Accept: {accept} ({acceptPercent.toFixed(2)}%)</Text>
            <Text style={styles.percentageText}>Reject: {reject} ({rejectPercent.toFixed(2)}%)</Text>

            <TouchableOpacity onPress={() => setIsDataModalVisible(true)} style={styles.showDetailsButton}>
                <Text style={styles.buttonText}>Show Details</Text>
            </TouchableOpacity>

            <FlatList
                data={applicationData ? applicationData.Suggestions : []}
                renderItem={renderSuggestionItem}
                keyExtractor={item => item.$id.toString()}
                contentContainerStyle={styles.suggestionList}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={isDataModalVisible}
                onRequestClose={() => setIsDataModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Button title="Close" onPress={() => setIsDataModalVisible(false)} />

                    <FlatList
                        data={applicationData ? applicationData.EvidenceDocuments : []}
                        renderItem={renderDocumentItem}
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
                                <Text style={styles.boldText}>Amount Requried: </Text> {applicationData.requiredAmount }
                            </Text>
                            <Text style={styles.studentInfoText}>
                                <Text style={styles.boldText}>Salary: </Text> {applicationData.salary }
                            </Text>
                            <Text style={styles.studentInfoText}>
                                <Text style={styles.boldText}>Reasons: </Text> {applicationData.reason }
                            </Text>
                        </View>
                    )}
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
                visible={isPdfModalVisible}
                onRequestClose={() => setIsPdfModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.imageModalView}>
                        <TouchableOpacity onPress={() => setIsPdfModalVisible(false)}>
                            <Text style={styles.closeButton}>Your File Is Downloading</Text>
                        </TouchableOpacity>
                        <WebView source={{ uri: selectedPdfUri }} style={styles.fullSizeImage} />
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAcceptModalVisible}
                onRequestClose={() => setIsAcceptModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.acceptModalView}>
                        
                        <Text style={styles.modalTitle}>Enter Amount</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <TouchableOpacity onPress={handleSaveAmount} style={styles.saveButton}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => setIsAcceptModalVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity> */}
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
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: 'black',
    },
    boldText: {
        fontWeight: 'bold',
        color: 'red',
        fontSize: 20,
    },
    percentageText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 5,
        color: 'blue',
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
    studentInfoContainer: {
        marginBottom: 150,
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
    suggestionList: {
        width: '90%',
        alignSelf: 'center',
    },
    suggestionItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
    },
    suggestionText: {
        fontSize: 16,
        color: 'black',
    },
    commentText: {
        fontSize: 16,
        color: 'black',
        marginTop: 10,
    },
    viewButton: {
        marginTop: 10,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
    fullSizeImage: {
        width: 300,
        height: 500,
        resizeMode: 'contain',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
        fontSize: 16,
        color: 'red',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#82b7bf',
        justifyContent: 'center',
        alignItems: 'center',
    },
    showDetailsButton: {
        marginTop: 20,
        width: 200,
        height: 50,
        backgroundColor: '#008CBA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    acceptButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptModalView: {
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
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color:'black',
    },
    amountInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: 200,
        marginBottom: 20,
        color:'black',
    },
    saveButton: {
        backgroundColor: '#008CBA',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default ViewApplicationAdmin;