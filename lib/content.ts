/**
 * Page copy for each tool: the 400–600 words and the FAQ that render below it.
 *
 * Split out of `tools.ts` only for readability — this is registry data, keyed
 * by slug, and `tools.ts` is still the one place a tool is declared.
 *
 * Written for the person who just landed from a search, not for a crawler.
 */

export type ToolContent = {
  body: string[];
  faq: { q: string; a: string }[];
};

export const content: Record<string, ToolContent> = {
  "engagement-rate-calculator": {
    body: [
      "Engagement rate is the share of your audience that actually does something when you post. It is the number brands ask for first, because follower count on its own says nothing about whether anyone is paying attention. An account with 80,000 disengaged followers is worth less to a sponsor than one with 8,000 people who comment on every post, and engagement rate is the figure that makes that difference visible.",
      "The standard formula divides interactions by followers: add your average likes and average comments, divide by your follower count, and multiply by 100. That is what this calculator does. To get an average worth quoting, take your last nine to twelve posts, add up the likes across all of them, and divide by the number of posts — then do the same for comments. Fewer than nine posts and one viral outlier will distort the result in your favour, which tends to get noticed when a brand checks your profile themselves.",
      "There is no single correct way to measure this, and it is worth knowing which version you are quoting. Some people divide by reach or impressions rather than followers, which produces a very different and usually higher number, because it only counts people who actually saw the post. Dividing by followers is the more common and more conservative choice, and it is the one most media kits use. If you quote a reach-based figure, say so — a brand that recalculates it the usual way and gets half your number will assume you were inflating it.",
      "The benchmark shown alongside your result depends on your follower tier, because engagement falls predictably as accounts grow. Under 10,000 followers, 4 to 6 percent is typical. Between 10,000 and 50,000 it usually settles into 2 to 4 percent, and above 500,000 anything over 1 percent is respectable. This is not a sign that large accounts are doing something wrong. A small audience is usually made of people who chose you deliberately — friends, a niche community, people who found you through something specific. A large audience accumulates passive followers who scrolled past once and tapped follow, and they keep counting in the denominator forever.",
      "That relationship is why brands increasingly run campaigns with many smaller creators rather than one large one. If your rate looks low against a benchmark, the fix is rarely posting more often. Posting frequency raises the denominator effect on each individual post, and a rushed post that nobody responds to drags your average down. What moves the number is giving people a reason to reply: asking something specific, posting in a format that invites saving or sharing, and replying to the comments you do get so the conversation continues.",
      "Rates also drift over time for reasons that have nothing to do with your content. Platforms change what they show, seasons change how much people scroll, and a run of posts that reached beyond your followers will show a lower rate even though more people saw them. Track the figure monthly rather than per post, and compare it against your own history first and the benchmarks second.",
    ],
    faq: [
      {
        q: "What is a good engagement rate?",
        a: "It depends on your size. Under 10,000 followers, 4 to 6 percent is typical; from 10,000 to 50,000, 2 to 4 percent; above 500,000, 1 to 2 percent is normal. Anything above the range for your tier is genuinely strong, and worth putting in a media kit.",
      },
      {
        q: "Why did my engagement rate drop?",
        a: "Usually because your follower count grew faster than your interactions, which is the normal pattern as an account gets bigger. It can also drop when posts reach a lot of people who do not follow you, or after a period of posting more often than usual. A drop across a single month is rarely meaningful — look at the trend over several.",
      },
      {
        q: "Does this count views or reach?",
        a: "No. This calculates the follower-based rate, which uses likes and comments over follower count. That is the version most brands expect. A reach-based rate divides by the number of people who actually saw the post and will usually come out higher, so say which one you are quoting.",
      },
      {
        q: "Do saves and shares count?",
        a: "Not in this formula, though they matter to how far a post travels. If you want to include them, add your average saves and shares to the likes figure — just make it clear you have done so, because it is not the standard calculation and a brand recalculating it will get a different answer.",
      },
      {
        q: "How many posts should I average?",
        a: "Nine to twelve recent posts. Fewer than that and one unusually good post skews the result. If a post went viral well beyond your normal range, consider leaving it out and mentioning it separately.",
      },
      {
        q: "Is a small account really better for brands?",
        a: "Often, yes. Smaller accounts tend to have audiences that chose them deliberately and respond more, which is why many campaigns now use several small creators instead of one large one. A 5 percent rate at 3,000 followers is a real asset.",
      },
    ],
  },

  "carousel-splitter": {
    body: [
      "A carousel splitter cuts one image into a sequence of panels that line up when someone swipes through them. It is how a panorama becomes a post you can actually scroll, how a wide illustration keeps its detail instead of being squeezed into a single square, and how a piece of design gets several screens of attention instead of one.",
      "The work that matters is in the geometry. Your source photo almost never divides evenly into panels of the right shape, so something has to give. Cropping to fill computes the exact width needed for your chosen number of panels, centre-crops the image to that, and slices it — every panel is completely filled, at the cost of losing some of the left and right edges. Padding scales the whole image to fit and adds bars to make up the difference, so nothing is lost but the bars are visible. Cropping is the better default for photographs; padding is worth using when the edges carry something you cannot cut, like text or a logo.",
      "Panel shape changes the result more than most people expect. A 4:5 portrait panel is 1080 by 1350 pixels and takes up noticeably more vertical space in the feed than a 1080 square, which means more of the screen is yours as someone scrolls past. The trade is that a portrait panel is narrower relative to its height, so a wide source image gets cropped harder at the top and bottom. If your image is a true panorama, squares often preserve more of it.",
      "Seams are the failure people notice. When the boundaries between panels are calculated by rounding each one independently, the errors accumulate and you end up with a one or two pixel gap or overlap between panels — invisible in a preview, obvious once the carousel is published and someone swipes between two panels that should be continuous. This tool draws the full strip once at export resolution and slices the panels out of it, so every boundary is exact and the last panel ends precisely at the image edge.",
      "Upload order is the other thing that goes wrong, and it is entirely avoidable. Files here are named 01, 02, 03 with a leading zero, because a phone gallery sorting names as text puts 10 before 2. When you select the panels to upload, check that the first one you tap is 01 — most support questions about carousel tools turn out to be panels uploaded in a shuffled order, which cannot be fixed after posting without deleting and starting again.",
      "Everything happens in your browser. The image is decoded, cropped and sliced by your own device, and the zip is assembled there too, which is why nothing is uploaded and why the tool keeps working if your connection drops after the page loads. On an iPhone the downloaded zip lands in the Files app rather than your photo library, so open Files, unzip it there, and save the panels to Photos before you post.",
      "If you are working from a phone photo, note that very large images are scaled down before processing. Mobile browsers cap how big a canvas can be, and past that limit they return a blank image with no error at all, so the safe thing is to resize first. The panels still export at full 1080 pixel width, so the result is the size every platform expects.",
    ],
    faq: [
      {
        q: "How many panels should a carousel have?",
        a: "Three is the usual choice and keeps each panel wide enough to read. Two works for a simple before-and-after. Beyond six, each panel becomes a narrow slice of the original and people tend to stop swiping before the end.",
      },
      {
        q: "Should I use square or portrait panels?",
        a: "Portrait 4:5 panels take up more of the feed and generally get looked at for longer. Square panels crop a wide source image less severely. If your image is a true panorama, try square first and check the preview.",
      },
      {
        q: "Why is there a thin line between my panels after posting?",
        a: "That is a rounding seam, and it comes from panel boundaries being calculated independently. This tool renders the whole strip once and cuts from it, so the boundaries match exactly. If you still see a line, check you uploaded the panels in order and that none were re-compressed by another app in between.",
      },
      {
        q: "Is my photo uploaded anywhere?",
        a: "No. The image is processed entirely by your browser using your device's own graphics. Nothing is sent to a server, which is also why the tool keeps working offline once the page has loaded.",
      },
      {
        q: "Where did my download go on iPhone?",
        a: "Zip files go to the Files app, not your photo library. Open Files, find the zip in Downloads, tap it to unzip, then save the panels into Photos before uploading them.",
      },
      {
        q: "Can I split a photo taken on my iPhone?",
        a: "Yes, as long as it is a JPG. iPhones default to HEIC, which browsers cannot open — in Settings, Camera, Formats, choose Most Compatible, or share the photo through any app that converts it to JPG first.",
      },
    ],
  },

  "instagram-grid-planner": {
    body: [
      "A grid planner shows you what your profile will look like before you commit to posting. On a phone, a profile is a three-column grid, and each new post pushes everything else down and along. That means a post never lands in isolation — it lands next to two others and above the three that came before, and those relationships are what a visitor sees in the first second before they read a single caption.",
      "Planning the grid is mostly about avoiding accidents. Two photos with almost the same composition sitting side by side look like a mistake. A run of five dark images makes a profile feel heavy in a way no single post does. A bright post between two muted ones draws attention exactly where you want it. None of this is visible while you are looking at posts one at a time in a camera roll, which is why arranging them in the actual layout is worth the few minutes it takes.",
      "The preview here defaults to a 3:4 crop rather than a square, because feed thumbnails render taller than square now. A square preview quietly lies to you about what gets cut: a composition that looks balanced as a square can lose the top of someone's head once it is rendered taller. You can switch between the two to see the difference, and it is worth checking any photo where something important sits near an edge.",
      "Order matters more than the individual images for most accounts. A common approach is to alternate — a busy image, then a simple one, then a photo with a lot of empty space — so the grid has rhythm instead of noise. Another is to keep a consistent colour running through every third post, which reads as intentional without requiring every photo to match. Neither approach is a rule, and the useful thing about seeing the grid laid out is that you can tell within a few seconds whether something feels wrong, even when you cannot articulate why.",
      "Dragging works on a phone as well as a desktop. Press and hold a photo for a moment before dragging, which is what keeps ordinary vertical scrolling working — without that short delay, every attempt to scroll the page would pick up a tile instead. Once a tile lifts, drag it anywhere in the grid and the others move around it.",
      "Your layout is saved in this browser, so closing the tab, refreshing, or swiping back does not lose your planning. It is stored locally on your own device, never on a server, which also means it will not follow you to a different phone or browser and will disappear if you clear your browsing data. The photos themselves are never uploaded; they are shrunk to small previews by your device so that eighteen of them do not slow the page down, and those previews are what gets saved.",
      "When you are happy with the order, remember that a profile fills from the top. The post you upload next appears first, so work backwards through your planned grid — the tile you placed at the top is the one to post last.",
    ],
    faq: [
      {
        q: "Does this post to my account?",
        a: "No. This is a planning tool only. It has no connection to any platform, asks for no login, and cannot post anything. When you have decided on an order, you upload the photos yourself in the usual way.",
      },
      {
        q: "Why does the preview crop my photos taller than square?",
        a: "Because feed thumbnails now render at roughly 3:4 rather than square. A square preview would show you more of each photo than a visitor will actually see. You can switch the tall crop off to compare.",
      },
      {
        q: "Will my layout still be here tomorrow?",
        a: "Yes, as long as you use the same browser on the same device and do not clear your browsing data. The layout is stored locally, not on a server, so it will not appear on your other devices.",
      },
      {
        q: "Why can't I drag on my phone?",
        a: "Press and hold a photo for a moment first, then drag. The short delay exists so that scrolling the page still works normally — without it, every scroll would pick up a tile.",
      },
      {
        q: "How many photos can I plan at once?",
        a: "Up to eighteen, which is six rows — enough to see how a run of posts works together without making the page slow on a phone.",
      },
      {
        q: "In what order should I post them?",
        a: "Backwards. A profile fills from the top, so the tile you placed in the top-left is the one you post last.",
      },
    ],
  },

  "fancy-text-generator": {
    body: [
      "This converts ordinary text into styled versions you can paste anywhere — a bio, a caption, a comment, a display name. Type once and every style updates as you go, then tap the row you want to copy it.",
      "It is worth understanding what these actually are, because it explains everything about how they behave. They are not fonts. A font changes how a character is drawn while the character itself stays the same — the letter A styled in bold is still the letter A. What these do instead is substitute genuinely different characters that happen to look like styled letters. Bold A is a separate character in the Unicode standard, in a block called Mathematical Alphanumeric Symbols, originally added so mathematicians could write equations where a bold variable means something different from an italic one.",
      "That substitution is why these work in places that offer no formatting at all. A bio field that strips every trace of HTML will happily accept them, because as far as it is concerned they are just letters. It is also why they survive being copied between apps and why they need no special support from the platform you paste them into.",
      "The same fact is behind the drawbacks, and they are worth weighing before you style something important. A screen reader does not see a styled word — it sees a string of mathematical symbols, and depending on the reader it will either spell out each symbol's name or skip them entirely. For someone using one, a bio written in script becomes unreadable noise. Search is the other issue: some platforms index these characters literally, so a styled word will not match when somebody searches for the plain version, which matters if your name or what you do is part of how people find you.",
      "The practical compromise most people land on is to keep the words that carry information in plain text — your name, your job, your location, anything someone might search for — and use styling for decoration, section breaks, or a single line that does not need to be found. That way the tool adds character without costing you reach or shutting anyone out.",
      "Not every style covers every character, and that is a property of Unicode rather than a limitation here. There is no superscript Q, no small-capital X, and several letters in the script and fraktur alphabets live at unexpected positions because they were already encoded elsewhere years earlier — the script capital B, for instance, sits in a completely different block from the rest of its alphabet. Where no styled version exists, the original character is used unchanged, which is why the occasional letter in a word will look plain. Digits are missing from several styles entirely, italic and script among them, because Unicode never encoded styled digits for those alphabets.",
      "Strikethrough and underline work differently again. Rather than substituting characters, they add a combining mark after each one — an invisible instruction that tells the renderer to draw a line through or under the character before it. These are the most fragile of the styles, and some apps will strip or misplace them, so check how they look before relying on them.",
    ],
    faq: [
      {
        q: "Are these real fonts?",
        a: "No. They are different Unicode characters that resemble styled letters. That is why they work in bios and captions that allow no formatting, and also why screen readers and search treat them differently from ordinary text.",
      },
      {
        q: "Will these work in my bio?",
        a: "In most places, yes, because they are ordinary characters as far as the platform is concerned. A few apps filter certain ranges, and some strip the combining marks used by strikethrough and underline, so paste and check before you save.",
      },
      {
        q: "Why do some letters stay plain?",
        a: "Because Unicode has no styled version of that character. There is no superscript Q or small-capital X, and several styles have no digits at all. When there is no substitute, the original character is used rather than something that does not match.",
      },
      {
        q: "Are these bad for accessibility?",
        a: "For screen reader users, yes. Styled text is read as a series of symbol names or skipped altogether. Keeping your name and anything meaningful in plain text, and using styles for decoration, avoids most of the harm.",
      },
      {
        q: "Will people still find me in search?",
        a: "Not reliably if your searchable words are styled. Some platforms index these characters literally, so a styled name will not match a plain-text search for the same name. Keep anything you want found in ordinary letters.",
      },
      {
        q: "Why does the text look different on another phone?",
        a: "Because rendering depends on the fonts installed on that device. A character with no local glyph shows as a box. Older Android builds tend to be the least complete, so check on a second device if it matters.",
      },
    ],
  },

  "profile-picture-cropper": {
    body: [
      "A profile picture is displayed small and round almost everywhere, which is a harsher constraint than it sounds. A photo that works as a full-frame portrait often fails as an avatar: the face ends up too small to recognise at 40 pixels across, or the circular mask cuts through a chin or the top of a head. This tool exists to let you see the circle while you position the photo, rather than finding out after you have uploaded it.",
      "Drag to move the image and pinch or use the slider to zoom. The area inside the circle is what every platform will keep; the darkened area around it is what gets masked away. The image is held so that it always covers the whole crop area, which is why dragging stops at the edges — that constraint exists to prevent the one genuinely unfixable mistake, an avatar with an empty corner where the photo ran out.",
      "As a rule, zoom in more than feels comfortable. Avatars are usually seen at somewhere between 32 and 64 pixels across — next to a comment, in a message list, at the top of a feed. A photo framed at a natural portrait distance becomes an unidentifiable smudge at that size. Filling the circle with the head and shoulders, so the face occupies most of the frame, is what makes a picture recognisable in the places it is actually seen.",
      "The file this produces is square, not circular, and that is deliberate. Every platform applies its own circular mask when it displays an avatar, and they do not all use the same diameter or the same anti-aliasing. If you upload an image that is already a circle with transparent corners, those corners will show as visible edges anywhere the image is composited onto a background that is not the colour you assumed — a dark mode interface, a coloured card, a notification. A square file lets each platform round it off the way it intends to.",
      "It exports at 1080 by 1080 pixels, which is larger than any platform displays and deliberately so. Uploading a picture that is already small means the platform has nothing to work with when it generates the larger versions it uses on profile pages and in its apps, and the result looks soft. Starting from a generously sized square gives every one of those derived sizes something to downscale from, and downscaling always looks better than upscaling.",
      "Photos taken on a phone are often stored rotated, with a separate tag saying which way up they should be. Software that ignores that tag renders them sideways, which is the usual explanation for a portrait photo appearing on its side after an upload. Your photo is decoded here with that orientation applied, so what you see in the circle is what you get in the file.",
      "Nothing is uploaded. The image is decoded and drawn entirely by your own device, and the finished file is generated in the browser and saved straight to your downloads. That is worth knowing for a profile picture specifically: it is usually a photo of your own face, and there is no reason for it to be sent to a server just to be cropped.",
    ],
    faq: [
      {
        q: "Why is the download square and not a circle?",
        a: "Because every platform applies its own circular mask. An image that is already circular has transparent corners, and those show as visible edges wherever the picture sits on a coloured or dark background. A square file lets each platform round it correctly.",
      },
      {
        q: "What size should a profile picture be?",
        a: "Bigger than it is displayed. This exports at 1080 by 1080, which gives platforms plenty to work with when they generate the smaller versions. Uploading something already small is what makes an avatar look soft.",
      },
      {
        q: "Why won't the photo move any further?",
        a: "It is clamped so the image always covers the whole crop area. Without that, you could drag the photo partly out of frame and end up with an avatar that has an empty corner. Zoom in if you need to reach a different part of the picture.",
      },
      {
        q: "Why did my photo come out sideways elsewhere?",
        a: "Phone photos store their rotation as a separate tag, and software that ignores it renders them on their side. That tag is applied here before anything is drawn, so what you see in the circle is what the exported file contains.",
      },
      {
        q: "Can I use a HEIC photo from my iPhone?",
        a: "Not directly — browsers cannot decode HEIC. In Settings, Camera, Formats, choose Most Compatible so new photos save as JPG, or share an existing photo through an app that converts it.",
      },
      {
        q: "Is my photo uploaded to a server?",
        a: "No. It is decoded, cropped and exported entirely on your own device. Nothing leaves your browser, which for a photo of your own face is worth having.",
      },
    ],
  },
};
