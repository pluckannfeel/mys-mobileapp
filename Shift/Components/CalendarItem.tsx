import isEmpty from "lodash/isEmpty";
import React, { useRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import testIDs from "../mock/testIDs";
import { ShiftAgendaItem } from "../types/Calendar";
import { useTheme } from "../../core/contexts/ThemeProvider";
import BottomSheet from "@gorhom/bottom-sheet";
import { ShiftReport } from "../types/Shift";
import { useTranslation } from "react-i18next";

interface CalendarItemProps {
  item: ShiftAgendaItem;
  showRecords: () => void;
}

const CalendarItem: React.FC<CalendarItemProps> = ({ item, showRecords }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>
          {currentLanguage === "en"
            ? "No Events Planned Today"
            : "本日はシフトの予定はありません"}
        </Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={itemPressed}
        style={styles.item}
        testID={testIDs.agenda.ITEM}
      >
        <View>
          <Text
            style={styles.itemHourText}
          >{`${item.start} - ${item.end}`}</Text>
          <Text style={styles.itemDurationText}>{item.summary}</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.title}</Text>
        <View style={styles.itemButtonContainer}>
          <Button
            color={theme.colors.pink500}
            title={t("shift.calendarScreen.actions.edit")}
            onPress={showRecords}
          />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default React.memo(CalendarItem);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemHourText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDurationText: {
    color: "grey",
    fontSize: 16,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    alignSelf: "center",
    color: "black",
    marginLeft: 16,

    fontSize: 22,
  },
  itemButton: {
    fontSize: 24,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
  },
});
