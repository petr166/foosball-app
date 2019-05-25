import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextX } from './TextX';

export interface SearchBarProps {
  onFocus?: () => void;
  isActive?: boolean;
  onCancelPress?: () => void;
  onChangeText?: (val: string) => void;
  inputProps?: TextInputProps;
  value?: string;
  placeholder?: string;
  refSet?: (ref: any) => void;
}
class SearchBar extends React.Component<SearchBarProps, { isActive: boolean }> {
  static defaultProps = {
    placeholder: 'Search',
    isActive: false,
  };

  textInput: any;

  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      isActive: !!props.isActive,
    };
  }

  handleCancelPress = () => {
    this.textInput.clear();
    this.props.onChangeText && this.props.onChangeText('');

    this.textInput.blur();
    this.props.onCancelPress && this.props.onCancelPress();
  };

  setActive = (isActive = true) => {
    if (this.state.isActive !== isActive) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ isActive });
    }
  };

  render() {
    const {
      onChangeText,
      inputProps: { onFocus = null, onBlur = null, ...inputProps } = {},
      placeholder,
      refSet,
    } = this.props;
    const { isActive } = this.state;

    return (
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <View style={styles.searchIcon}>
            <Icon name="search" size={18} color="#808080" />
          </View>

          <TextInput
            ref={textInput => {
              refSet && refSet(textInput);
              this.textInput = textInput;
            }}
            style={[styles.input, isActive && styles.inputActive]}
            placeholder={placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            clearButtonMode="while-editing"
            maxLength={30}
            selectionColor="#000" // cursor
            onFocus={(...args) => {
              onFocus && onFocus(...args);
              this.setActive();
            }}
            onBlur={(...args) => {
              onBlur && onBlur(...args);
              this.setActive(false);
            }}
            onChangeText={onChangeText}
            underlineColorAndroid="rgba(0,0,0,0)"
            returnKeyType="search"
            placeholderTextColor="#808080"
            {...inputProps}
          />

          {isActive && (
            <TouchableOpacity onPress={this.handleCancelPress}>
              <TextX style={styles.cancelText} shadowed={false}>
                Cancel
              </TextX>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 14,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: -1,
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(211,211,211, .4)',
    borderRadius: 6,
    textAlign: 'left',
    flex: 1,
    paddingLeft: 32,
    paddingRight: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  inputActive: {
    marginRight: 10,
  },
  cancelText: {
    color: '#808080',
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 23,
    top: Platform.OS === 'ios' ? 8 : 13,
    zIndex: 1,
  },
});

export default SearchBar;
