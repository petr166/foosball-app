import { ViewProps, View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { FunctionComponent } from 'react';
import { TextX, TextXProps } from './TextX';

export interface OptionsXProps extends ViewProps {
  options: Array<{
    name: string;
    value: any;
  }>;
  selectedValue?: any;
  onSelect: (val: any) => void;
  textProps?: TextXProps;
}
export const OptionsX: FunctionComponent<OptionsXProps> = ({
  options,
  selectedValue,
  onSelect,
  textProps: { style: textStyle, ...textProps } = {},
}) => {
  return (
    <View style={styles.container}>
      {options.map(({ name, value }, i) => {
        return (
          <TouchableOpacity
            key={name + '-' + value}
            style={[
              styles.button,
              selectedValue === value && styles.selectedButton,
              i === 0 && { borderLeftWidth: 0 },
              i === options.length - 1 && { borderRightWidth: 0 },
            ]}
            onPress={() => {
              onSelect(value);
            }}
          >
            <TextX
              style={[styles.text, textStyle]}
              adjustsFontSizeToFit
              {...textProps}
            >
              {name}
            </TextX>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 54,
  },
  button: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    padding: 10,
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#ccc',
  },
  text: {
    fontSize: 15.5,
    textTransform: 'uppercase',
  },
});
