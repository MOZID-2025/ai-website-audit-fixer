"use client";

import { useState } from "react";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const [fixingImage, setFixingImage] = useState(null);
  const [suggestedAlt, setSuggestedAlt] = useState("");
  const [fixLoading, setFixLoading] = useState(false);

  const handleFixAlt = async (image) => {
    try {
      setFixLoading(true);
      setFixingImage(image);
      setSuggestedAlt("");

      const response = await fetch("/api/fix/alt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageSrc: image.src,
          pageTitle: report?.seo?.title || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFixingImage(null);
        setSuggestedAlt("");
        setError(data.message || "Unable to generate ALT text.");
        return;
      }

      setSuggestedAlt(data.altText || "");
    } catch (error) {
      console.error("ALT fix error:", error);
      setFixingImage(null);
      setSuggestedAlt("");
      setError("Something went wrong while generating ALT text.");
    } finally {
      setFixLoading(false);
    }
  };

  const closeFixModal = () => {
    setFixingImage(null);
    setSuggestedAlt("");
    setFixLoading(false);
  };

  const handleApplyFix = () => {
    // Temporary demo behavior.
    // Later this will actually update the website.
    alert(
      "ALT fix approved!\n\nLater, this button will apply the change to your website.",
    );

    closeFixModal();
  };

  const handleScan = async () => {
    setError("");
    setReport(null);

    if (!url.trim()) {
      setError("Please enter your website URL.");
      return;
    }

    try {
      const websiteUrl = new URL(url);

      if (!["http:", "https:"].includes(websiteUrl.protocol)) {
        setError("Please enter a valid website URL.");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: websiteUrl.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setReport(data.data);
    } catch (error) {
      console.error("Scan error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-24">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-6 inline-block rounded-full bg-gray-100 px-4 py-2 text-sm">
            AI-Powered Website Health
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            Find what&apos;s wrong with your website.
            <br />
            Fix it with AI.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Scan your website for SEO, performance, accessibility and technical
            issues — then fix them with AI.
          </p>

          {/* URL Input */}
          <div className="mx-auto mt-10 flex max-w-2xl gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleScan();
                }
              }}
              placeholder="https://yourwebsite.com"
              className="flex-1 rounded-xl border px-5 py-4 outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={handleScan}
              disabled={loading}
              className="rounded-xl bg-black px-6 py-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Scanning..." : "Scan My Website"}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <p className="mt-4 text-sm text-gray-500">
            Free scan · No credit card required
          </p>
        </div>

        {/* Report */}
        {report && (
          <div className="mt-16">
            {/* Score */}
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Website Health Score
              </p>

              <div className="mt-4 text-6xl font-bold">
                {report.healthScore}
                <span className="text-2xl text-gray-400">/100</span>
              </div>

              <p className="mt-3 break-all text-gray-600">{report.url}</p>
            </div>

            {/* Issues */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold">Issues Found</h2>

              {report.issues.length === 0 ? (
                <div className="mt-5 rounded-xl border p-6">
                  <p className="font-medium">🎉 No issues found!</p>

                  <p className="mt-2 text-sm text-gray-600">
                    Your website passed all current checks.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-xl border bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {issue.severity === "critical"
                                ? "🔴"
                                : issue.severity === "warning"
                                  ? "🟠"
                                  : "🟡"}
                            </span>

                            <h3 className="font-semibold">{issue.title}</h3>
                          </div>

                          <p className="mt-2 text-sm text-gray-600">
                            {issue.description}
                          </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                          {issue.severity}
                        </span>
                      </div>

                      {/* ALT Fix */}
                      {issue.fixable && issue.id === "missing-image-alt" && (
                        <div className="mt-5 border-t pt-5">
                          <p className="mb-3 text-sm font-medium">
                            Images that need ALT text:
                          </p>

                          {report.images.items
                            .filter((image) => !image.alt)
                            .map((image, index) => (
                              <div
                                key={`${image.src}-${index}`}
                                className="mb-3 rounded-lg bg-gray-50 p-4"
                              >
                                <p className="break-all text-xs text-gray-500">
                                  {image.src || "Image source unavailable"}
                                </p>

                                <button
                                  onClick={() => handleFixAlt(image)}
                                  disabled={fixLoading}
                                  className="mt-3 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {fixLoading && fixingImage?.src === image.src
                                    ? "Generating..."
                                    : "✨ Fix with AI"}
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* AI Fix Modal */}
      {fixingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">AI Fix</p>

                <h2 className="mt-1 text-xl font-bold">Generate ALT Text</h2>
              </div>

              <button
                onClick={closeFixModal}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            {/* Image */}
            <div className="mt-5 rounded-xl border bg-gray-50 p-4">
              <p className="mb-2 text-xs font-medium text-gray-500">Image</p>

              <p className="break-all text-sm text-gray-700">
                {fixingImage.src || "Image source unavailable"}
              </p>
            </div>

            {/* Loading */}
            {fixLoading ? (
              <div className="py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                <p className="mt-4 text-sm text-gray-600">
                  AI is generating a suggestion...
                </p>
              </div>
            ) : (
              <>
                {/* Suggestion */}
                <div className="mt-5">
                  <label className="text-sm font-medium">
                    Suggested ALT Text
                  </label>

                  <textarea
                    value={suggestedAlt}
                    onChange={(e) => setSuggestedAlt(e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-xl border p-4 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={closeFixModal}
                    className="flex-1 rounded-xl border px-4 py-3 text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleApplyFix}
                    disabled={!suggestedAlt.trim()}
                    className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Apply Fix
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-gray-500">
                  Review the AI suggestion before applying it.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
