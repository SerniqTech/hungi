import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const handlePress = () => {
    router.push("/(auth)/login");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dummy Native Component</Text>
      <Pressable onPress={handlePress}>
        <Text>click</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});

export default Index;
