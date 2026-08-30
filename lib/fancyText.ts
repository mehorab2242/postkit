/**
 * Unicode style maps.
 *
 * These are character substitutions, not fonts. Most live in Mathematical
 * Alphanumeric Symbols (U+1D400–U+1D7FF), which is outside the Basic
 * Multilingual Plane — every character is a surrogate pair, so all iteration
 * here is by code point.
 *
 * That block has reserved gaps where Unicode already had the letter in
 * Letterlike Symbols (script capital B is at U+212C, not U+1D49D). A plain
 * offset loop therefore produces holes, which is what `exceptions` covers, and
 * what `lib/fancyText.test.ts` checks for on all 62 characters.
 */

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

export type StyleMap = Record<string, string>;

type Offsets = {
  upper?: number;
  lower?: number;
  digits?: number;
  /** Characters Unicode placed outside the block. */
  exceptions?: Record<string, number>;
};

function build({ upper, lower, digits, exceptions = {} }: Offsets): StyleMap {
  const map: StyleMap = {};

  const fill = (source: string, base?: number) => {
    if (base === undefined) {
      return;
    }

    for (const [index, character] of [...source].entries()) {
      map[character] = String.fromCodePoint(base + index);
    }
  };

  fill(UPPER, upper);
  fill(LOWER, lower);
  fill(DIGITS, digits);

  for (const [character, codePoint] of Object.entries(exceptions)) {
    map[character] = String.fromCodePoint(codePoint);
  }

  return map;
}

function fromPairs(source: string, target: string): StyleMap {
  const targets = [...target];

  return Object.fromEntries(
    [...source].map((character, index) => [character, targets[index]]),
  );
}

/** Appended after each character rather than substituted for it. */
const STRIKETHROUGH = "̶";
const UNDERLINE = "̲";

export type Style = {
  id: string;
  name: string;
  map?: StyleMap;
  /** Combining mark appended to every character. */
  combining?: string;
  reverse?: boolean;
};

