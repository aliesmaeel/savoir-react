type Props = {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void; // change here
};

export default function BookingInput({ placeholder, type = "text", value, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      {type === "textAria" ? (
        <div className="px-[11px] py-[13px] border-b-[2px] border-[#262626] w-full">
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={handleChange} // updated usage
            className="w-full bg-transparent border-0 outline-none text-[10px] font-medium placeholder-[#666] h-[30px]"
            required
          ></textarea>
        </div>
      ) : (
        <div className="px-[2px] pt-[21px] pb-[17px] border-b-[2px] border-[#262626] w-full h-[54.6px]">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange} // updated usage
            className="block w-full bg-transparent border-0 outline-none text-[10px] font-medium placeholder-[#666]"
            required
          />
        </div>
      )}
    </>
  );
}
