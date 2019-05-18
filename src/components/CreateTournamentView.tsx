import React, { FunctionComponent, useState, useRef } from 'react';
import {
  StyleSheet,
  ViewProps,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import { TextX, InputX } from '../components';

const maxDate = moment().add(5, 'year');

export interface CreateTournamentViewProps extends ViewProps {
  tournament: any;
}
export const CreateTournamentView: FunctionComponent<
  CreateTournamentViewProps
> = ({
  tournament: { name = '', description = '', startDate = '', endDate = '' },
}) => {
  const [form, setForm] = useState({ name, description, startDate, endDate });
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);

  const now = moment().add(10, 'minute');
  const defaultStartDate = now.clone().add(1, 'hour');
  const defaultEndDate = defaultStartDate.clone().add(7, 'day');

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          height: 120,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopWidth: 1,
          borderBottomWidth: 1,
        }}
      >
        <TextX>Cover</TextX>
      </View>

      <TextX style={styles.label}>Name</TextX>
      <InputX
        style={styles.input}
        value={form.name}
        onChangeText={val => {
          setForm(prev => ({ ...prev, name: val }));
        }}
        placeholder="My Tournament"
        autoCapitalize="words"
      />

      <TextX style={styles.label}>Description</TextX>
      <InputX
        style={[styles.input, styles.multiLine]}
        value={form.description}
        onChangeText={val => {
          setForm(prev => ({ ...prev, description: val }));
        }}
        placeholder="Write tournament's description, rules, prizes etc."
        autoCapitalize="sentences"
        multiline
        textAlignVertical="top"
      />

      <TextX style={styles.label}>Start date</TextX>
      <TouchableOpacity
        style={[styles.input]}
        onPress={() => {
          if (startDatePickerRef.current) {
            // @ts-ignore 2531
            startDatePickerRef.current.onPressDate();
          }
        }}
      >
        <Text style={[!form.startDate && { color: '#C7C7CD' }]}>
          {!form.startDate
            ? 'Choose start date'
            : moment(form.startDate).format('DD-MM-YYYY, hh:mm a')}
        </Text>

        <DatePicker
          ref={startDatePickerRef}
          date={!!form.startDate ? moment(form.startDate) : defaultStartDate}
          style={{ height: 0, width: 0 }}
          showIcon={false}
          hideText
          mode="datetime"
          minDate={now.toDate()}
          maxDate={maxDate.toDate()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            btnTextConfirm: {
              color: '#000',
            },
          }}
          onDateChange={dateString => {
            const newStart = moment(dateString);
            setForm(prev => ({
              ...prev,
              startDate: newStart.toISOString(),
              endDate:
                !!form.endDate && moment(form.endDate).isBefore(newStart)
                  ? ''
                  : prev.endDate,
            }));
          }}
        />
      </TouchableOpacity>

      <TextX style={styles.label}>End date</TextX>
      <TouchableOpacity
        style={[styles.input]}
        onPress={() => {
          if (endDatePickerRef.current) {
            // @ts-ignore 2531
            endDatePickerRef.current.onPressDate();
          }
        }}
      >
        <Text style={[!form.endDate && { color: '#C7C7CD' }]}>
          {!form.endDate
            ? 'Choose end date'
            : moment(form.endDate).format('DD-MM-YYYY, hh:mm a')}
        </Text>

        <DatePicker
          ref={endDatePickerRef}
          date={!!form.endDate ? moment(form.endDate) : defaultEndDate}
          style={{ height: 0, width: 0 }}
          showIcon={false}
          hideText
          mode="datetime"
          minDate={now.toDate()}
          maxDate={maxDate.toDate()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            btnTextConfirm: {
              color: '#000',
            },
          }}
          onDateChange={dateString => {
            const newEnd = moment(dateString);
            setForm(prev => ({
              ...prev,
              endDate: newEnd.toISOString(),
              startDate:
                !!form.startDate && moment(form.startDate).isAfter(newEnd)
                  ? ''
                  : prev.startDate,
            }));
          }}
        />
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  input: {
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 16,
    width: '100%',
  },
  multiLine: {
    paddingTop: 16,
  },
  label: {
    marginLeft: 16,
    marginBottom: 5,
    marginTop: 26,
  },
});
