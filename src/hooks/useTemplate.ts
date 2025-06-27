import { useEffect, useState } from "react";

export async function useTemplate(url: string) {
  const [template, setTemplate] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then(setTemplate)
      .catch((err) => {
        console.error("Failed to load template:", err);
      });
  }, [url]);

  return template;
}
