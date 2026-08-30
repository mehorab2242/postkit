import { CONTACT_EMAIL } from "@/lib/tools";
import { Prose, pageMetadata } from "@/components/shell/Prose";

export const metadata = pageMetadata(
  "Contact",
  "How to reach Postkit about a bug, a tool request, or a privacy question.",
  "contact",
);

export default function ContactPage() {
  return (
    <Prose title="Contact">
      <p>
        Email is the only way to reach us, and it reaches a person. There is no
        contact form here because there is no server to receive one — the whole
        site is static files, which is the same reason your photos never get
        uploaded.
      </p>

      <p className="font-mono text-lead">
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
          {CONTACT_EMAIL}
        </a>
      </p>

      <h2>Reporting a problem</h2>
      <p>
        If a tool did something wrong, the useful details are: which tool, what
        browser and device you were using, and roughly what the image was — its
        size, its shape, and whether it came straight from a phone camera. You
        do not need to send the image itself, and please do not; a description is
        almost always enough to reproduce the problem.
      </p>

      <h2>Suggesting a tool</h2>
      <p>
        Requests are genuinely welcome, particularly for things you currently do
        by hand or by uploading a file to a site you would rather not. The
        constraint is that it has to be possible in a browser without a server,
        which rules out less than you might think.
      </p>

      <h2>Privacy questions</h2>
      <p>
        Anything about data, cookies or consent can come to the same address.
        Questions about what a specific tool does with your file usually have a
        short answer: nothing leaves your device.
      </p>
    </Prose>
  );
}
