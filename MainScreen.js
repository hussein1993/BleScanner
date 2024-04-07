import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import useBLE from './useBLE';

const MainScreen = ({navigation}) => {
  const {
    requestPermissions,
    scanForDevices,
    DetectedBeacon,
    isConnected,
    isScanning,
    DoneScanning,
  } = useBLE();

  const [landingPage, setLandingPage] = useState(true);
  const Ble_err_msg = 'Please make sure Bluetooth is on';
  const noDeviceMsg = 'No Devices Found!';
  const scanningTxt = 'Scanning BLE devices...';
  const scanTxt = 'Start Scan';

  const startScan = async () => {
    requestPermissions(isGranted => {
      if (isConnected && isGranted) {
        scanForDevices('Oplus-');
      }
    });
  };

  useEffect(() => {
    if (DetectedBeacon.length > 0) {
      const deviceName = DetectedBeacon[0].name;
      navigation.navigate('Login', {deviceName});
    }
  }, [DetectedBeacon]);

  useEffect(() => {
    requestPermissions(isGranted => {});
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLandingPage(false);
    }, 700);
  }, []);

  return (
    <View style={styles.container}>
      {landingPage ? (
        <ActivityIndicator size="large" color="#8294C4" />
      ) : (
        <>
          {!isConnected ? (
            <Text style={styles.text}>{Ble_err_msg}</Text>
          ) : (
            <View style={styles.container}>
              {isScanning && (
                <>
                  <Text style={[styles.text, styles.loadingTxt]}>
                    {scanningTxt}
                  </Text>
                  <ActivityIndicator size="large" color="#8294C4" />
                </>
              )}
              {DoneScanning && !isScanning && (
                <Text style={[styles.text]}>{noDeviceMsg}</Text>
              )}
            </View>
          )}
          {
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={startScan}
                disabled={!isConnected}
                style={[
                  styles.scanButton,
                  {
                    opacity:
                      !isConnected || (isConnected && isScanning) ? 0.5 : 1,
                  },
                ]}>
                <Text style={styles.buttonText}>{scanTxt}</Text>
              </TouchableOpacity>
            </View>
          }
        </>
      )}
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
    fontSize: 20,
    color: 'gray',
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingTxt: {
    position: 'absolute',
    top: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MainScreen;
