export type TransportType = "walk" | "bus" | "train" | "car_taxi" | "other";

export const transport_types = [
  {
    label: "shift.shiftReport.form.transport_type.options.walk",
    value: "walk",
  },
  { label: "shift.shiftReport.form.transport_type.options.bus", value: "bus" },
  {
    label: "shift.shiftReport.form.transport_type.options.train",
    value: "train",
  },
  {
    label: "shift.shiftReport.form.transport_type.options.car_taxi",
    value: "car_taxi",
  },
  {
    label: "shift.shiftReport.form.transport_type.options.other",
    value: "others",
  },
];

export const support_hours = [
  { label: "shift.shiftReport.form.support_hours.options.1", value: "0.5" },
  { label: "shift.shiftReport.form.support_hours.options.2", value: "1.0" },
  { label: "shift.shiftReport.form.support_hours.options.3", value: "1.5" },
  { label: "shift.shiftReport.form.support_hours.options.4", value: "2.0" },
  { label: "shift.shiftReport.form.support_hours.options.5", value: "2.5" },
  { label: "shift.shiftReport.form.support_hours.options.6", value: "3.0" },
  { label: "shift.shiftReport.form.support_hours.options.7", value: "3.5" },
  { label: "shift.shiftReport.form.support_hours.options.8", value: "4.0" },
];

// export const destinations = [
//   { label: "shift.shiftReport.form.destinations.options.conbini1", value: "conbini1" },
//   { label: "shift.shiftReport.form.destinations.options.conbini2", value: "conbini2" },
//   { label: "shift.shiftReport.form.destinations.options.conbini3", value: "conbini3" },
//   {
//     label: "shift.shiftReport.form.destinations.options.post_office",
//     value: "post_office",
//   },
//   { label: "shift.shiftReport.form.destinations.options.bank", value: "bank" },
//   { label: "shift.shiftReport.form.destinations.options.lincos", value: "lincos" },
//   { label: "shift.shiftReport.form.destinations.options.summit", value: "summit" },
//   { label: "shift.shiftReport.form.destinations.options.mybus", value: "mybus" },
//   { label: "shift.shiftReport.form.destinations.options.sugi_pharmacy", value: "sugi_pharmacy" },
//   { label: "shift.shiftReport.form.destinations.options.matsukoshi_pharmacy", value: "matsukoshi_pharmacy" },
//   { label: "shift.shiftReport.form.destinations.options.fitcare", value: "fitcare" },
//   { label: "shift.shiftReport.form.destinations.options.worldporters", value: "worldporters" },
//   { label: "shift.shiftReport.form.destinations.options.akarenga", value: "akarenga" },
//   { label: "shift.shiftReport.form.destinations.options.daisanbashi", value: "daisanbashi" },
//   { label: "shift.shiftReport.form.destinations.options.yamashitakouen", value: "yamashitakouen" },
//   { label: "shift.shiftReport.form.destinations.options.rinkoupaku", value: "rinkoupaku" },
//   { label: "shift.shiftReport.form.destinations.options.daisanbashi", value: "daisanbashi" },
// ];

export const meal_frequencies = [
  {
    label: "shift.shiftReport.form.meal_frequencies.options.alltime",
    value: "alltime",
  },
  {
    label: "shift.shiftReport.form.meal_frequencies.options.sometimes",
    value: "sometime",
  },
];

export const bath_types = [
  {
    label: "shift.shiftReport.form.bath_type.options.whole",
    value: "whole_body",
  },
  {
    label: "shift.shiftReport.form.bath_type.options.part",
    value: "some_part",
  },
];

export const leave_types = [
  {
    label: "leaveRequest.form.leave_type.options.paid",
    value: "paid",
  },
  {
    label: "leaveRequest.form.leave_type.options.unpaid",
    value: "unpaid",
  }
]