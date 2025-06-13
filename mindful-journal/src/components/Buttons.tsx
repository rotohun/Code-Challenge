import { Button } from "react-native-paper";

export const PrimaryButton = ({ title, onPress }: { title: string, onPress: () => void }) => {
  return <Button mode="contained" onPress={onPress}>{title}</Button>;
};

export const SecondaryButton = ({ title, onPress }: { title: string, onPress: () => void }) => {
  return <Button mode="outlined" onPress={onPress}>{title}</Button>;
};

export const TertiaryButton = ({ title, onPress }: { title: string, onPress: () => void }) => {
  return <Button mode="text" onPress={onPress}>{title}</Button>;
};