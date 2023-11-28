import { createContext, useContext, useMemo, useState } from "react";
import { ShiftReport, ShiftSchedule } from "../types/Shift";

interface SelectedShiftContextInterface {
  selectedShift: ShiftSchedule;
  setSelectedShift: (shift: ShiftSchedule) => void;
}

export const SelectedShiftContext =
  createContext<SelectedShiftContextInterface>(
    {} as SelectedShiftContextInterface
  );

type SelectedShiftProviderProps = {
  children: React.ReactNode;
};

const SelectedShiftProvider = ({ children }: SelectedShiftProviderProps) => {
  const [selectedShift, setSelectedShift] = useState<ShiftSchedule>(
    {} as ShiftSchedule
  );

  // create a new object with ShiftReport take only the fields we need
  // staff, patient, start and end concatenated into a single string called service_hours

  const value = useMemo(
    () => ({
      selectedShift,
      setSelectedShift,
    }),
    [selectedShift]
  );

  return (
    <SelectedShiftContext.Provider value={value}>
      {children}
    </SelectedShiftContext.Provider>
  );
};

export const useSelectedShift = () => useContext(SelectedShiftContext);

export default SelectedShiftProvider;
