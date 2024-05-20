import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { BASE_URL } from './config';

const PersonalDetails = () => {
    const [house, setHouse] = useState('');
    const [hagree, setHagree] = useState(null);
    const [ragree, setRagree] = useState(null); // State for rental agreement
    const [reason, setReason] = useState('');
    const [amount, setAmount] = useState('');

    const House = (value) => {
        setHouse(value);
    };

    const clearForm = () => {
        setHouse('');
        setHagree(null);
        setRagree(null); // Reset rental agreement
        setReason('');
        setAmount('');
    };

    const handleHouseAgree = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker.types.images],
            });
            console.log('File picked:', res);
            setHagree(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // Handle cancelled picker
            } else {
                console.log(err);
            }
        }
    };

    const handleRentalAgree = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker.types.images],
            });
            console.log('File picked:', res);
            setRagree(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // Handle cancelled picker
            } else {
                console.log(err);
            }
        }
    };

    const handleCancel = () => {
        clearForm();
        console.log('Form cleared');
    };

    const handleSubmit = async () => {
        // Perform validation checks
        if (house === '') {
            Alert.alert('Error', 'Please select house type');
            return;
        }
        if (house === 'rent' && !ragree) {
            Alert.alert('Error', 'Please upload rental agreement');
            return;
        }
        if (!hagree) {
            Alert.alert('Error', 'Please upload house agreement');
            return;
        }
        if (reason.trim() === '') {
            Alert.alert('Error', 'Please enter reason for scholarship');
            return;
        }
        if (amount.trim() === '') {
            Alert.alert('Error', 'Please enter required amount');
            return;
        }
    
        // Prepare form data for submission
        const formData = new FormData();
        formData.append('house', house);
        formData.append('house_agreement', hagree[0]);
        if (house === 'rent') {
            formData.append('rental_agreement', ragree[0]);
        }
        formData.append('reason', reason);
        formData.append('amount', amount);
    
        try {
            // API call to submit the form data
            const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Student/sendApplication`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Form submitted successfully:', data);
                Alert.alert('Success', 'Form submitted successfully');
                clearForm();
            } else {
                const errorData = await response.json();
                console.error('Form submission failed:', errorData);
                Alert.alert('Error', `Form submission failed: ${errorData.message || response.status}`);
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error('Network request failed:', error);
                Alert.alert('Network Error', 'A network error occurred. Please check your connection and try again.');
            } else {
                console.error('Error submitting form:', error);
                Alert.alert('Error', 'An error occurred while submitting the form');
            }
        }
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.name}>Personal Details</Text>
            <View style={styles.formBox}>
                <Text style={styles.label}>House</Text>
                <View style={styles.radioButton}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton.Android
                            value="own"
                            status={house === 'own' ? 'checked' : 'unchecked'}
                            onPress={() => House('own')}
                        />
                        <Text>Own</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton.Android
                            value="rent"
                            status={house === 'rent' ? 'checked' : 'unchecked'}
                            onPress={() => House('rent')}
                        />
                        <Text>Rent</Text>
                    </View>
                </View>

                {house === 'rent' && (
                    <TouchableOpacity style={styles.uploadButton} onPress={handleRentalAgree}>
                        <Text style={styles.inputs}>{ragree ? ragree[0].name : 'Rental Agreement'}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.uploadButton} onPress={handleHouseAgree}>
                    <Text style={styles.inputs}>{hagree ? hagree[0].name : 'House Agreement'}</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Reason for scholarship"
                    onChangeText={setReason}
                    value={reason}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Required Amount"
                    onChangeText={setAmount}
                    value={amount}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.NextButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 1,
        color: 'green'
    },
    formBox: {
        width: '80%',
        backgroundColor: '#82b7bf',
        padding: 20,
        borderRadius: 30
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'black'
    },
    input: {
        height: 36,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: 'black'
    },
    radioButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        borderRadius: 6,
        color: 'black'
    },
    uploadButton: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 50,
        marginBottom: 10,
    },
    inputs: {
        color: 'blue',
        fontSize: 16
    },
    NextButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 1,
        paddingVertical: 10,
        width: '40%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 1,
        paddingVertical: 10,
        width: '40%',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
};

export default PersonalDetails;
