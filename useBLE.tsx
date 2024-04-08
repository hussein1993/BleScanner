import { useEffect, useRef, useState } from "react";
import {  PermissionsAndroid,Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import DeviceInfo from "react-native-device-info";
import { PERMISSIONS, request, requestMultiple,RESULTS } from "react-native-permissions";

type permissionCallback =(result:Boolean) =>void;


const bleManager = new BleManager();
interface BluetoothLowEnergyApi{
    requestPermissions(callback: permissionCallback):Promise<void>;
    scanForDevices(filter?: string):void;
    stopScan(showScanRes:boolean): void;
    DetectedBeacon:Device[];
    isConnected: boolean;
    isScanning: boolean;
    DoneScanning: boolean;

}


export default function useBLE():BluetoothLowEnergyApi{

    const [DetectedBeacon,setDetectedBeacon] =useState<Device[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [DoneScanning, setDoneScanning] = useState(false);
    
    const timeout = 10000;
    const startDate = useRef<number>(0);
    useEffect(() => {
        bleManager.onStateChange((state) => {
          setIsConnected(state === 'PoweredOn');
        });
        bleManager.state().then(state =>{
            setIsConnected(state === 'PoweredOn');
        });
    
        return () => {
          bleManager.stopDeviceScan();
        };
      }, []);
      
    const requestPermissions = async (callback: permissionCallback)=>{
        if(Platform.OS === "android"){
            const apiLvl = await DeviceInfo.getApiLevel();
            if(apiLvl < 31){
            const grantedStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title:'Location Permission',
                    message: "Bluetooth permission require fine location",
                    buttonNegative:'Cancel',
                    buttonPositive:'Ok',
                    buttonNeutral:'Maybe Later',
                }
            );
            callback(grantedStatus===PermissionsAndroid.RESULTS.GRANTED);
            }else{
                const result = await requestMultiple([
                    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                  ]);
                  const isGranted = result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED;

        callback(isGranted);
            }
        }else{
            request(PERMISSIONS.IOS.BLUETOOTH).then((result)=>{
                const isGranted = (result === RESULTS.GRANTED);
                callback(isGranted);
            });
            
        }
    };

    const scanForDevices=(filter?:string) =>{
        startDate.current = Date.now();
        bleManager.startDeviceScan(null,null,(error,device)=>{
            if(error){
                console.log(`${error}`);
                setTimeout(() => {
                    stopScan(false);
                }, 1000);
          
            }
            setDoneScanning(prev => {
                return false;
            });
            setIsScanning(prev => {
                return true;
            });
           
            if (device) {
                if (!filter || (filter && device.name?.includes(filter))) { 
                    setDetectedBeacon([device]);
                    stopScan(false); 
                }
            }

            const endTime = Date.now();
            const timeDiff = endTime - startDate.current;
            setIsScanning(prevIsScanning => {
                if (prevIsScanning) {

                    if (timeDiff > timeout) {
                        stopScan(true);
                    }
                }
                return prevIsScanning;
            });
        });
    };
    
        const stopScan = (showScanRes:boolean) => {
            setIsScanning(prev =>{
                return false;
            }); 
            if(showScanRes){
                setDoneScanning(true);
            }
            bleManager.stopDeviceScan();
          };

    return {requestPermissions,scanForDevices,stopScan,DetectedBeacon,isConnected,isScanning,DoneScanning}
}