import Link from "next/link";

import { Prose, pageMetadata } from "@/components/shell/Prose";

export const metadata = pageMetadata(
  "Privacy",
  "What Postkit does and does not collect. Your images are processed in your browser and are never uploaded.",
  "privacy",
);

export default function PrivacyPage() {
  return (
    <Prose title="Privacy" updated="30 August 2026">
      <h2>The short version</h2>
      <p>
        The photos and text you put into any tool on this site never leave your
        device. There is no account to create, and nothing you make here is
        stored on a server, because there is no server doing the work — the
        tools run entirely inside your browser.
      </p>

      <h2>Your files</h2>
      <p>
        Every tool processes your images locally using your browser&apos;s own
        graphics capabilities. Nothing is uploaded, not for processing, not for
        analytics, and not for error reporting. You can confirm this yourself:
        open your browser&apos;s network inspector, use a tool, and you will see
        no requests carrying your image. You can also disconnect from the
        internet after a page has loaded and the tools will keep working.
      </p>
      <p>
        The grid planner saves your layout in your browser&apos;s local storage
        so it survives a refresh. That data stays on your device, is readable
        only by this site in that browser, and disappears when you clear your
        browsing data or press &ldquo;Clear all&rdquo;.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        Postkit is free and is funded by advertising. Advertising and analytics
        scripts do not load at all until you choose &ldquo;Accept&rdquo; on the
        banner shown on your first visit. If you choose &ldquo;No thanks&rdquo;,
        no advertising cookie is set and no advertising script is requested, and
        that choice is remembered in your browser.
      </p>
      <p>
        If you do accept, our advertising partner may set cookies to measure
        performance and to show ads that are more relevant to you. Those
        partners act as independent controllers of the data they collect. They
        do not receive your images, which never leave your device in the first
        place.
      </p>

      <h2>What we collect</h2>
      <p>
        Postkit itself does not run its own account system, contact database, or
        user profile of any kind. Standard web server logs may record the page
        requested, the time, and a truncated network address, which is used only
        to keep the site running and to spot abuse.
      </p>

      <h2>Changing your mind</h2>
      <p>
        You can withdraw or grant consent at any time by clearing this
        site&apos;s data in your browser settings, which resets the banner on
        your next visit. You can also block cookies for this site entirely; the
        tools will continue to work normally, because they never needed them.
      </p>

      <h2>Children</h2>
      <p>
        Postkit is not directed at children under 13 and does not knowingly
        collect information from them.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about any of this can go through the{" "}
        <Link href="/contact/" className="underline">
          contact page
        </Link>
        .
      </p>
    </Prose>
  );
}
