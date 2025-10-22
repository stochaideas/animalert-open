"use client";

import { useMemo, useState } from "react";

import publicData from "./public-data.json";
import { ReportMap } from "~/components/ui/complex/report-map";
import { REPORT_TYPES } from "~/constants/report-types";
import type { ExtendedReportMapPoint } from "~/types/report-map";
import { api } from "~/trpc/react";

const CONFLICT_TYPOLOGY_LABELS: Record<string, string> = {
  alert: "Semnalare RO-Alert",
  bear: "Intalniri cu ursi",
  danger: "Alte pericole raportate",
  dog: "Prezenta caini agresivi",
  lynx: "Observatii de ras",
  snake: "Semnalari de serpi",
  wolf: "Intalniri cu lupi",
};

const SPECIES_LABELS: Record<string, string> = {
  alert: "RO-Alert",
  bear: "Urs",
  danger: "Pericol",
  dog: "Caine",
  lynx: "Ras",
  snake: "Sarpe",
  wolf: "Lup",
};

const RO_BEAR_PROVIDER = "RO-bear";
const RO_BEAR_ACCURACY = "Precizie aproximativa (+/- 250 m)";
const RO_BEAR_VALIDATION = "RO-bear - filtrare comunitara si AnimAlert";

const RO_BEAR_POINTS: ExtendedReportMapPoint[] = (
  Array.isArray(publicData.mappedData) ? publicData.mappedData : []
).map((entry) => {
  const normalizedType = entry.type?.toLowerCase() ?? "";
  const conflictTypology =
    CONFLICT_TYPOLOGY_LABELS[normalizedType] ?? entry.type ?? "Necunoscut";
  const speciesLabel =
    SPECIES_LABELS[normalizedType] ?? entry.type ?? null;

  return {
    id: `robear-${entry.id}`,
    latitude: entry.latitude,
    longitude: entry.longitude,
    gpsLocation: `${entry.latitude.toFixed(5)}, ${entry.longitude.toFixed(5)}`,
    validationStatus: "Validare automata RO-bear",
    type: "INCIDENT",
    description: entry.description ?? null,
    images: [],
    species: speciesLabel,
    isExternal: true,
    provider: RO_BEAR_PROVIDER,
    reportType: REPORT_TYPES.CONFLICT,
    createdAt: entry.posted ?? entry.date ?? null,
    source: "ro-bear",
    conflictTypology,
    validationLayer: RO_BEAR_VALIDATION,
    accuracy: RO_BEAR_ACCURACY,
  } satisfies ExtendedReportMapPoint;
});

export default function HartaPage() {
  const { data, isLoading, isError, error } = api.report.getMapData.useQuery();
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const reportPoints = useMemo<ExtendedReportMapPoint[]>(() => {
    if (!data) {
      return [];
    }

    return data.map((point) => {
      const source = point.isExternal ? "external" : "anim-alert";
      const conflictTypology =
        point.reportType === REPORT_TYPES.CONFLICT
          ? source === "anim-alert"
            ? "Conflict raportat prin AnimAlert"
            : "Conflict raportat de partener extern"
          : null;

      return {
        ...point,
        source,
        conflictTypology,
        validationLayer:
          source === "anim-alert"
            ? "AnimAlert - moderare interna"
            : `Partener extern (${point.provider ?? "necunoscut"})`,
        accuracy:
          source === "anim-alert"
            ? "Coordonate raportate de utilizator"
            : "Coordonate furnizate de partener",
      } satisfies ExtendedReportMapPoint;
    });
  }, [data]);

  const combinedPoints = useMemo(() => {
    const merged = [...reportPoints, ...RO_BEAR_POINTS];
    return merged.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [reportPoints]);

  const selectedPoint = useMemo(
    () =>
      combinedPoints.find((point) => point.id === selectedPointId) ?? null,
    [combinedPoints, selectedPointId],
  );

  const hasAnyPoints = combinedPoints.length > 0;

  return (
    <main className="bg-tertiary min-h-screen py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-heading-1">Harta incidentelor si rapoartelor</h1>
          <p className="text-body text-neutral-700">
            Vizualizeaza pe harta toate incidentele si rapoartele trimise prin
            AnimAlert, alaturi de date agregate din surse externe, inclusiv
            reteaua RO-bear. Selecteaza un punct pentru detalii despre locatie,
            validare si tipologie.
          </p>
        </header>

        {isLoading && reportPoints.length === 0 && (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            Se incarca datele AnimAlert...
          </div>
        )}

        {isError && (
          <div className="rounded-lg bg-white p-6 text-center text-error shadow">
            Nu am putut incarca datele AnimAlert: {" "}
            {error?.message ?? "eroare necunoscuta"}. Datele publice RO-bear
            raman afisate.
          </div>
        )}

        {hasAnyPoints ? (
          <ReportMap
            points={combinedPoints}
            selectedPoint={selectedPoint}
            onSelect={(point) => setSelectedPointId(point?.id ?? null)}
          />
        ) : (
          !isLoading && (
            <div className="rounded-lg bg-white p-6 text-center shadow">
              Nu exista date disponibile in acest moment.
            </div>
          )
        )}
      </div>
    </main>
  );
}
