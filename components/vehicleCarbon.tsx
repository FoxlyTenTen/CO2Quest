import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function VehicleScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locations, setLocations] = useState([]);
  const [watcher, setWatcher] = useState(null);
  const [fuelInput, setFuelInput] = useState('');
  const [fuelType, setFuelType] = useState('Petrol'); // Default to Petrol

  const db = getFirestore();
  const auth = getAuth();

  const emissionFactors = {
    Petrol: 2.32, // Malaysia fuel factor
    Diesel: 2.68,
  };

  const handleAddVehicle = () => {
    if (vehicleName.trim() && vehicleType.trim()) {
      const newVehicle = {
        name: vehicleName,
        type: vehicleType,
        totalDistance: 0,
      };
      setVehicles(prev => [...prev, newVehicle]);
      setVehicleName('');
      setVehicleType('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter vehicle name and select vehicle type.');
    }
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    setLocations([]);
    setIsTracking(true);

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (loc) => {
        setLocations(prev => [...prev, loc.coords]);
      }
    );

    setWatcher(sub);
  };

  const endTracking = () => {
    if (watcher) {
      watcher.remove();
      setWatcher(null);
    }

    setIsTracking(false);

    if (locations.length < 2) {
      Alert.alert('Error', 'Not enough data points collected.');
      return;
    }

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      totalDistance += haversineDistance(prev, curr);
    }

    if (selectedVehicleIndex !== null) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[selectedVehicleIndex].totalDistance += totalDistance;
      setVehicles(updatedVehicles);
    }

    Alert.alert('Trip Completed', `Total distance: ${totalDistance.toFixed(2)} km. Please enter fuel consumption.`);
  };

  const haversineDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);

    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in km
  };

  const calculateEmissionAndSave = async () => {
    if (!fuelInput || isNaN(parseFloat(fuelInput))) {
      Alert.alert('Error', 'Please enter a valid fuel amount in liters.');
      return;
    }

    if (selectedVehicleIndex === null) {
      Alert.alert('Error', 'No vehicle selected.');
      return;
    }

    const fuelLitre = parseFloat(fuelInput);
    const distanceKm = vehicles[selectedVehicleIndex].totalDistance;

    const factor = emissionFactors[fuelType] || 2.32;
    const carbonEmission = parseFloat((fuelLitre * factor).toFixed(2));

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const userDocRef = doc(db, 'records', user.uid);

    const record = {
      vehicleName: vehicles[selectedVehicleIndex].name,
      vehicleType: vehicles[selectedVehicleIndex].type,
      fuelType,
      distanceKm,
      fuelLitre,
      carbonEmissionKg: carbonEmission,
      timestamp: new Date(),
    };

    try {
      await updateDoc(userDocRef, {
        [`dailyPoints.${today}`]: arrayUnion(record)
      });

      Alert.alert('Success', 'Trip saved successfully!');
      setFuelInput('');
      setSelectedVehicleIndex(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save trip.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Add Vehicle" onPress={() => setModalVisible(true)} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20 }}>
        {vehicles.map((vehicle, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.vehicleCard}
            onPress={() => setSelectedVehicleIndex(idx)}
          >
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehicleType}>{vehicle.type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal to Add Vehicle */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Vehicle Name"
              style={styles.input}
              value={vehicleName}
              onChangeText={setVehicleName}
            />

            <Text style={styles.label}>Select Vehicle Type:</Text>
            <View style={styles.fuelTypeContainer}>
              {['Car', 'Van', 'Lorry'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.fuelButton, vehicleType === type && styles.selectedFuelButton]}
                  onPress={() => setVehicleType(type)}
                >
                  <Text style={vehicleType === type ? styles.selectedFuelText : styles.fuelText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Add" onPress={handleAddVehicle} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="grey" />
          </View>
        </View>
      </Modal>

      {/* Modal for Selected Vehicle */}
      <Modal visible={selectedVehicleIndex !== null} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedVehicleIndex !== null && (
              <>
                <Text style={styles.title}>{vehicles[selectedVehicleIndex].name}</Text>
                <Text>Type: {vehicles[selectedVehicleIndex].type}</Text>
                <Text>Distance: {vehicles[selectedVehicleIndex].totalDistance.toFixed(2)} km</Text>

                {isTracking ? (
                  <Button title="End Trip" onPress={endTracking} color="red" />
                ) : (
                  <Button title="Start Tracking" onPress={startTracking} />
                )}

                <Text style={styles.label}>Select Fuel Type:</Text>
                <View style={styles.fuelTypeContainer}>
                  {['Petrol', 'Diesel'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.fuelButton, fuelType === type && styles.selectedFuelButton]}
                      onPress={() => setFuelType(type)}
                    >
                      <Text style={fuelType === type ? styles.selectedFuelText : styles.fuelText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  placeholder="Fuel Consumed (Liters)"
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={fuelInput}
                  onChangeText={setFuelInput}
                />

                <Button title="Calculate & Save" onPress={calculateEmissionAndSave} color="#4CAF50" />
                <Button title="Close" onPress={() => setSelectedVehicleIndex(null)} color="grey" />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: -10, paddingTop: 40, backgroundColor: '#fff' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  vehicleCard: { backgroundColor: '#f8f8f8', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, margin: 10, width: 140, height: 100, justifyContent: 'center', alignItems: 'center' },
  vehicleName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  vehicleType: { fontSize: 14, color: '#666', textAlign: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  fuelTypeContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  fuelButton: { paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginHorizontal: 10 },
  selectedFuelButton: { backgroundColor: '#ff6600', borderColor: '#ff6600' },
  fuelText: { fontSize: 16 },
  selectedFuelText: { fontSize: 16, color: '#fff' },
});
