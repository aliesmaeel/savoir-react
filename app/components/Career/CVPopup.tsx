import React, { useState } from "react";
import BookingInput from "../Project/BookYourViewing/BookingInput";
import Button from "~/UI/Button";

export default function CVPopup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or Word document.");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!name || !email || !file) {
      setError("Please fill in all fields and upload your CV.");
      return;
    }

    setError("");
    console.log("Submitting:", { name, email, file });

    // TODO: Handle form submission (e.g., upload to backend)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-[25px] w-full px-[45px] pb-[82px]"
    >
      <BookingInput placeholder="Enter Full Name" value={name} onChange={setName} />

      <BookingInput placeholder="Enter your Email" value={email} onChange={setEmail} />

      {/* Upload CV Section */}
      <div className="w-full">
        <label htmlFor="cv-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Your CV
        </label>
        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-[#d2b48c] file:to-[#b18b55] file:text-white hover:file:opacity-90"
        />
        {file && (
          <p className="text-sm text-gray-700 mt-2">
            Selected file: <span className="font-medium">{file.name}</span>
          </p>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <Button className="!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px] w-full">
        Submit Your CV
      </Button>
    </form>
  );
}
