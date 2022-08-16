import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (!title || !description) {
      return Alert.alert('Register', 'Fill all the fields, please.');
    }
    setIsLoading(true);

    firestore()
    .collection('orders')
    .add({
      title,
      description,
      status: 'open',
      created_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert("Solicitation", "Solicitation registered successfully !");
      navigation.goBack();
    })
    .catch(error => {
      console.log(error);
      setIsLoading(false);
      return Alert.alert('Solicitation', 'Unable to register solicitation.')
    })

  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="New Task" />
      <Input 
        placeholder="Title"
        mt={4}
        onChangeText={setTitle}
        />
      <Input
        placeholder="Description"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />
      <Button
        title="Register"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}