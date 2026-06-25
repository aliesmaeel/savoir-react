import React from "react";
import Select, { type StylesConfig } from "react-select";

type Option = { label: string; value: string };

interface SelectSearchProps {
  search?: string[];
  onChange?: (values: string[]) => void;
  value?: string[]; // selected values
  placeholder?: string;
  /** `home` = glass hero search; `listing` = search page bar; `compact` = fixed 300px. */
  variant?: "home" | "compact" | "listing";
  hideIndicators?: boolean;
}

const controlHeight = 44;

const getStyles = (variant: SelectSearchProps["variant"]): StylesConfig<Option, true> => {
  const isListing = variant === "listing";

  return {
  control: (base, state) => ({
    ...base,
    minHeight: isListing ? 48 : controlHeight,
    height: isListing ? 48 : controlHeight,
    border: "none",
    boxShadow: isListing
      ? "none"
      : state.isFocused
        ? "0 0 0 2px #fff"
        : "0 0 0 2px #fff",
    backgroundColor: isListing ? "#ffffff" : "transparent",
    borderRadius: isListing ? 0 : 10,
    paddingLeft: isListing ? 0 : 10,
    cursor: "pointer",
    overflowY: "auto",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: isListing ? "0 10px" : "0 8px",
    gap: 6,
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: isListing ? "#111111" : "#ffffff",
    fontWeight: isListing ? 700 : undefined,
  }),
  placeholder: (base) => ({
    ...base,
    color: isListing ? "#111111" : "#fff",
    fontWeight: isListing ? 700 : 500,
    fontSize: isListing ? 16 : undefined,
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base, state) => ({
    ...base,
    paddingRight: 10,
    color: isListing ? "#111111" : state.isFocused ? "#9E9E9E" : "#BDBDBD",
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingRight: 6,
    color: isListing ? "#111111" : "#BDBDBD",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: isListing ? "#F1EEE7" : "#F4F4F6",
    borderRadius: 8,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#111111",
    fontWeight: 700,
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
};

const HiddenIndicator = () => null;

export default function SelectSearch({
  search = [],
  onChange,
  value = [],
  placeholder = "Search here..",
  variant = "compact",
  hideIndicators = false,
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

  const wrapperClassName =
    variant === "home" || variant === "listing"
      ? "w-full min-w-0 shrink-0"
      : "w-[300px] max-w-full shrink-0";

  return (
    <div className={wrapperClassName}>
      <Select
        classNamePrefix="community"
        styles={getStyles(variant)}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isMulti
        components={
          hideIndicators
            ? {
                DropdownIndicator: HiddenIndicator,
                IndicatorSeparator: HiddenIndicator,
                ClearIndicator: HiddenIndicator,
              }
            : { IndicatorSeparator: HiddenIndicator }
        }
        menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
      />
    </div>
  );
}
