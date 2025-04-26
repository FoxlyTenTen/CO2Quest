import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;

export default function CarbonDashboard() {
  const [currentCarbon, setCurrentCarbon] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  const fetchData = async () => {
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "Please sign in first.");
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'records', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const today = new Date().toISOString().split('T')[0];
        const todayData = data.dailyPoints?.[today] || [];

        let todayTotalCarbon = 0;
        todayData.forEach((entry: any) => {
          if (typeof entry === 'object' && entry.carbonEmissionKg) {
            todayTotalCarbon += entry.carbonEmissionKg;
          }
        });

        setCurrentCarbon(todayTotalCarbon);

        // Prepare prediction based on previous 3 days if available
        const totalCarbonDaily = data.totalCarbonDaily || {};
        const sortedDates = Object.keys(totalCarbonDaily).sort();
        const last3Dates = sortedDates.slice(-3);

        const prev1 = totalCarbonDaily[last3Dates[2]] || 0;
        const prev2 = totalCarbonDaily[last3Dates[1]] || 0;
        const prev3 = totalCarbonDaily[last3Dates[0]] || 0;

        await predictTomorrow(prev1, prev2, prev3);
      } else {
        setCurrentCarbon(0);
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const predictTomorrow = async (prev1: number, prev2: number, prev3: number) => {
    try {
      const response = await fetch('https://adhamm2rz.pythonanywhere.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'my_secret_key_123',
        },
        body: JSON.stringify({
          prev1,
          prev2,
          prev3,
        }),
      });

      const json = await response.json();
      if (response.ok) {
        setPrediction(json.prediction);
      } else {
        Alert.alert('Error', json.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error occurred');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todayChartData = {
    labels: ["Today"],
    data: [currentCarbon ? Math.min(currentCarbon / 10, 1) : 0],
  };

  const predictChartData = {
    labels: ["Predicted"],
    data: [prediction ? Math.min(prediction / 10, 1) : 0],
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <View style={styles.chartPage}>
            <Text style={styles.title}>Current Carbon Emission 🌍</Text>
            <ProgressChart
              data={todayChartData}
              width={screenWidth - 60}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(102, 204, 255, ${opacity})`,
                labelColor: () => '#000',
              }}
              hideLegend={false}
            />
            <Text style={styles.resultText}>
              Today's Total: {currentCarbon?.toFixed(2) ?? 0} kg CO₂
            </Text>
          </View>

          <View style={styles.chartPage}>
            <Text style={styles.title}>Predicted Emission 🔮</Text>
            <ProgressChart
              data={predictChartData}
              width={screenWidth - 60}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(255, 153, 102, ${opacity})`,
                labelColor: () => '#000',
              }}
              hideLegend={false}
            />
            <Text style={styles.resultText}>
              Prediction: {prediction?.toFixed(2) ?? 0} kg CO₂
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  chartPage: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
