import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact - Ryan Yogan" },
      {
        name: "description",
        content: "Get in touch with Ryan Yogan.",
      },
      { property: "og:title", content: "Contact - Ryan Yogan" },
    ],
  }),
});

function ContactPage() {
  return (
    <div className="w-full max-w-[--max-width] mx-auto px-6 py-16">
      <h1 className="text-[22px] font-semibold tracking-[-0.02em] mb-8">
        Contact
      </h1>

      <div className="prose">
        <p className="text-[--color-muted]">
          I'm always happy to hear from people. Whether you want to discuss a
          potential role, collaborate on something, or just say hello.
        </p>

        <p className="text-[--color-muted]">
          The best way to reach me is by{" "}
          <a href="mailto:ryan@ryanyogan.com">email</a>. I try to respond to
          everything, though it might take a few days.
        </p>

        <p className="text-[--color-muted]">
          You can also find me on{" "}
          <a
            href="https://twitter.com/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          where I occasionally post about what I'm working on, or{" "}
          <a
            href="https://linkedin.com/in/ryanyogan"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>{" "}
          for professional inquiries.
        </p>

        <hr />

        <h2>Currently</h2>

        <p className="text-[--color-muted]">
          I'm open to engineering leadership roles and consulting
          opportunities. Particularly interested in companies working on
          developer tools, AI, or infrastructure.
        </p>

        <p className="text-[--color-muted]">
          If you're building something in this space, I'd love to hear about
          it.
        </p>
      </div>
    </div>
  );
}
