"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  APIProvider,
  AdvancedMarker,
  Map,
} from "@vis.gl/react-google-maps";

import { env } from "~/env";
import type { ReportMapPoint } from "~/types/report-map";

type ReportMapProps = {
  points: ReportMapPoint[];
  selectedPoint: ReportMapPoint | null;
  onSelect: (point: ReportMapPoint | null) => void;
};

const DEFAULT_CENTER = { lat: 45.9432, lng: 24.9668 };

export function ReportMap({
  points,
  selectedPoint,
  onSelect,
}: ReportMapProps) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

  const initialCenter = useMemo(() => {
    if (selectedPoint) {
      return { lat: selectedPoint.latitude, lng: selectedPoint.longitude };
    }

    if (points.length > 0) {
      return { lat: points[0]!.latitude, lng: points[0]!.longitude };
    }

    return DEFAULT_CENTER;
  }, [points, selectedPoint]);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative h-[600px] w-full rounded-xl border border-neutral-200 bg-white shadow-lg">
        <Map
          defaultCenter={initialCenter}
          defaultZoom={6}
          mapId={mapId}
          fullscreenControl={false}
          streetViewControl={false}
        >
          {points.map((point) => (
            <AdvancedMarker
              key={point.id}
              position={{ lat: point.latitude, lng: point.longitude }}
              onClick={() =>
                onSelect(selectedPoint?.id === point.id ? null : point)
              }
            >
              <div
                className={`h-4 w-4 rounded-full border-2 border-white shadow-md ${
                  point.isExternal ? "bg-orange-500" : "bg-blue-600"
                }`}
              />
            </AdvancedMarker>
          ))}
        </Map>

        {selectedPoint && (
          <aside className="absolute inset-x-4 bottom-4 z-10 max-h-[80%] overflow-y-auto rounded-lg bg-white p-4 shadow-2xl md:inset-x-auto md:right-6 md:w-96">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                  {selectedPoint.isExternal
                    ? "Incident extern"
                    : selectedPoint.type === "INCIDENT"
                      ? "Incident"
                      : "Raport"}
                </p>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {selectedPoint.provider ?? "AnimAlert"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Închide detaliile"
                onClick={() => onSelect(null)}
                className="rounded-full border border-neutral-200 p-1 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700"
              >
                ×
              </button>
            </div>

            <dl className="mt-4 space-y-3 text-sm text-neutral-700">
              <div>
                <dt className="font-semibold text-neutral-900">GPS Location</dt>
                <dd>{selectedPoint.gpsLocation}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">Validation Status</dt>
                <dd>{selectedPoint.validationStatus}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">Type</dt>
                <dd>{selectedPoint.type === "INCIDENT" ? "Incident" : "Raport"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">Species</dt>
                <dd>{selectedPoint.species ?? "Necunoscut"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">Descriere</dt>
                <dd>{selectedPoint.description ?? "Nu există o descriere disponibilă."}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-900">Imagini</h4>
              {selectedPoint.images.length === 0 ? (
                <p className="text-sm text-neutral-500">Nu sunt disponibile imagini.</p>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedPoint.images.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt="Imagine asociată raportului"
                      width={160}
                      height={120}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </APIProvider>
  );
}