export const styles: Style[] = [
  {
    id: "bold",
    name: "Bold",
    map: build({ upper: 0x1d400, lower: 0x1d41a, digits: 0x1d7ce }),
  },
  {
    id: "italic",
    name: "Italic",
    // Italic small h was already encoded as the Planck constant.
    map: build({
      upper: 0x1d434,
      lower: 0x1d44e,
      exceptions: { h: 0x210e },
    }),
  },
  {
    id: "bold-italic",
    name: "Bold italic",
    map: build({ upper: 0x1d468, lower: 0x1d482 }),
  },
  {
    id: "script",
    name: "Script",
    map: build({
      upper: 0x1d49c,
      lower: 0x1d4b6,
      exceptions: {
        B: 0x212c,
        E: 0x2130,
        F: 0x2131,
        H: 0x210b,
        I: 0x2110,
        L: 0x2112,
        M: 0x2133,
        R: 0x211b,
        e: 0x212f,
        g: 0x210a,
        o: 0x2134,
      },
    }),
  },
  {
    id: "bold-script",
    name: "Bold script",
    map: build({ upper: 0x1d4d0, lower: 0x1d4ea }),
  },
  {
    id: "fraktur",
    name: "Fraktur",
    map: build({
      upper: 0x1d504,
      lower: 0x1d51e,
      exceptions: {
        C: 0x212d,
        H: 0x210c,
        I: 0x2111,
        R: 0x211c,
        Z: 0x2128,
      },
    }),
  },
  {
    id: "bold-fraktur",
    name: "Bold fraktur",
    map: build({ upper: 0x1d56c, lower: 0x1d586 }),
  },
  {
    id: "double-struck",
    name: "Double-struck",
    map: build({
      upper: 0x1d538,
      lower: 0x1d552,
      digits: 0x1d7d8,
      exceptions: {
        C: 0x2102,
        H: 0x210d,
        N: 0x2115,
        P: 0x2119,
        Q: 0x211a,
        R: 0x211d,
        Z: 0x2124,
      },
    }),
  },
  {
    id: "sans",
    name: "Sans",
    map: build({ upper: 0x1d5a0, lower: 0x1d5ba, digits: 0x1d7e2 }),
  },
  {
    id: "sans-bold",
    name: "Sans bold",
    map: build({ upper: 0x1d5d4, lower: 0x1d5ee, digits: 0x1d7ec }),
  },
  {
    id: "sans-italic",
    name: "Sans italic",
    map: build({ upper: 0x1d608, lower: 0x1d622 }),
  },
  {
    id: "sans-bold-italic",
    name: "Sans bold italic",
    map: build({ upper: 0x1d63c, lower: 0x1d656 }),
  },
  {
    id: "monospace",
    name: "Monospace",
    map: build({ upper: 0x1d670, lower: 0x1d68a, digits: 0x1d7f6 }),
  },
  {
    id: "circled",
    name: "Circled",
    map: build({
      upper: 0x24b6,
      lower: 0x24d0,
      // Circled digits start at 1; zero sits on its own at U+24EA.
      digits: 0x245f,
      exceptions: { "0": 0x24ea },
    }),
  },
  {
    id: "negative-circled",
    name: "Negative circled",
    map: {
      ...build({ upper: 0x1f150, digits: 0x2775, exceptions: { "0": 0x24ff } }),
      ...fromPairs(LOWER, "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"),
    },
  },
  {
    id: "squared",
    name: "Squared",
    map: {
      ...build({ upper: 0x1f130 }),
      ...fromPairs(LOWER, "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"),
    },
  },
  {
    id: "negative-squared",
    name: "Negative squared",
    map: {
      ...build({ upper: 0x1f170 }),
      ...fromPairs(LOWER, "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"),
    },
  },
  {
    id: "fullwidth",
    name: "Fullwidth",
    map: build({ upper: 0xff21, lower: 0xff41, digits: 0xff10 }),
  },
  {
    id: "small-caps",
    name: "Small caps",
    map: {
      ...fromPairs(UPPER, UPPER),
      // Unicode has no small-cap X; it stays plain.
      ...fromPairs(LOWER, "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡxʏᴢ"),
      ...fromPairs(DIGITS, DIGITS),
    },
  },
  {
    id: "superscript",
    name: "Superscript",
    map: {
      ...fromPairs(UPPER, "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ"),
      ...fromPairs(LOWER, "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ"),
      ...fromPairs(DIGITS, "⁰¹²³⁴⁵⁶⁷⁸⁹"),
    },
  },
  {
    id: "upside-down",
    name: "Upside down",
    reverse: true,
    map: {
      ...fromPairs(UPPER, "∀ꓭƆᗡƎℲ⅁HIſꓘ⅂WNOԀΌꓤSꓕՈΛMXʎZ"),
      ...fromPairs(LOWER, "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz"),
      ...fromPairs(DIGITS, "0ІᄅƐㄣϛ9ㄥ86"),
    },
  },
  { id: "strikethrough", name: "Strikethrough", combining: STRIKETHROUGH },
  { id: "underline", name: "Underline", combining: UNDERLINE },
];

/**
 * Apply a style. Iteration is by code point — `input[i]` would split the
 * surrogate pairs these maps are made of. Unmapped characters fall through
 * unchanged, so spaces, punctuation and emoji survive.
 */
export function applyStyle(input: string, style: Style): string {
  const characters = [...input];

  const styled = characters.map((character) => {
    if (style.combining) {
      return character === " " ? character : character + style.combining;
    }

    return style.map?.[character] ?? character;
  });

  if (style.reverse) {
    styled.reverse();
  }

  return styled.join("");
}

/** A–Z, a–z, 0–9 — the set the style test walks. */
export const ALL_CHARACTERS = `${UPPER}${LOWER}${DIGITS}`;
