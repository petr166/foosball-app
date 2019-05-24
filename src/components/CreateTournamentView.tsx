import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
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

import { TextX, InputX, OptionsX } from '../components';
import { colors } from '../config/styles';
import { ButtonX } from './ButtonX';
import { IUser } from '../fragments';

const maxDate = moment().add(5, 'year');

const privacyOptions = [
  {
    name: 'public',
    value: 'public',
    helper: 'Everyone can join the tournament',
  },
  {
    name: 'private',
    value: 'private',
    helper: 'Users will need an invitation to participate',
  },
];

const teamSizeOptions = [{ name: '1v1', value: 1 }, { name: '2v2', value: 2 }];

const maxPlayersOptions = [
  { name: '10', value: 10 },
  { name: '20', value: 20 },
  { name: '50', value: 50 },
  { name: '100', value: 100 },
];

const defaultMinGames = 10;

const requiredFields = ['name', 'description', 'startDate', 'endDate'];
const isFormValid = (form: any) => {
  return !requiredFields.find(reqField => !form[reqField]);
};

export interface CreateTournamentViewProps extends ViewProps {
  tournament: any;
  onSavePress: (form: any) => void;
  onInviteParticipantsPress: (
    inviteList: string[],
    onListUpdate: (updatedList: string[]) => void
  ) => void;
}
export const CreateTournamentView: FunctionComponent<
  CreateTournamentViewProps
> = ({
  tournament: {
    name = '',
    description = '',
    startDate = '',
    endDate = '',
    privacy = 'public',
    teamSize = 1,
    maxPlayers = 20,
    minGames = defaultMinGames,
    inviteList = [],
  },
  onSavePress,
  onInviteParticipantsPress,
}) => {
  const [form, setForm] = useState({
    name,
    description,
    startDate,
    endDate,
    privacy,
    teamSize,
    maxPlayers,
    minGames,
    inviteList,
  });
  const [saveDisabled, setSaveDisabled] = useState(true);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);

  useEffect(() => {
    const formValid = isFormValid(form);

    if (formValid && saveDisabled) {
      setSaveDisabled(false);
    } else if (!formValid && !saveDisabled) {
      setSaveDisabled(true);
    }
  }, [form]);

  const now = moment().add(10, 'minute');
  const defaultStartDate = now.clone().add(1, 'hour');
  const defaultEndDate = defaultStartDate.clone().add(7, 'day');

  const selectedPrivacy = privacyOptions.find(v => v.value === form.privacy);
  const helper = selectedPrivacy
    ? selectedPrivacy.helper
    : 'Select tournament privacy';

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}
    >
      <View style={styles.container}>
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
          <Text style={[!form.startDate && { color: colors.helper }]}>
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
          <Text style={[!form.endDate && { color: colors.helper }]}>
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

        <TextX style={styles.label}>Privacy</TextX>
        <OptionsX
          options={privacyOptions}
          selectedValue={form.privacy}
          onSelect={val => {
            setForm(prev => ({ ...prev, privacy: val }));
          }}
        />
        <TextX style={styles.helper} shadowed={false}>
          {helper}
        </TextX>

        <TextX style={styles.label}>Team size</TextX>
        <OptionsX
          options={teamSizeOptions}
          selectedValue={form.teamSize}
          onSelect={val => {
            setForm(prev => ({ ...prev, teamSize: val }));
          }}
          textProps={{ style: { textTransform: 'none' } }}
        />

        <TextX style={styles.label}>Max number of players</TextX>
        <OptionsX
          options={maxPlayersOptions}
          selectedValue={form.maxPlayers}
          onSelect={val => {
            setForm(prev => ({ ...prev, maxPlayers: val }));
          }}
        />

        <TextX style={styles.label}>Min number of games</TextX>
        <InputX
          style={[styles.input, { borderBottomWidth: 0 }]}
          value={String(form.minGames)}
          onChangeText={val => {
            const numVal = Number(val);

            setForm(prev => ({
              ...prev,
              minGames:
                !!numVal && numVal > 0 && numVal < 500
                  ? numVal
                  : defaultMinGames,
            }));
          }}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.input, styles.inviteParticipantsBtn]}
          onPress={() => {
            onInviteParticipantsPress(form.inviteList, newInviteList => {
              setForm(prevForm => {
                return {
                  ...prevForm,
                  inviteList: newInviteList,
                };
              });
            });
          }}
        >
          <TextX style={{ fontSize: 16 }}>Invite participants</TextX>
          {!!form.inviteList.length && <TextX>{form.inviteList.length}</TextX>}
        </TouchableOpacity>

        <ButtonX
          style={{ alignSelf: 'center' }}
          title="SAVE"
          disabled={saveDisabled}
          onPress={() => {
            onSavePress(form);
          }}
        />

        <View style={{ height: 60 }} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  helper: {
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 5,
    color: colors.helper,
  },
  inviteParticipantsBtn: {
    minHeight: 54,
    justifyContent: 'space-between',
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
