const features = [
  {
    icon: "🔍",
    title: "Find Issues",
    description:
      "Discover SEO, performance, accessibility and technical problems across your website.",
  },
  {
    icon: "🤖",
    title: "Fix with AI",
    description:
      "Get AI-generated fixes and recommendations for the issues that matter most.",
  },
  {
    icon: "📈",
    title: "Monitor",
    description:
      "Keep your website healthy with automatic scans and monitoring.",
  },
];

export default function Features() {
  return (
    <section className="border-t bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="mb-4 text-2xl">{feature.icon}</div>

            <h3 className="text-lg font-semibold">{feature.title}</h3>

            <p className="mt-2 text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
