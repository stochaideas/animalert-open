"use client";

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
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

  // Inside your page component (after fetching reportData)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [markerCoordinates, setMarkerCoordinates] =
    useState<Coordinates | null>(null);

  // Fetch report (including user data)
  const {
    data: reportData,
    isLoading: reportLoading,
    error: reportError,
  } = api.report.getReportWithUser.useQuery({ id: reportId });

  // Fetch attached files from S3
  const {
    data: files,
    isLoading: filesLoading,
    error: filesError,
  } = api.report.getReportFiles.useQuery({ id: reportId });

  if (reportLoading || filesLoading) return <div>Loading...</div>;
  if (reportError)
    return <div>Error loading report: {reportError.message}</div>;

  if (!reportData) return <div>Report not found.</div>;

  const { report, user } = reportData;

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
    // Optionally log or debug here
    conversation = [];
  }

  return (
    <main className="bg-tertiary flex flex-col items-center justify-center gap-6 pt-12 pb-24">
      <h1 className="text-heading-1 mb-4">Report #{report.reportNumber}</h1>
      <section className="w-full max-w-xl rounded-md bg-white p-8 shadow-md">
        <h2 className="text-heading-2 mb-2">Report Details</h2>
        <ul className="text-body mb-4">
          <li>
            <strong>Type:</strong> {report.reportType}
          </li>
          <li>
            <strong>Created:</strong>{" "}
            {report.createdAt
              ? format(report.createdAt, "dd.MM.yyyy HH:mm:ss")
              : "—"}
          </li>
          <li>
            <strong>Updated:</strong>{" "}
            {report.updatedAt
              ? format(report.updatedAt, "dd.MM.yyyy HH:mm:ss")
              : "—"}
          </li>
          <li>
            <strong>Location:</strong> {report.address ?? "—"}
          </li>
          <li>
            <strong>Receive Updates:</strong>{" "}
            {report.receiveUpdates ? "Yes" : "No"}
          </li>
        </ul>
        {report.reportType === "INCIDENT" && (
          <section className="mt-8 w-full max-w-2xl">
            <h2 className="text-heading-2 mb-2">Report Conversation</h2>
            {conversation.length === 0 ? (
              <div className="text-gray-500">
                No conversation data available.
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((item, idx) => (
                  <div key={idx} className="rounded bg-neutral-100 p-4">
                    <div className="text-primary-foreground mb-2 font-semibold">
                      Q: {item.question}
                    </div>
                    <div className="text-body pl-4">A: {item.answer}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        <section className="mb-8 w-full max-w-2xl">
          <h2 className="text-heading-2 mb-4">Report Location</h2>
          {coordinates ? (
            <div style={{ width: "100%", height: 300 }}>
              <GoogleMap
                coordinates={coordinates}
                setCoordinates={setMarkerCoordinates}
              />
            </div>
          ) : (
            <div className="text-gray-500">
              Location not specified for this report.
            </div>
          )}
        </section>
        <h2 className="text-heading-2 mb-2">Reported By</h2>
        {user ? (
          <ul className="text-body mb-4">
            <li>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </li>
            <li>
              <strong>Phone:</strong> {user.phone}
            </li>
            {user.email && (
              <li>
                <strong>Email:</strong>{" "}
                <Link
                  className="text-blue-500 underline"
                  href={`mailto:${user.email}`}
                >
                  {user.email}
                </Link>
              </li>
            )}
            <li>
              <strong>User wants to receive other updates: </strong>
              {user.receiveOtherReportUpdates ? "Yes" : "No"}
            </li>
          </ul>
        ) : (
          <div className="text-body mb-4">User data not available.</div>
        )}
      </section>

      <section className="mt-8 w-full max-w-2xl px-6">
        <h2 className="text-heading-2 mb-4">Attached Files</h2>
        {filesError && (
          <div className="text-error">
            Failed to load files: {filesError.message}
          </div>
        )}
        {!files || files.length === 0 ? (
          <div>No files found for this report.</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {files.map((file: { url: string; type: string }) => (
              <div key={file.url} className="w-60">
                {file.type.startsWith("image/") ? (
                  <>
                    {file.type === "image/svg+xml" ? (
                      <span>
                        SVG files cannot be previewed directly.
                        <Link
                          className="text-blue-500 underline"
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download SVG
                        </Link>
                      </span>
                    ) : (
                      <Link
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={file.url}
                          alt="Uploaded file"
                          className="rounded-md"
                          width={240}
                          height={180}
                          style={{ objectFit: "cover" }}
                        />
                      </Link>
                    )}
                  </>
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={file.url}
                    width={240}
                    height={180}
                    controls
                    className="rounded-md"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div>
                    <span>Preview not available</span>
                    <br />
                    <a
                      href={file.url}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
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
