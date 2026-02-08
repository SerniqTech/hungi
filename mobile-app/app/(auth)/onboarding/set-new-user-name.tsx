import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SetNewUserNameScreen = () => {
  const router = useRouter();
  const saveUserName = useAuthStore((s) => s.saveUserName);
  const loading = useAuthStore((s) => s.loading);
  const [error, setError] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (text: string) => {
    setInputValue(text);

    if (error) setError("");
  };

  const handleNext = async () => {
    if (inputValue.trim().length < 3) {
      setError("Please enter a valid name");
      return;
    }

    try {
      const { error: onboardError } = await saveUserName(inputValue);

      if (onboardError) {
        setError(onboardError);
        return;
      }

      router.replace("/(auth)/onboarding/set-new-user-building");
    } catch (e) {
      console.log(e);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <VStack className="flex-1 px-6 pt-4">
          <VStack className="flex-1">
            <VStack className="mb-6">
              <Heading size="2xl" className="font-bold mb-2">
                Your name
              </Heading>
              <Text size="md" className="text-gray-600">
                So we know who&apos;s hungry
              </Text>
            </VStack>

            <FormControl
              isInvalid={!!error}
              size="lg"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <Input variant="outline" size="xl" className="rounded-lg">
                <InputField
                  type="text"
                  placeholder="Enter Your Name"
                  value={inputValue}
                  onChangeText={handleChange}
                  className="text-xl"
                  autoFocus
                />
              </Input>
              <FormControlError>
                <FormControlErrorText className="text-red-500">
                  {error}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>

          <VStack className="pb-6 gap-3">
            <Button size="xl" isDisabled={loading} onPress={handleNext}>
              <ButtonText className="font-semibold">
                {loading ? "Saving..." : "Next"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SetNewUserNameScreen;
