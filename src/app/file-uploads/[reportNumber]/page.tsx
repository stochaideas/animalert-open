"use client";

import Image from "next/image";
import React from "react";
import { api } from "~/trpc/react";

export default function FileUploadsPage({
  params,
}: {
  params: Promise<{ reportNumber: string }>;
}) {
  const { reportNumber } = React.use(params);
  const reportNumberInt = parseInt(reportNumber, 10);

  const {
    data: files,
    isLoading,
    error,
  } = api.report.getReportFiles.useQuery({
    reportNumber: reportNumberInt,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading files: {error.message}</div>;
  }

  if (!files || files.length === 0) {
    return <div>No files found for this report.</div>;
  }
  return (
    <main className="bg-tertiary flex flex-col items-center justify-center gap-6 pt-12 pb-24">
      <h1 className="text-heading-1">Files for Report #{reportNumberInt}</h1>
      <>
        {files.map((file) => (
          <div key={file.url} style={{ marginTop: "8px" }}>
            {file.type.startsWith("image/") ? (
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={file.url}
                  className="rounded-md"
                  alt="Uploaded file"
                  width={500}
                  height={500}
                />
              </a>
            ) : file.type.startsWith("video/") ? (
              <video
                src={file.url}
                width={500}
                height={200}
                controls
                style={{ display: "block" }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <span>Preview not available</span>
            )}
          </div>
        ))}
      </>
    </main>
  );
}
