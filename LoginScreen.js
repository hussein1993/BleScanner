import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const deviceName = route.params.deviceName;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Added for error handling

  const handleLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Device Name:</Text>
      <Text style={styles.deviceName}>{deviceName}</Text>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.submitButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3FAF9',
  },
  topText: {
    position: 'absolute',
    top: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deviceName: {
    position: 'absolute',
    top: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    padding: 7,
    margin: 5,
    width: '70%',
    borderWidth: 1,
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 16,
    borderColor: 'lightgrey',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '50%',
  },
  submitButton: {
    backgroundColor: '#8294C4',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
