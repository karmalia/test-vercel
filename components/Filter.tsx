"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent } from "react";

type Props = {
  locations: string[];
  searchParams: { status: string; location: string };
};

const Filter = ({ locations, searchParams }: Props) => {
  const router = useRouter();
  const { status, location } = searchParams;

  // Handles status change
  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    const queryParams = new URLSearchParams(window.location.search);

    if (selectedStatus === "All") {
      queryParams.delete("status");
    } else {
      queryParams.set("status", selectedStatus);
    }

    if (location) {
      queryParams.set("location", location);
    }

    router.replace(`/?${queryParams.toString()}`);
  };

  // Handles location change
  const handleLocation = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = e.target.value;
    const queryParams = new URLSearchParams(window.location.search);

    queryParams.set("location", selectedLocation);

    if (status && status !== "All") {
      queryParams.set("status", status);
    }

    router.replace(`/?${queryParams.toString()}`);
  };

  return (
    <div>
      <form className="flex gap-12  ">
        <div className="flex gap-2 items-center">
          <label className="text-white" htmlFor="location">
            Location
          </label>
          <select
            name="location"
            id="location"
            value={location}
            onChange={handleLocation}
            className="p-2 bg-gray-800 text-white"
          >
            {locations.map((loc: string, i: number) => (
              <option key={loc + i} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-white" htmlFor="status">
            Status
          </label>
          <select
            name="status"
            id="status"
            value={status || "All"}
            onChange={handleStatus}
            className="p-2 bg-gray-800 text-white"
          >
            <option value="All">All</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default Filter;
