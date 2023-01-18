import { Text, TouchableHighlight } from 'react-native';
import { demoStyles } from './utils';

export const Button: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <TouchableHighlight underlayColor="#DDDDDD" onPress={onPress}>
    <Text style={demoStyles.button}>{label}</Text>
  </TouchableHighlight>
);
