import { Text, View } from 'react-native';
import { demoStyles } from './utils';

export const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <View style={demoStyles.info}>
      <Text style={demoStyles.infoLabel}>{label}:</Text>
      <Text>{value}</Text>
    </View>
  );
};
