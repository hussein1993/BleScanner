import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import PermissionsAndroid from 'react-native-permissions';
import useBLE from './useBLE';
import {Device} from 'react-native-ble-plx';

const MainScreen = ({navigation}) => {
  const {
    requestPermissions,
    scanForDevices,
    stopScan,
    allDevices,
    isConnected,
    isScanning,
  } = useBLE();
  const timeout = 10000;

  const [filteredDevices, setFilteredDevices] = useState([]);
  const startScan = async () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        setTimeout(() => {
          stopScan();
        }, timeout);
        scanForDevices('Oplus-');
      }
    });
  };
  useEffect(() => {
    // Apply filter and update filtered devices state
    const filterDevices = () => {
      const filtered = allDevices.filter(
        device => device.name && device.name.includes('GR'),
      );
      setFilteredDevices(filtered);
    };

    filterDevices();
  }, [allDevices]);

  useEffect(() => {
    // Navigate to login screen if filtered devices meet condition
    if (filteredDevices.length > 0) {
      stopScan();
      const deviceName = filteredDevices[0].name;
      navigation.navigate('Login', {deviceName});
    }
  }, [filteredDevices]);

  useEffect(() => {
    requestPermissions(isGranted => {});
  }, []);
  return (
    <View style={styles.container}>
      {!isConnected ? (
        <Text style={styles.text}>Please make sure Bluetooth is on</Text>
      ) : (
        <>
          {isScanning && isConnected && (
            <Text style={[styles.text, styles.topText]}>
              Scanning for devices...
            </Text>
          )}
          {allDevices?.map(device => (
            <Text key={device.id} style={[styles.text, styles.devicesFound]}>
              {device.name}
            </Text>
          ))}
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={isScanning ? stopScan : startScan}
          disabled={!isConnected}
          style={[styles.scanButton, {opacity: !isConnected ? 0.5 : 1}]}>
          <Text style={styles.buttonText}>
            {isScanning ? 'Stop Scan' : 'Start Scan'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3FAF9',
  },
  text: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '50%',
  },
  scanButton: {
    backgroundColor: '#8294C4',
    borderRadius: 5,
    padding: 10,
  },
  devicesFound: {
    padding: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topText: {
    position: 'absolute',
    top: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MainScreen;
