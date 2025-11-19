import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";

type Props = {
  job: any;
  onApplyClick: (jobId: string | number) => void;
};

export default function CareerCard({ job, onApplyClick }: Props) {
  const icon = useIcons();

  const handleApplyClick = () => {
    const jobId = job?.id ?? job?._id;
    if (jobId) {
      onApplyClick(jobId);
    }
  };

  return (
    <Card className="!rounded-[46px] px-[22px] pb-[40px] pt-[30px]">
      <div className="flex flex-col items-start gap-[21px] w-full">
        <img
          loading="lazy"
          src={job.image}
          alt=""
          className="w-full aspect-[375/277] rounded-[10px] object-cover"
        />
        <div className="flex flex-col items-start gap-[39px] w-full">
          <div className="flex flex-col items-start gap-[20px] w-full">
            <p className="text-[#C6A45A] text-[21px] font-semibold">{job.title}</p>
            <div className="flex items-center gap-[4px]">
              <img loading="lazy" src={icon.locationBlack} alt="" className="w-[30px]" />
              <p className="text-[#353635] text-[22px] font-medium">{job.location}</p>
            </div>
          </div>

          <Button className="w-full h-[45px] text-[21px]" onClick={handleApplyClick}>
            Apply now
          </Button>
        </div>
      </div>
    </Card>
  );
}
