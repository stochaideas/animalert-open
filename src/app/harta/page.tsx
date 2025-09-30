"use client";

import { useMemo, useState } from "react";

import { ReportMap } from "~/components/ui/complex/report-map";
import type { ReportMapPoint } from "~/types/report-map";
import { api } from "~/trpc/react";

export default function HartaPage() {
  const { data, isLoading, isError, error } = api.report.getMapData.useQuery();
  const [selectedPoint, setSelectedPoint] = useState<ReportMapPoint | null>(null);

  const points = useMemo(() => data ?? [], [data]);

  return (
    <main className="bg-tertiary min-h-screen py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-heading-1">Harta incidentelor și rapoartelor</h1>
          <p className="text-body text-neutral-700">
            Vizualizează pe hartă toate incidentele și rapoartele trimise prin AnimAlert alături de date agregate
            din surse externe. Selectează un pin pentru a vedea detalii precum poziția GPS, statusul validării,
            tipul raportului și imaginile disponibile.
          </p>
        </header>

        {isLoading && <div className="rounded-lg bg-white p-6 text-center shadow">Se încarcă harta...</div>}

        {isError && (
          <div className="rounded-lg bg-white p-6 text-center text-error shadow">
            Nu am putut încărca harta: {error?.message ?? "Eroare necunoscută"}
          </div>
        )}

        {!isLoading && !isError && points.length === 0 && (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            Nu există rapoarte sau incidente disponibile în acest moment.
          </div>
        )}

        {!isLoading && !isError && points.length > 0 && (
          <ReportMap
            points={points}
            selectedPoint={selectedPoint}
            onSelect={setSelectedPoint}
          />
        )}
      </div>
    </main>
  );
}
