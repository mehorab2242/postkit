import Link from "next/link";

import { Prose, pageMetadata } from "@/components/shell/Prose";
import { tools } from "@/lib/tools";

export const metadata = pageMetadata(
  "About",
  "Why Postkit's tools run entirely in your browser, and who they are for.",
  "about",
);

export default function AboutPage() {
  return (
    <Prose title="About Postkit">
      <p>
        Postkit is a small set of free tools for people who post: splitting an
        image into a carousel, planning how a grid will look, cropping an avatar,
        styling text, working out an engagement rate. They are the tasks that
        come up constantly and that nothing quite handles well.
      </p>

      <h2>Everything runs in your browser</h2>
      <p>
        Most tools like these work by uploading your photo to a server, doing the
        work there, and sending a file back. Postkit does not. Your browser is
        entirely capable of decoding, cropping and re-encoding an image, so
        that is where it happens — on your own device, with your own photos,
        which never travel anywhere.
      </p>
      <p>
        This is not only a privacy position, though it is that too. It is also
        why the tools are fast, why there is no queue, why there is no file size
        limit beyond what your device can hold, and why a page keeps working if
        your connection drops after it loads.
      </p>

      <h2>No accounts, no limits</h2>
      <p>
        There is nothing to sign up for and nothing to subscribe to. There is no
        free tier that runs out after three images, and no watermark on anything
        you export. Processing an image costs us nothing, so there is no reason
        to ration it.
      </p>

      <h2>How it is paid for</h2>
      <p>
        Advertising, and nothing else. There is no premium version and your data
        is not the product — there is no data, because your files never reach
        us. Ads load only if you accept them, and the tools work identically if
        you do not.
      </p>

      <h2>Built for phones</h2>
      <p>
        Most people planning a post are holding a phone, so these are built for
        that first: touch drag that does not fight with scrolling, controls large
        enough to hit, and the tool itself at the top of the page rather than
        below an ad.
      </p>

      <h2>The tools</h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/${tool.slug}/`} className="underline">
              {tool.name}
            </Link>{" "}
            — {tool.intro}
          </li>
        ))}
      </ul>

      <p>
        If something is broken, or there is a tool you keep wishing existed, the{" "}
        <Link href="/contact/" className="underline">
          contact page
        </Link>{" "}
        is the place to say so.
      </p>
    </Prose>
  );
}
