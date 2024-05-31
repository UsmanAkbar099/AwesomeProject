import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
import { WebView } from 'react-native-webview';

const ViewApplication = () => {
    const [applicationData, setApplicationData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState('');
    const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
    const [selectedPdfUri, setSelectedPdfUri] = useState('');
    const [visibleCommentId, setVisibleCommentId] = useState(null);

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

    const renderSuggestionItem = ({ item }) => (
        <View style={styles.suggestionItem}>
            <Text style={styles.suggestionText}>
                <Text style={styles.boldText}>Committee Member Name: </Text> {item.CommitteeMemberName}
            </Text>
            <Text style={styles.suggestionText}>
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

    return (
        <View style={styles.container}>
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
                        <Text style={styles.boldText}>Required Amount: </Text> {applicationData.requiredAmount}
                    </Text>
                    <Text style={styles.studentInfoText}>
                        <Text style={styles.boldText}>Reasons: </Text> {applicationData.reason}
                    </Text>
                </View>
            )}

            {applicationData && (
                <FlatList
                    data={applicationData.Suggestions}
                    renderItem={renderSuggestionItem}
                    keyExtractor={item => item.$id.toString()}
                    contentContainerStyle={styles.suggestionList}
                />
            )}

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
        marginBottom: 20,
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
});

export default ViewApplication;