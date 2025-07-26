import { Alert, Image, View } from 'react-native';

import { styles } from './styles';
import { Button } from '@/components/button';

export function Home() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/logo.png')}
        style={styles.logo}
      />

      <Button
        title="Adicionar"
        onPress={() => Alert.alert('Pituquinha Apertou')}
      />
    </View>
  );
}


