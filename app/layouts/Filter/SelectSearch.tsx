import React from "react";
import Select from "react-select";

interface SelectSearchProps {
  search?: any[];
  onChange?: (values: string[]) => void;
  value?: string[]; // selected values
}

export default function SelectSearch({ search = [], onChange, value = [] }: SelectSearchProps) {
  const options = search.map((item: any) => ({
    label: item,
    value: item,
  }));

  // Convert value array to react-select format
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleChange = (selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
    if (onChange) onChange(values);
  };

  return (
    <div className="w-full">
      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select Community or Sub-community"
        isClearable
        isMulti
      />
    </div>
  );
}
