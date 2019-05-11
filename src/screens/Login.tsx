import React, { FunctionComponent, useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import { useGlobal } from 'reactn';

import { ScreenContainer, TextX, InputX, ButtonX } from '../components';
import { useLoading } from '../hooks';
import { login } from '../login';
import { UserFragment } from '../fragments';
import { IGlobalState, ROOT } from '../global';

const LOGIN = gql`
  ${UserFragment}

  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        ...UserFragment
      }
      token
    }
  }
`;

export const Login: FunctionComponent = () => {
  const [, setRoot] = useGlobal<IGlobalState>('root');
  const [isLoading, setLoading, errorText, , btnDisabled] = useLoading(false);
  const [email, setEmail] = useState('my@mail.com');
  const [password, setPassword] = useState('12345678');
  const loginReq = useMutation(LOGIN);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <ScreenContainer style={styles.container}>
        <TextX>foosball</TextX>
        <TextX>login</TextX>

        <InputX
          placeholder="your@mail.com"
          value={email}
          onChangeText={val => setEmail(val)}
        />
        <InputX
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={val => setPassword(val)}
        />

        <ButtonX
          title="Login"
          isLoading={isLoading}
          disabled={btnDisabled}
          onPress={() => {
            setLoading(true);
            loginReq({
              variables: {
                input: {
                  email,
                  password,
                },
              },
            })
              .then(({ data: { login: { token, user } } }) => {
                setLoading(false);
                login({ token, user });
              })
              .catch(err => {
                setLoading(false, err);
              });
          }}
        />

        <TextX>or</TextX>

        <ButtonX
          title="Go to register"
          onPress={() => {
            setRoot(ROOT.REGISTER);
          }}
        />

        {!!errorText && <TextX>{errorText}</TextX>}
      </ScreenContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
