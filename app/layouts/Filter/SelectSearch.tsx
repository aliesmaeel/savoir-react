import React from "react";
import Select, { components, type StylesConfig } from "react-select";

type Option = { label: string; value: string };

interface SelectSearchProps {
  search?: string[];
  onChange?: (values: string[]) => void;
  value?: string[]; // selected values
  placeholder?: string;
}

const controlHeight = 44;

const styles: StylesConfig<Option, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: controlHeight,
    height: controlHeight,
    border: "none",
    boxShadow: state.isFocused ? "0 0 0 2px #fff" : "0 0 0 2px #fff",
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingLeft: 10,
    cursor: "pointer",
    overflowY: "auto",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
    gap: 6,
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#fff",
    fontWeight: 500,
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base, state) => ({
    ...base,
    paddingRight: 10,
    color: state.isFocused ? "#9E9E9E" : "#BDBDBD",
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingRight: 6,
    color: "#BDBDBD",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#F4F4F6",
    borderRadius: 8,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#2F2F2F",
    fontWeight: 500,
  }),
  multiValueRemove: (base) => ({
    ...base,
    ":hover": { backgroundColor: "transparent", color: "#000" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    marginTop: 6,
  }),
  option: (base, state) => ({
    ...base,
    padding: "10px 12px",
    backgroundColor: state.isFocused ? "#3d3d3d" : "#4A4A4A",
    color: "#fff",
    cursor: "pointer",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 50 }),
};

export default function SelectSearch({
  search = [],
  onChange,
  value = [],
  placeholder = "Search here..",
}: SelectSearchProps) {
  //search is key value pairs
  const options: Option[] = Object.entries(search).map(([key, label]) => ({
    label : label,  // display name
    value: key, // actual key (link)
  }));
  const selectedOptions = options.filter((o) => value.includes(o.value));

  const handleChange = (items: readonly Option[] | null) => {
    const vals = items ? items.map((o) => o.value) : [];
    onChange?.(vals);
  };

  return (
    <div className="w-full max-w-[300px] shrink-0">
      <Select
        classNamePrefix="community"
        styles={styles}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isMulti
        menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
      />
    </div>
  );
}
