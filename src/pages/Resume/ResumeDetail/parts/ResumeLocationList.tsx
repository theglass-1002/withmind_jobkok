import React from "react";
import ic_chevron_forward_gray900_20 from "@/assets/icons/size20/ic_chevron_forward_gray900_20.png";

type Item = { city: string; district: string };

export default function ResumeLocationList({ items }: { items: Item[] }) {
  return (
    <>
      {items.map(({ city, district }, i) => (
        <div className="resume-item-chip resume-location" key={`${city}-${district}-${i}`}>
          <span className="resume-location__city">{city}</span>
          <img
            className="resume-location__chevron"
            src={ic_chevron_forward_gray900_20}
            alt=""
          />
          <span className="resume-location__district">{district}</span>
        </div>
      ))}
    </>
  );
}
