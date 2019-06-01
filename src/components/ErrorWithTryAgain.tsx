import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

import { colors } from '../config/styles';
import { TextX } from './TextX';
import { ButtonX } from './ButtonX';

export interface ErrorWithTryAgainProps extends ViewProps {
  onTryAgain?: () => void;
  errorText: string;
}
export const ErrorWithTryAgain: FunctionComponent<ErrorWithTryAgainProps> = ({
  style,
  onTryAgain,
  errorText,
}) => {
  return (
    <View style={[styles.errorContainer, style]}>
      <TextX style={{ marginBottom: 8 }} shadowed={false}>
        {errorText}
      </TextX>

      {!!onTryAgain && (
        <ButtonX
          style={{ backgroundColor: colors.secondary, width: 120 }}
          title="Try again"
          onPress={onTryAgain}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});
