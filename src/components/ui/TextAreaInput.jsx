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
        name={id}
        testID={label}
        multiline
        numberOfLines={3}
        value={value}
        onChangeText={onChangeText}
        className={`${textDirection()} w-full p-1 text-lg  text-slate-200 placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-lg`}
      />
    </View>
  );
};

export default TextAreaInput;
