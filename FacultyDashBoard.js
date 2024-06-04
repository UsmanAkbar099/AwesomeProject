import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, Image, Modal, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
import { Title } from 'react-native-paper'; // Make sure to import Title correctly

const FormScreen = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [facultyInfo, setFacultyInfo] = useState(null);
    const [profileId, setProfileId] = useState(null);

    useEffect(() => {
        getStoredProfileId();
    }, []);

    const getStoredProfileId = async () => {
        try {
            const storedProfileId = await AsyncStorage.getItem('profileId');
            if (storedProfileId !== null) {
                setProfileId(storedProfileId);
                console.log('Profile ID:', storedProfileId); // Log the profile ID
                fetchFacultyInfo(storedProfileId); // Pass profileId to fetchFacultyInfo
                fetchData(storedProfileId); // Pass profileId to fetchData
            } else {
                console.log('Profile ID not found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error retrieving profile ID from AsyncStorage:', error);
        }
    };

    const fetchFacultyInfo = (profileId) => {
        fetch(`${BASE_URL}/FinancialAidAllocation/api/faculty/FacultyInfo?id=${profileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(async data => {
                setFacultyInfo(data); // Update state with fetched faculty info
                console.log('Fetched Faculty info:', data); // Log the fetched data

                // Store facultyId in AsyncStorage
                try {
                    if (data && data.facultyId) {
                        await AsyncStorage.setItem('facultyId', data.facultyId.toString());
                        console.log('Faculty ID stored in AsyncStorage:', data.facultyId);
                    } else {
                        console.log('Faculty ID not found in the fetched data');
                    }

                    // Store faculty info in AsyncStorage
                    await AsyncStorage.setItem('Faculty', JSON.stringify(data));
                    console.log('Faculty info stored in AsyncStorage');
                } catch (error) {
                    console.error('Error storing Faculty info in AsyncStorage:', error);
                }
            })
            .catch(error => {
                console.error('Error fetching faculty information:', error);
                Alert.alert('Error', 'Failed to fetch faculty information. Please try again later.');
            });
    };

    const fetchData = async (profileId) => {
        try {
            const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Faculty/TeachersGraders?id=${profileId}`);
            const json = await response.json();
            console.log('Fetched data:', json); // Log the fetched data
            setData(json);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const handleRate = async () => {
        try {
            // Get studentId from selectedItem or wherever you have it stored
            const studentId = selectedItem?.s.student_id; // Assuming selectedItem has s object with student_id

            // Validate if studentId is available
            if (!studentId) {
                console.error('Error: Student ID not found');
                return;
            }

            // Log the data before making the API call
            console.log('Data for POST method:', {
                profileId,
                studentId,
                rate: rating,
                comment,
            });

            // Construct URL for API call
            const url = `${BASE_URL}/FinancialAidAllocation/api/Faculty/RateGraderPerformance?facultyId=${profileId}&studentId=${studentId}&rate=${rating}&comment=${comment}`;

            // Make API POST request
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the request was successful
            if (response.ok) {
                console.log('Rate submitted successfully');
                Alert.alert('Rate submitted successfully');
            } else {
                const errorMessage = await response.text();
                Alert.alert('Error message:', errorMessage);
            }

            // Reset comment and rating state
            setComment('');
            setRating(0);

            // Close modal
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error submitting rate:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.s.name}</Text>
                <Text style={styles.itemText}>{item.s.arid_no}</Text>
                <Text style={styles.itemText}>Semester: {item.s.semester}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Text style={[styles.star, rating >= i ? styles.selectedStar : null]}>★</Text>
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <View style={styles.formBox}>
                <View style={styles.imageContainer}>
                    {facultyInfo?.profilePic ? (
                        <Image
                            source={{ uri: `${BASE_URL}/FinancialAidAllocation/Content/ProfileImages/${facultyInfo.profilePic}` }}
                            style={styles.image}
                        />
                    ) : (
                        <Image
                            source={require('./logo.png')}
                            style={styles.image}
                        />
                    )}
                </View>
                <View style={styles.facultyInfoContainer}>
                    {facultyInfo && (
                        <>
                            <Title style={styles.title}>{facultyInfo.name}</Title>
                            <Text style={styles.caption}>Faculty Member</Text>
                        </>
                    )}
                </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.s.student_id.toString()} // Use a unique key
                    contentContainerStyle={styles.flatListContent}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Give Rate & Comment To {selectedItem?.s.name}</Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Enter reason"
                            value={comment}
                            onChangeText={setComment}
                        />
                        <View style={styles.starsContainer}>{renderStars()}</View>
                        <TouchableOpacity style={styles.rateButton} onPress={handleRate}>
                            <Text style={styles.rateButtonText}>Rate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#82b7bf',
    },
    formBox: {
        width: '80%',
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        marginTop: 3,
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    caption: {
        fontSize: 13,
        lineHeight: 14,
        width: '100%',
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    facultyInfoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    flatListContent: {
        flexGrow: 1,
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginVertical: 5,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    commentInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: 'black',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    star: {
        fontSize: 30,
        color: 'gray',
    },
    selectedStar: {
        color: 'gold',
    },
    rateButton: {
        backgroundColor: '#008CBA',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    rateButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default FormScreen;