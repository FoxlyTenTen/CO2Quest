import { View, Text } from 'react-native'
import React from 'react'
import ChatLay from "@/components/chatbot"
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Chatbot() {
  return (
    <SafeAreaView style={{flex: 1}}>
        <ChatLay/>
    </SafeAreaView>
  )
}