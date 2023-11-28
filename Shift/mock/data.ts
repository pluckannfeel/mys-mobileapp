import { set, addDays, subDays } from "date-fns";


const today = new Date();
const tomorrow = addDays(today, 1);
const yesterday = subDays(today, 1);

export const data_schedule = [
  {
    id: "1",
    patient: "阿部　京子",
    description: "重度訪問介護 区分6包括支援15％",
    start: set(today, { hours: 9, minutes: 0, seconds: 0 }),
    end: set(today, { hours: 12, minutes: 0, seconds: 0 }),
    color: "orange",
  },
  {
    id: "2",
    patient: "阿部　京子",
    description: "重度訪問介護 区分5",
    start: set(today, { hours: 13, minutes: 0, seconds: 0 }),
    end: set(today, { hours: 18, minutes: 0, seconds: 0 }),
    color: "#22d3ee",
  },
  {
    id: "3",
    patient: "Test Patient",
    description: "Test Item",
    start: set(yesterday, { hours: 0, minutes: 0, seconds: 0 }),
    end: set(yesterday, { hours: 1, minutes: 0, seconds: 0 }),
    color: "red",
  },
  // {
  //   id: "1",
  //   patient: "ミラン　ジャービス",
  //   description: "Caregiving, Main Office",
  //   start: startDate1.valueOf(),
  //   end: endDate1.valueOf(),
  //   color: "primary",
  // },
];
