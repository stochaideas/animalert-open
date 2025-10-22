"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  APIProvider,
  AdvancedMarker,
  Map,
} from "@vis.gl/react-google-maps";

import { env } from "~/env";
import type { ExtendedReportMapPoint } from "~/types/report-map";

type ReportMapProps = {
  points: ExtendedReportMapPoint[];
  selectedPoint: ExtendedReportMapPoint | null;
  onSelect: (point: ExtendedReportMapPoint | null) => void;
};

const DEFAULT_CENTER = { lat: 45.9432, lng: 24.9668 };

const MARKER_FILL: Record<ExtendedReportMapPoint["source"], string> = {
  "anim-alert": "bg-blue-600",
  external: "bg-orange-500",
  "ro-bear": "bg-purple-600",
};

const LEGEND_LABEL: Record<ExtendedReportMapPoint["source"], string> = {
  "anim-alert": "AnimAlert (rapoarte validate)",
  external: "Parteneri externi",
  "ro-bear": "RO-bear (semnalari publice)",
};

export function ReportMap({ points, selectedPoint, onSelect }: ReportMapProps) {
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

  const robearPoints = useMemo(
    () => points.filter((point) => point.source === "ro-bear"),
    [points],
  );

  const conflictTypologies = useMemo(() => {
    const labels = new Set<string>();
    robearPoints.forEach((point) => {
      if (point.conflictTypology) {
        labels.add(point.conflictTypology);
      }
    });
    return Array.from(labels);
  }, [robearPoints]);

  const robearValidation = useMemo(() => {
    const first = robearPoints.find((point) => point.validationLayer);
    return first?.validationLayer ?? "Validare RO-bear";
  }, [robearPoints]);

  const robearAccuracy = useMemo(() => {
    const pointWithAccuracy = robearPoints.find((point) => point.accuracy);
    return pointWithAccuracy?.accuracy ?? "Precizie aproximativa (+/- 250 m)";
  }, [robearPoints]);

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
          {points.map((point) => {
            const isSelected = selectedPoint?.id === point.id;
            const baseShape =
              point.source === "ro-bear"
                ? "h-4 w-4 rounded-none"
                : "h-4 w-4 rounded-full";
            const markerClasses = [
              baseShape,
              "border-2 border-white shadow-md transition-transform duration-150",
              MARKER_FILL[point.source],
              isSelected ? "scale-125" : "scale-100",
            ].join(" ");

            return (
              <AdvancedMarker
                key={point.id}
                position={{ lat: point.latitude, lng: point.longitude }}
                onClick={() => onSelect(isSelected ? null : point)}
              >
                <div className={markerClasses} />
              </AdvancedMarker>
            );
          })}
        </Map>

        <div className="pointer-events-none absolute left-4 top-4 z-10 w-72 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-lg">
          <h3 className="text-sm font-semibold text-neutral-900">
            Legenda harta
          </h3>
          <ul className="mt-3 space-y-2">
            {(Object.keys(LEGEND_LABEL) as Array<
              keyof typeof LEGEND_LABEL
            >).map((key) => (
              <li
                key={key}
                className="flex items-center gap-3 text-sm text-neutral-700"
              >
                <span
                  className={
                    key === "ro-bear"
                      ? `inline-block h-3.5 w-3.5 rounded-none border-2 border-white ${MARKER_FILL[key]} shadow`
                      : `inline-block h-3.5 w-3.5 rounded-full border-2 border-white ${MARKER_FILL[key]} shadow`
                  }
                />
                <span>{LEGEND_LABEL[key]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-2 border-t border-neutral-200 pt-3 text-xs text-neutral-600">
            <div>
              <p className="font-medium text-neutral-800">
                Tipologie conflicte
              </p>
              <p>
                {conflictTypologies.length > 0
                  ? conflictTypologies.join(", ")
                  : "Date indisponibile"}
              </p>
            </div>
            <div>
              <p className="font-medium text-neutral-800">
                Strat de validare
              </p>
              <p>{robearValidation}</p>
            </div>
            <div>
              <p className="font-medium text-neutral-800">Acuratete</p>
              <p>{robearAccuracy}</p>
            </div>
          </div>
        </div>

        {selectedPoint && (
          <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-10 max-h-[80%] overflow-y-auto rounded-lg bg-white p-4 shadow-2xl md:inset-x-auto md:right-6 md:w-96">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                  {selectedPoint.source === "ro-bear"
                    ? "Semnalare RO-bear"
                    : selectedPoint.isExternal
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
                aria-label="Inchide detaliile"
                onClick={() => onSelect(null)}
                className="rounded-full border border-neutral-200 p-1 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700"
              >
                x
              </button>
            </div>

            <dl className="mt-4 space-y-3 text-sm text-neutral-700">
              <div>
                <dt className="font-semibold text-neutral-900">
                  GPS Location
                </dt>
                <dd>{selectedPoint.gpsLocation}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">
                  Validation Status
                </dt>
                <dd>{selectedPoint.validationStatus}</dd>
              </div>
              {selectedPoint.validationLayer && (
                <div>
                  <dt className="font-semibold text-neutral-900">
                    Strat de validare
                  </dt>
                  <dd>{selectedPoint.validationLayer}</dd>
                </div>
              )}
              {selectedPoint.accuracy && (
                <div>
                  <dt className="font-semibold text-neutral-900">
                    Acuratete
                  </dt>
                  <dd>{selectedPoint.accuracy}</dd>
                </div>
              )}
              <div>
                <dt className="font-semibold text-neutral-900">Type</dt>
                <dd>
                  {selectedPoint.type === "INCIDENT" ? "Incident" : "Raport"}
                </dd>
              </div>
              {selectedPoint.conflictTypology && (
                <div>
                  <dt className="font-semibold text-neutral-900">
                    Tipologie conflict
                  </dt>
                  <dd>{selectedPoint.conflictTypology}</dd>
                </div>
              )}
              <div>
                <dt className="font-semibold text-neutral-900">Species</dt>
                <dd>{selectedPoint.species ?? "Necunoscut"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">Descriere</dt>
                <dd>
                  {selectedPoint.description ??
                    "Nu exista o descriere disponibila."}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-900">
                Imagini
              </h4>
              {selectedPoint.images.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Nu sunt disponibile imagini.
                </p>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedPoint.images.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt="Imagine asociata raportului"
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
