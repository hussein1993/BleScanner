import { useEffect, useState } from "react";
import { Alert, PermissionsAndroid,Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
type permissionCallback =(result:Boolean) =>void;


const bleManager = new BleManager();
interface BluetoothLowEnergyApi{
    requestPermissions(callback: permissionCallback):Promise<void>;
    scanForDevices(filter?: string):void;
    stopScan(): void;
    allDevices:Device[];
    isConnected: boolean;
    isScanning: boolean;

}

export default function useBLE():BluetoothLowEnergyApi{
    const [allDevices,setAllDevices] =useState<Device[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
   
    useEffect(() => {
        bleManager.onStateChange((state) => {
          setIsConnected(state === 'PoweredOn');
        });
        bleManager.state().then(state =>{
            setIsConnected(state === 'PoweredOn');
        });
    
        return () => {
          bleManager.stopDeviceScan(); // Stop scan on unmount
        };
      }, []);
      
    const requestPermissions = async (callback: permissionCallback)=>{
        if(Platform.OS === "android"){
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
            callback(true);
        }
    };

    const isDuplicateDevice = (devices: Device[],nextDevice:Device)=>
        devices.findIndex(device => nextDevice.id ===device.id) > -1

    const scanForDevices=(filter?:string) =>{
        bleManager.startDeviceScan(null,null,(error,device)=>{
            setIsScanning(true);
            if(error){
                console.log(`${error}`);
                Alert.alert("Please make sure Bluetooth is connected");
            }
            if (device) {
                if (!filter || (filter && device.name?.includes(filter))) { 
                    
                    setAllDevices((prevState)=>{
                        if(!isDuplicateDevice(prevState,device)){
                            return [...prevState,device];
                        }
                        return prevState
                    });
                  }
                }
              }
          
        );
    
    };
    
        const stopScan = () => {
            bleManager.stopDeviceScan();
            console.log("Stopppp");
            setIsScanning(false); 
          };

    return {requestPermissions,scanForDevices,stopScan,allDevices,isConnected,isScanning}
}