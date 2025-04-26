import React, { useEffect, useState } from 'react';
import { View, Dimensions, Text, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;

export default function CarbonChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Please sign in to view your carbon emissions.');
      return;
    }

    const userDocRef = doc(db, 'records', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const totalCarbonDaily = data.totalCarbonDaily || {};

        const sortedDates = Object.keys(totalCarbonDaily).sort(); // Sort dates (YYYY-MM-DD)
        const last7Dates = sortedDates.slice(-7); // Take the latest 7 days

        const labelFormatted = last7Dates.map(date => {
          const parts = date.split('-');
          return `${parts[1]}/${parts[2]}`; // MM/DD format
        });

        const points = last7Dates.map(date => totalCarbonDaily[date] ?? 0);

        setLabels(labelFormatted);
        setDataPoints(points);
      } else {
        setLabels([]);
        setDataPoints([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const chartData = {
    labels: labels.length > 0 ? labels : ['-', '-', '-', '-', '-', '-', '-'],
    datasets: [
      {
        data: dataPoints.length > 0 ? dataPoints : [0, 0, 0, 0, 0, 0, 0],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 102, 0, ${opacity})`,
      },
    ],
  };

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
        Weekly Carbon Emission (kg CO₂)
      </Text>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={300}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 102, 0, ${opacity})`,
          labelColor: () => '#000',
          propsForDots: {
            r: '3',
            strokeWidth: '2',
            stroke: '#ff6600',
          },
          propsForLabels: {
            dx: '0',
            dy: '-0',
          },
        }}
        bezier
        style={{
          marginBottom: 10,
          marginVertical: 50,
          borderRadius: 15,
          marginLeft: 20,
        }}
      />
    </View>
  );
}
