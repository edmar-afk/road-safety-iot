import React, { useState } from "react";
import barangays from "../../assets/Barangay";

function MapReport({ onLocationSelect }) {
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  const handleBarangayClick = (name) => {
    setSelectedBarangay((current) => (current === name ? null : name));
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="mb-4 rounded-2xl border border-green-100 bg-green-50/70 p-4">
        <div className="flex flex-col items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
            🗺️
          </div>

          <div>
            <h3 className="text-sm font-semibold text-green-900">
              Having trouble finding the location?
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-green-800">
              You can browse the map below to locate the{" "}
              <span className="font-semibold">
                Barangay and Purok around San Miguel Area
              </span>
              . Select the area that matches the location, then proceed to
              submit your report.
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-7 text-center">
        Browse Barangay Around San Miguel
      </p>
      <div className="grid grid-cols-2 gap-2">
        {barangays.map((barangay) => {
          const isSelected = selectedBarangay === barangay.name;

          return (
            <div key={barangay.name} className="w-full">
              {/* Barangay */}
              <button
                type="button"
                onClick={() => {
                  handleBarangayClick(barangay.name);

                  onLocationSelect({
                    lat: barangay.location.lat,
                    lng: barangay.location.lng,
                    type: "barangay",
                    name: barangay.name,
                  });
                }}
                className={`
                  w-full px-4 py-3 rounded-xl
                  text-sm font-medium
                  border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-green-700 text-white border-green-700 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                {barangay.name}
              </button>

              {/* Puroks directly underneath this barangay */}
              {isSelected && (
                <div
                  className="
                    mt-2
                    h-[150px]
                    overflow-y-auto
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    p-2
                  "
                >
                  <div className="flex flex-col gap-1.5">
                    {barangay.puroks.map((purok) => (
                      <button
                        key={purok.name}
                        type="button"
                        onClick={() => {
                          onLocationSelect({
                            lat: purok.location.lat,
                            lng: purok.location.lng,
                            type: "purok",
                            name: purok.name,
                            barangay: barangay.name,
                          });
                        }}
                        className="w-full  px-3 py-2 rounded-lg bg-white  border border-gray-200 text-left text-sm text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition">
                        {purok.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MapReport;
