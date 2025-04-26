import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, TouchableOpacity, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AICarbonAssistant() {
  const [recommendations, setRecommendations] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const db = getFirestore();

  const genAI = new GoogleGenerativeAI("AIzaSyDfB9Rro-EDDAMVt0x6npJQ-nO3r8RcRrY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const fetchDataAndPredict = async () => {
        setLoading(true);
        setRecommendations("");
      
        try {
          const auth = getAuth();
          const user = auth.currentUser;
      
          if (!user) {
            Alert.alert("Error", "User not signed in.");
            return;
          }
      
          const userDocRef = doc(db, "records", user.uid);
          const docSnap = await getDoc(userDocRef);
      
          if (!docSnap.exists()) {
            Alert.alert("No data found", "Please track your carbon emission first.");
            return;
          }
      
          const userData = docSnap.data();
          const dailyPoints = userData.dailyPoints || {};
      
          let allEmissions: { date: string, record: any }[] = [];
      
          Object.entries(dailyPoints).forEach(([date, records]: [string, any]) => {
            if (Array.isArray(records)) {
              records.forEach((record: any) => {
                allEmissions.push({
                  date,
                  record,
                });
              });
            }
          });
      
          if (allEmissions.length === 0) {
            Alert.alert("No carbon data yet", "Please track at least one trip first.");
            return;
          }
      
          const dataText = allEmissions
            .map(({ date, record }) => {
              const emission = record.carbonEmissionKg || 0;
              const vehicle = record.vehicleName || "Unknown Vehicle";
              const distance = record.distanceKm || 0;
              return `${emission.toFixed(2)} kg CO₂ using ${vehicle} over ${distance.toFixed(2)} km on ${date}`;
            })
            .join(", ");
      
          console.log("Formatted Carbon Data:", dataText);
      
          const result = await model.generateContent({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Here is my company's carbon emission data from transport: ${dataText}. Please analyze it and provide personalized suggestions for improvement.`,
                  },
                ],
              },
            ],
            systemInstruction: {
              role: "system",
              parts: [
                {
                  text: `
      You are a supportive, friendly sustainability advisor for SME companies.
      Analyze the company's transport-related carbon emission patterns and provide 2–3 personalized strategies to reduce emissions.
      If the company's daily transportation emissions are high (>50 kg CO₂/day), suggest practical improvements like optimizing delivery routes, using eco-friendly fleets, or encouraging ride-sharing among employees.
      If the emissions are low (<20 kg CO₂/day), congratulate the company warmly and suggest maintaining good practices.
      Always speak in a positive, motivational, business-minded tone.
      Focus only on transportation activities (vehicle usage, logistics, commuting). Do not mention unrelated areas such as food, office energy, or personal habits.
      Be friendly but also strategic, as you are helping a business grow sustainably. Make sure the response always in simple, not too long
                `,
                },
              ],
            },
          });
      
          const finalReply = result.response.text();
          setRecommendations(finalReply);
          setMessages([{ sender: 'bot', text: finalReply }]);
          setDataAvailable(true);
      
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "Failed to get recommendations.");
        } finally {
          setLoading(false);
        }
      };
      

  

    fetchDataAndPredict();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: input.trim() }] }
        ],
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: `
You are a supportive, friendly environmental assistant.
Always motivate user about reducing carbon emissions.
Focus on transport habits only.
Max 2–3 tips in simple language.
              `,
            },
          ],
        },
      });

      const botReply = result.response.text();
      const botMessage = { sender: 'bot', text: botReply.trim() };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Oops! Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#ff6600" style={{ margin: 10 }} />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask something..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 50,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: "#ffdddd",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#e0f7fa",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 15,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
  },
  sendButton: {
    backgroundColor: "#ff6600",
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginLeft: 10,
    height: 45,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
