import React, { useState } from "react";
import { View } from "react-native";
import Input from "./ui/Input";
import TextAreaInput from "./ui/TextAreaInput";
import Button from "./ui/Button";
import { createMessage } from "../services/api";
import { useTranslate } from "../helpers/i18nHelper";
import Alert from "./ui/Alert";
import validator from "validator";

const validateEmail = (email: string) => {
  return validator.isEmail(email);
};

export default function ContactUsForm() {
  const translate = useTranslate("ContactUsScreen");

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [content, setContent] = useState("");

  const [state, setState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleSendMessage = async () => {
    setState({ loading: true, error: "", success: "" });

    if (!senderName.trim()) {
      setState({
        success: "",
        loading: false,
        error: translate("errorNameRequired"),
      });
      return;
    }

    if (!validateEmail(senderEmail)) {
      setState({
        success: "",
        loading: false,
        error: translate("errorInvalidEmail"),
      });
      return;
    }

    if (!content.trim()) {
      setState({
        success: "",
        loading: false,
        error: translate("errorMessageRequired"),
      });
      return;
    }

    try {
      const message = `${content} \n\n \"${translate("messageFromApp")}\"`;
      const res = await createMessage({
        senderName,
        senderEmail,
        content: message,
      });

      if (res.ok) {
        setState({
          loading: false,
          success: translate("successCreatedMessage"),
          error: "",
        });
        setSenderName("");
        setSenderEmail("");
        setContent("");
        return;
      }

      const data = await res.json();

      setState({
        loading: false,
        error: data.message,
        success: "",
      });
    } catch (err) {
      const errorMessage = err.message;
      setState({ loading: false, error: errorMessage, success: "" });
    }
  };

  const handleToastMessageClose = () => {
    setState({ ...state, error: "", success: "" });
  };

  if (state.success) {
    return (
      <Alert
        type="success"
        onClose={handleToastMessageClose}
        message={state.success}
      />
    );
  }

  if (state.error) {
    return (
      <Alert
        type="error"
        onClose={handleToastMessageClose}
        message={state.error}
      />
    );
  }

  return (
    <View className="relative px-5">
      <View className="w-full mx-auto">
        <Input
          labelText={translate("name")}
          id="senderName"
          type="text"
          value={senderName}
          onChangeText={setSenderName}
        />
        <Input
          labelText={translate("email")}
          id="senderEmail"
          type="email"
          value={senderEmail}
          onChangeText={setSenderEmail}
        />
        <TextAreaInput
          id="message"
          value={content}
          label={translate("textarea")}
          onChangeText={setContent}
        />
        <View className="items-center justify-center">
          <Button
            disabled={state.loading}
            onPress={handleSendMessage}
            text={
              state.loading ? translate("sending") : translate("sendMessageBtn")
            }
          />
        </View>
      </View>
    </View>
  );
}
