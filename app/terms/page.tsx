import { AppLink as Link } from "@/components/ui/AppLink";

import { Prose, pageMetadata } from "@/components/shell/Prose";

export const metadata = pageMetadata(
  "Terms",
  "The terms for using Postkit's free browser-based tools.",
  "terms",
);

export default function TermsPage() {
  return (
    <Prose title="Terms" updated="30 August 2026">
      <h2>Using Postkit</h2>
      <p>
        Postkit provides free tools that run in your web browser. You may use
        them for personal or commercial work, including client work, without
        asking permission and without attribution.
      </p>

      <h2>Your content is yours</h2>
      <p>
        You keep every right you had in the images and text you use here. Postkit
        claims no licence over them, and could not use them in any case: your
        files are processed on your own device and are never transmitted to us.
      </p>
      <p>
        You are responsible for having the right to use the images you process.
        Do not use these tools on material you do not have permission to use.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided as they are, without any warranty. Browsers
        differ, image formats vary, and a tool may produce an unexpected result
        or fail on a particular file. Keep your originals, and check the output
        before you publish it.
      </p>
      <p>
        To the extent the law allows, Postkit is not liable for any loss arising
        from your use of the site — including lost or corrupted files, a result
        that did not match what you expected, or anything that followed from
        publishing it.
      </p>

      <h2>Availability</h2>
      <p>
        There is no guarantee that the site or any individual tool will remain
        available. Tools may change or be withdrawn. Because everything runs
        locally, a page you have already loaded will keep working even if the
        site is unreachable.
      </p>

      <h2>Advertising</h2>
      <p>
        The site carries advertising, which is what makes it free to use. Ads are
        supplied by a third party and are not endorsements. What is shown, and
        the cookies involved, is covered on the{" "}
        <Link href="/privacy/" className="underline">
          privacy page
        </Link>
        .
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not attempt to disrupt the site, scrape it at a volume that affects
        other people, or present it as your own service. Beyond that, use it as
        much as you like — there are no limits on how many images you process,
        because each one costs us nothing.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated. The date at the top of this page shows when
        they last changed, and continuing to use the site means the current
        version applies.
      </p>
    </Prose>
  );
}
