import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ViewProps,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { useGlobal } from 'reactn';
import * as Animatable from 'react-native-animatable';

import { TextX } from '../components';
import { colors } from '../config/styles';
import { ButtonX } from './ButtonX';
import { ITournamentForGame, IUser } from '../fragments';
import { IGlobalState } from '../global';
import { Avatar } from './Avatar';
import { separateName, listKeyExtractor } from '../utils';
import { TextInput } from 'react-native-gesture-handler';

const defaultStartDate = moment()
  .subtract(1, 'day')
  .unix();

const isFormValid = (form: any, { teamSize }: { teamSize: number }) => {
  if (
    form.team1.length !== teamSize ||
    form.team2.length !== teamSize ||
    !!form.team1.find((v: any) => !v) ||
    !!form.team2.find((v: any) => !v) ||
    Number(form.score1) === Number(form.score2)
  ) {
    return false;
  }

  return true;
};

export interface CreateGameViewProps extends ViewProps {
  tournament: ITournamentForGame;
  onSavePress: (form: any) => void;
  saveBtnDisabled?: boolean;
}
export const CreateGameView: FunctionComponent<CreateGameViewProps> = ({
  tournament: { startDate = defaultStartDate, teamSize = 1, standings = [] },
  onSavePress,
  saveBtnDisabled,
}) => {
  const now = moment();

  const [currentUser] = useGlobal<IGlobalState>('currentUser');
  const [form, setForm] = useState({
    time: now.toJSON(),
    team1: [currentUser.id],
    team2: [],
    score1: '0',
    score2: '0',
  });
  const [activeChoose, setActiveChoose] = useState<{
    team: 'team1' | 'team2';
    index: number;
  }>();
  const gameTimePickerRef = useRef<any>(null);
  const score1InputRef = useRef<any>(null);
  const score2InputRef = useRef<any>(null);
  const [, setPleaseUpdate] = useState(false);

  useEffect(() => {
    setForm(prev => ({ ...prev, teamSize }));
  }, [teamSize]);

  useEffect(() => {
    const firstTeamIndex = firstTeam.findIndex(v => !v);
    if (firstTeamIndex > -1) {
      setActiveChoose({
        team: 'team1',
        index: firstTeamIndex,
      });
    } else {
      const secondTeamIndex = secondTeam.findIndex(v => !v);
      if (secondTeamIndex > -1) {
        setActiveChoose({
          team: 'team2',
          index: secondTeamIndex,
        });
      } else {
        setActiveChoose(undefined);
      }
    }
  }, [form.team1, form.team2]);

  const firstTeam = [...new Array(teamSize)].map((v, index) => {
    const foundStanding = standings.find(standing => {
      if (standing.user && form.team1[index]) {
        return standing.user.id === form.team1[index];
      }
      return false;
    });

    return foundStanding ? foundStanding.user : undefined;
  });

  const secondTeam = [...new Array(teamSize)].map((v, index) => {
    const foundStanding = standings.find(standing => {
      if (standing.user && form.team2[index]) {
        return standing.user.id === form.team2[index];
      }
      return false;
    });

    return foundStanding ? foundStanding.user : undefined;
  });

  let userListData: IUser[] = [];
  if (activeChoose) {
    const allSelected = [...form.team1, ...form.team2];
    userListData = standings
      .filter(standing => {
        return !allSelected.find(v => v === standing.user.id);
      })
      .map(vv => vv.user);
  }

  const buttonDisabled =
    saveBtnDisabled || !isFormValid(form, { teamSize: teamSize });
  const avatarSize =
    (Dimensions.get('window').width - 50) / (teamSize * (teamSize > 1 ? 3 : 4));
  const scoreInputSize = (60 * (Dimensions.get('window').width - 32)) / 100 / 2;

  const handleScoreChange = (name: 'score1' | 'score2') => (text: string) => {
    let scoreToSet = 0;
    let newScore = Number(text);

    if (newScore && newScore < 100) {
      scoreToSet = newScore;
    }

    setForm(prev => ({ ...prev, [name]: String(scoreToSet) }));
    if (name === 'score1') {
      score2InputRef.current && score2InputRef.current.focus();
    } else {
      score2InputRef.current && score2InputRef.current.blur();
    }
  };

  const renderPlayerItem = (teamName: 'team1' | 'team2') => (
    // @ts-ignore 2739
    user: IUser = {},
    i: number
  ) => {
    return (
      <TouchableOpacity
        style={{ marginHorizontal: 4 }}
        onPress={
          user.id !== currentUser.id
            ? () => {
                setActiveChoose({ team: teamName, index: i });
              }
            : undefined
        }
        key={user.id || 'user' + i}
      >
        <Animatable.View
          style={{ alignItems: 'center', justifyContent: 'center' }}
          animation={
            activeChoose &&
            activeChoose.team === teamName &&
            activeChoose.index === i
              ? 'pulse'
              : undefined
          }
          iterationCount="infinite"
        >
          <Avatar
            style={{ marginBottom: 6 }}
            size={avatarSize}
            avatar={user.avatar}
          />
          <TextX
            style={[
              { textAlign: 'center' },
              !user.name && { color: colors.helper },
            ]}
            shadowed={!!user.name}
          >
            {user.name ? separateName(user.name).firstName : 'choose'}
          </TextX>
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}
    >
      <View style={styles.container}>
        <TextX style={styles.label}>Game time</TextX>
        <TouchableOpacity
          style={[styles.input]}
          onPress={() => {
            if (gameTimePickerRef.current) {
              // @ts-ignore 2531
              gameTimePickerRef.current.onPressDate();
            }
          }}
        >
          <Text>{moment(form.time).format('DD-MM-YYYY, hh:mm a')}</Text>

          <DatePicker
            ref={gameTimePickerRef}
            date={moment(form.time)}
            style={{ height: 0, width: 0 }}
            showIcon={false}
            hideText
            mode="datetime"
            minDate={moment(Number(startDate)).toJSON()}
            maxDate={now
              .clone()
              .add(1, 'minute')
              .toJSON()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              btnTextConfirm: {
                color: '#000',
              },
            }}
            onDateChange={dateString => {
              setForm(prev => ({ ...prev, time: dateString }));
            }}
          />
        </TouchableOpacity>

        <TextX style={[styles.label, { marginBottom: 14 }]}>Players</TextX>
        <View style={styles.playersRow}>
          <View style={{ flexDirection: 'row' }}>
            {firstTeam.map(renderPlayerItem('team1'))}
          </View>
          <TextX>vs.</TextX>
          <View style={{ flexDirection: 'row' }}>
            {secondTeam.map(renderPlayerItem('team2'))}
          </View>
        </View>

        {!!activeChoose && (
          <View>
            <FlatList
              contentContainerStyle={{ paddingTop: 26 }}
              keyExtractor={listKeyExtractor}
              data={userListData}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setForm(prev => {
                      const newList = (activeChoose.team === 'team1'
                        ? firstTeam
                        : secondTeam
                      ).map(v => (v ? v.id : undefined));
                      newList[activeChoose.index] = item.id;

                      return {
                        ...prev,
                        [activeChoose.team]: newList,
                      };
                    });
                  }}
                >
                  <View
                    style={[
                      styles.userListItem,
                      index === 0 && { borderTopWidth: 1 },
                    ]}
                  >
                    <Avatar style={{ marginRight: 5 }} avatar={item.avatar} />
                    <TextX>{item.name}</TextX>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TextX style={[styles.label, { marginBottom: 14 }]}>Score</TextX>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View>
            <TextInput
              ref={score1InputRef}
              style={[
                styles.scoreInput,
                {
                  width: scoreInputSize,
                  height: scoreInputSize + 10,
                  fontSize: scoreInputSize / 2.2,
                },
                score1InputRef.current &&
                  score1InputRef.current.isFocused() && {
                    borderColor: colors.secondary,
                  },
              ]}
              keyboardType="numeric"
              autoCorrect={false}
              selectionColor="#000"
              value={form.score1}
              onChangeText={handleScoreChange('score1')}
              onFocus={() => {
                setPleaseUpdate(prev => !prev);
              }}
              onBlur={() => {
                setPleaseUpdate(prev => !prev);
              }}
            />
          </View>
          <TextX style={{ fontSize: 40 }}>:</TextX>
          <View>
            <TextInput
              ref={score2InputRef}
              style={[
                styles.scoreInput,
                {
                  width: scoreInputSize,
                  height: scoreInputSize + 10,
                  fontSize: scoreInputSize / 2.2,
                },
                score2InputRef.current &&
                  score2InputRef.current.isFocused() && {
                    borderColor: colors.secondary,
                  },
              ]}
              keyboardType="numeric"
              autoCorrect={false}
              selectionColor="#000"
              value={form.score2}
              onChangeText={handleScoreChange('score2')}
              onFocus={() => {
                setPleaseUpdate(prev => !prev);
              }}
              onBlur={() => {
                setPleaseUpdate(prev => !prev);
              }}
            />
          </View>
        </View>

        <ButtonX
          style={{ alignSelf: 'center', marginTop: 40 }}
          title="SAVE"
          disabled={buttonDisabled}
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
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  scoreInput: {
    borderWidth: 3,
    marginHorizontal: 10,
    borderRadius: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
