"use client";

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { GoogleMap } from "~/components/ui/complex/google-map";
import { api } from "~/trpc/react";
import type { Coordinates } from "~/types/coordinates";

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = React.use(params);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [markerCoordinates, setMarkerCoordinates] =
    useState<Coordinates | null>(null);

  const {
    data: reportData,
    isLoading: reportLoading,
    error: reportError,
  } = api.report.getReport.useQuery({ id: reportId });

  const {
    data: files,
    isLoading: filesLoading,
    error: filesError,
  } = api.report.getReportFiles.useQuery({ id: reportId });

  if (reportLoading || filesLoading) return <div>Se încarcă...</div>;
  if (reportError) {
    switch (reportError.data?.code) {
      case "UNAUTHORIZED":
        redirect("/sign-in");
      case "NOT_FOUND":
        redirect("/not-found");
      case "FORBIDDEN":
        redirect("/forbidden");
      default:
        return (
          <div className="flex min-h-screen items-center justify-center">
            Eroare necunoscută: {reportError.message}
          </div>
        );
    }
  }

  if (!reportData) return <div>Raportul nu a fost găsit.</div>;

  const report = reportData;

  const coordinates =
    report.latitude && report.longitude
      ? { lat: report.latitude, lng: report.longitude }
      : null;

  let conversation: { question: string; answer: string }[] = [];

  try {
    conversation = report.conversation
      ? (JSON.parse(report.conversation) as {
          question: string;
          answer: string;
        }[])
      : [];
  } catch {
    conversation = [];
  }

  return (
    <main className="bg-tertiary flex flex-col items-center justify-center gap-6 pt-12 pb-24">
      <h1 className="text-heading-1 mb-4">Raport #{report.reportNumber}</h1>
      <section className="w-full max-w-xl rounded-md bg-white p-8 shadow-md">
        <h2 className="text-heading-2 mb-2">Detalii raport</h2>
        <ul className="text-body mb-4">
          <li>
            <strong>Tip:</strong>{" "}
            {{
              INCIDENT: "Incident",
              PRESENCE: "Prezență",
              CONFLICT: "Conflict/interacțiune",
            }[report.reportType] ?? "Necunoscut"}
          </li>
          <li>
            <strong>Creat:</strong>{" "}
            {report.createdAt
              ? format(report.createdAt, "dd.MM.yyyy HH:mm:ss")
              : "—"}
          </li>
          <li>
            <strong>Actualizat:</strong>{" "}
            {report.updatedAt
              ? format(report.updatedAt, "dd.MM.yyyy HH:mm:ss")
              : "—"}
          </li>
          <li>
            <strong>Locație:</strong> {report.address ?? "—"}
          </li>
          <li>
            <strong>Primește actualizări:</strong>{" "}
            {report.receiveUpdates ? "Da" : "Nu"}
          </li>
        </ul>
        {report.reportType === "INCIDENT" && (
          <section className="mt-8 w-full max-w-2xl">
            <h2 className="text-heading-2 mb-2">Conversație raport</h2>
            {conversation.length === 0 ? (
              <div className="text-gray-500">
                Nu există date de conversație disponibile.
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((item, idx) => (
                  <div key={idx} className="rounded bg-neutral-100 p-4">
                    <div className="text-primary-foreground mb-2 font-semibold">
                      Î: {item.question}
                    </div>
                    <div className="text-body">R: {item.answer}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        <section className="mb-8 w-full max-w-2xl">
          <h2 className="text-heading-2 mt-8 mb-4">Locația raportului</h2>
          {coordinates ? (
            <div style={{ width: "100%", height: 300 }}>
              <GoogleMap
                coordinates={coordinates}
                setCoordinates={setMarkerCoordinates}
              />
            </div>
          ) : (
            <div className="text-gray-500">
              Locația nu este specificată pentru acest raport.
            </div>
          )}
        </section>
      </section>

      <section className="mt-8 w-full max-w-2xl px-6">
        <h2 className="text-heading-2 mb-4">Fișiere atașate</h2>
        {filesError && (
          <div className="text-error">
            Eroare la încărcarea fișierelor: {filesError.message}
          </div>
        )}
        {!files || files.length === 0 ? (
          <div>Nu au fost găsite fișiere pentru acest raport.</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {files.map((file: { url: string; type: string }) => (
              <div key={file.url} className="w-60">
                {file.type.startsWith("image/") ? (
                  <>
                    {file.type === "image/svg+xml" ? (
                      <span>
                        Fișierele SVG nu pot fi previzualizate direct.
                        <Link
                          className="text-blue-500 underline"
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Descarcă SVG
                        </Link>
                      </span>
                    ) : (
                      <>
                        {file.type === "image/heic" ||
                        file.url.endsWith(".heic") ? (
                          <div>
                            <span>
                              Formatul HEIC nu este acceptat pentru
                              previzualizare.
                            </span>
                            <br />
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                              download
                            >
                              Descarcă Imagine HEIC
                            </a>
                          </div>
                        ) : (
                          <>
                            <Link
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={file.url}
                                alt="Fișier încărcat"
                                className="rounded-md"
                                width={240}
                                height={180}
                                style={{ objectFit: "cover" }}
                              />
                            </Link>
                            <a
                              href={file.url}
                              className="text-blue-500 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              Descarcă Imagine
                            </a>
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : file.type.startsWith("video/") ? (
                  <>
                    <video
                      src={file.url}
                      width={240}
                      height={180}
                      controls
                      className="rounded-md"
                    >
                      Browserul tău nu suportă tag-ul video.
                    </video>
                    <a
                      href={file.url}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Descarcă Video
                    </a>
                  </>
                ) : (
                  <div>
                    <span>Previzualizare indisponibilă</span>
                    <br />
                    <a
                      href={file.url}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Descarcă Fișier
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
