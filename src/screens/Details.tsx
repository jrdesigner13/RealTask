import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { VStack, HStack, useTheme, ScrollView, Box, Text } from 'native-base';
import { CircleWavyCheck, Hourglass, Clipboard, CaretDoubleRight } from 'phosphor-react-native';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';

import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Carddetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';


type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as RouteParams;

  function handleOrderClose(){
    if(!solution){
      return Alert.alert('Solicitation', 'Inform the solution to close the request');
    }

    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert('Solicitation', 'Closed solicitation.');
      navigation.goBack();
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Solicitation', 'unable to close the request.');
    })
  }

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const {title, description, status, created_at, closed_at, solution } = doc.data();
      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        title,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });

      setIsLoading(false);

    });
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700" >
      <Box px={6} bg="gray.600">
        <Header title="Solicitation" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4} >
        {
          order.status === 'closed'
          ? <CircleWavyCheck size={22} color={colors.green[300]} />
          : <Hourglass size={22} color={colors.secondary[700]} />
        }
        <Text 
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
          >
            { order.status === 'closed' ? 'Finished' : 'in progress'}
          </Text>
          </HStack>
          <ScrollView mx={5} showVerticalScrollIndicator={false}>
            <Carddetails
              title="Solicitation"
              description={order.title}
              icon={CaretDoubleRight}
              

            />
             <Carddetails
              title="Description"
              description={order.description}
              icon={Clipboard}
              footer={`Registered in ${order.when}`} 
            />
            <Carddetails
              title="Solution"
              icon={CircleWavyCheck}
              description={order.solution}
              footer={order.closed && `Finished in ${order.closed}`}
            >
              { order.status === 'open' &&
                <Input
                placeholder='Description of the solution' 
                onChangeText={setSolution}
                textAlignVertical="top"
                h={24}
                multiline
              />}
            </Carddetails>
          </ScrollView>
          {
            !order.closed &&
            <Button 
              title='Finish request'
              m={5}
              onPress={handleOrderClose}
            />
          }
      
    </VStack>
  );
}