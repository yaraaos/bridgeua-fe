export type LocationOption = {
  label: string;
  value: string;
  type?: "manual" | "nearby";
};

export const DEFAULT_LOCATION_OPTIONS: LocationOption[] = [
  {
    label: "See nearby",
    value: "nearby",
    type: "nearby",
  },
  {
    label: "California, USA",
    value: "california-usa",
    type: "manual",
  },
  {
    label: "Los Angeles, USA",
    value: "los-angeles-usa",
    type: "manual",
  },
  {
    label: "San Diego, USA",
    value: "san-diego-usa",
    type: "manual",
  },
  {
    label: "New York, USA",
    value: "new-york-usa",
    type: "manual",
  },
];