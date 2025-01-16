import { View, Text, TextInput } from "react-native";
import { textDirection } from "../../helpers/flexDirection";

const TextAreaInput = ({ id, value, onChangeText, label }) => {
  return (
    <View className="w-full mb-5">
      <Text className="text-lg font-medium text-center text-gray-200">
        {label}
      </Text>
      <TextInput
        id={id}
        accessibilityLabel={label}
        accessibilityHint={`Provide a ${label}`}
        multiline
        value={value}
        onChangeText={onChangeText}
        className={`${textDirection()} w-full p-2 text-lg  text-slate-200  bg-gray-700 border border-gray-600 rounded-lg`}
        style={{ height: 80 }}
      />
    </View>
  );
};

export default TextAreaInput;
