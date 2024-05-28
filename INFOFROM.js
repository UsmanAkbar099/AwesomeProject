import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';


const AfterLogin = (props) => {
    const [arid, setArid] = useState('');
    const [name, setName] = useState('');
    const [fathername, setFathername] = useState('');
    const [father, setFather] = useState('');
    const [gname, setGname] = useState('');
    const [semester, setSemester] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [gcontact, setGcontact] = useState('');
    const [grelation, setGrelation] = useState('');
    const [job, setJobTitle] = useState('');
    const [contactno, setContactno] = useState('');
    const [salary, setSalary] = useState('');
    const [studentid, setStudentid] = useState('');

    const [uploadSalarySlip, setUploadSalarySlip] = useState(null);
    const [uploadDeathCertificate, setUploadDeathCertificate] = useState(null);

    const FileData = (event) => {
        // Handle file upload
    };

    const FatherStatus = (value) => {
        setFather(value);
    };

    const clearFrom = () => {
        // Handle form submission

        setFather('');
        setGcontact('');
        setGname('');
        setGrelation('');
        setUploadSalarySlip('');
        setUploadDeathCertificate('');
        setSalary('');
        setJobTitle('');
        setContactno('');
        setStudentid('');
    };

    const handleUploadSalary = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker.types.images],
            });
            console.log('File picked:', res); // Log the picked file object
            // Set the uploaded file to state
            setUploadSalarySlip(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // Handle cancelled picker
            } else {
                // Handle other errors
                console.log(err);
            }
        }
    };
    const handleDeathCertificate = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker.types.images],
            });
            console.log('File picked:', res); // Log the picked file object
            // Set the uploaded file to state
            setUploadDeathCertificate(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // Handle cancelled picker
            } else {
                // Handle other errors
                console.log(err);
            }
        }
    };


    const handleNext = async () => {
        // Perform validation checks
        if (name.trim() === '') {
            alert('Please enter your name.');
            return;
        }

        if (arid.trim() === '') {
            alert('Please enter your Arid number.');
            return;
        }

        if (semester.trim() === '') {
            alert('Please enter your semester.');
            return;
        }
        if (cgpa.trim() === '') {
            alert('Please enter your cgpa.');
            return;
        }

        if (!father) {
            alert('Please select father status.');
            return;
        }

        if (father === 'Deceased') {
            if (gname.trim() === '') {
                alert('Please enter guardian name.');
                return;
            }

            if (gcontact.trim() === '') {
                alert('Please enter guardian contact.');
                return;
            }

            if (grelation.trim() === '') {
                alert('Please enter guardian relation.');
                return;
            }
            if (!uploadDeathCertificate) {
                alert('Please upload the death certificate.');
                return;
            }
        } else if (father === 'Alive') {
            if (fathername.trim() === '') {
                alert('Please enter father name.');
                return;
            }

            if (job.trim() === '') {
                alert('Please enter father\'s job title.');
                return;
            }

            if (contactno.trim() === '') {
                alert('Please enter contact number.');
                return;
            }

            if (salary.trim() === '') {
                alert('Please enter salary.');
                return;
            }
        }

        // If all validations pass, store data in AsyncStorage
        const formData = {
            name,
            arid,
            semester,
            cgpa,
            father,
            fathername,
            job,
            contactno,
            salary,
            gname,
            gcontact,
            grelation,
            studentid,
            uploadSalarySlip,
            uploadDeathCertificate,
        };

        try {
            await AsyncStorage.setItem('formData', JSON.stringify(formData));
            console.log('Form data stored in AsyncStorage');
            props.navigation.navigate("PersonalDetails",{data:formData});
        } catch (error) {
            console.error('Error storing form data in AsyncStorage:', error);
        }
    };

    const handleCancel = () => {
        clearFrom();
        console.log('Form cleared');
    };
    const [profileId, setProfileId] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    useEffect(() => {
        // Fetch profileId from AsyncStorage or wherever it's stored
        getStoredProfileId();
    }, []);

    const getStoredProfileId = async () => {
        try {
            const storedProfileId = await AsyncStorage.getItem('profileId');
            if (storedProfileId !== null) {
                setProfileId(storedProfileId);
                fetchStudentInfo(storedProfileId);
            } else {
                console.log('Profile ID not found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error retrieving profile ID from AsyncStorage:', error);
        }
    };

    const fetchStudentInfo = (profileId) => {
        fetch(`${BASE_URL}/FinancialAidAllocation/api/Student/getStudentInfo?id=${profileId}`, {
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
                setStudentInfo(data); // Update state with fetched student info
                console.log('Fetched student info:', data); // Log the fetched data
                setName(data.name);
                setStudentid(data.student_id);
                setArid(data.arid_no);
                setSemester(data.semester.toString());
                setCgpa(data.cgpa.toString());
                setFathername(data.father_name);

                // Store student info in AsyncStorage
                try {
                    await AsyncStorage.setItem('studentInfo', JSON.stringify(data));
                    console.log('Student info stored in AsyncStorage');

                    // Fetch application status based on student_id
                    if (data && data.student_id) {
                        // fetchApplicationStatus(data.student_id);
                    }
                } catch (error) {
                    console.error('Error storing student info in AsyncStorage:', error);
                }
            })
            .catch(error => {
                console.error('Error fetching student information:', error);
                Alert.alert('Error', 'Failed to fetch student information. Please try again later.');
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>Student Info</Text>
            <View style={styles.formBox}>
                <View>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Name"
                        onChangeText={setName}
                        value={name}
                        editable={false}
                    />
                </View>
                <View>
                    <Text style={styles.label}>Arid No.</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Arid"
                        onChangeText={setArid}
                        value={arid}
                        editable={false}
                    />
                </View>
                <Text style={styles.label}>Semester</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Semester"
                    onChangeText={setSemester}
                    value={semester}
                    editable={false}
                />
                <Text style={styles.label}>CGPA</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your CGPA"
                    onChangeText={setCgpa}
                    value={cgpa}
                    editable={false}
                />
                <Text style={styles.label}>Father Status</Text>
                <View style={styles.radioButton}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton.Android
                            value="Alive"
                            status={father === 'Alive' ? 'checked' : 'unchecked'}
                            onPress={() => FatherStatus('Alive')}
                        />
                        <Text>Alive</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton.Android
                            value="Deceased"
                            status={father === 'Deceased' ? 'checked' : 'unchecked'}
                            onPress={() => FatherStatus('Deceased')}
                        />
                        <Text>Deceased</Text>
                    </View>
                </View>
                {father === 'Deceased' && (
                    <View>
                        <Text style={styles.sectionHeader}>Guardian Details:</Text>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Guardian Name"
                                onChangeText={setGname}
                                value={gname}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Guardian Contact"
                            onChangeText={setGcontact}
                            value={gcontact}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Guardian Relation "
                            onChangeText={setGrelation}
                            value={grelation}
                        />
                        <TouchableOpacity style={styles.uploadButton} onPress={handleDeathCertificate}>
                            <Text style={styles.inputs}>{uploadDeathCertificate ? uploadDeathCertificate[0].name : 'Upload Death Certificate'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {father === 'Alive' && (
                    <View>
                        <Text style={styles.sectionHeader}>Parent Details:</Text>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Father Name"
                                onChangeText={setFathername}
                                value={fathername}
                                editable={false}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Occupation"
                            onChangeText={setJobTitle}
                            value={job}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contact No."
                            onChangeText={setContactno}
                            value={contactno}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Salary"
                            onChangeText={setSalary}
                            value={salary}
                        />
                        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadSalary}>
                            <Text style={styles.inputs}>{uploadSalarySlip ? uploadSalarySlip[0].name : 'Upload Salary Slip'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.NextButton} onPress={handleNext}>
                        <Text style={styles.buttonText}>Next</Text>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2, // Add marginTop to separate from the form
    },
    formBox: {
        width: '80%',

        backgroundColor: '#82b7bf',
        padding: 20,
        borderRadius: 30
    },
    name: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 1,
        color: "green"
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'red'
    },
    input: {
        height: 36,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 3,
        paddingHorizontal: 10,
        color: 'white'
    },
    radioButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        borderRadius: 6,
        color: 'black'
    },
    sectionHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center'
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
};

export default AfterLogin;
