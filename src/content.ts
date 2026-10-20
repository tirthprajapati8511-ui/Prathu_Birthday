// Every word on the site lives here, so the copy can be edited without
// touching any component.

export const NAME = 'Prathu';

/** NAAAA dodges exactly this many attempts; after that it stays put and can be pressed. */
export const NAAAA_ESCAPES = 10;

export const content = {
  hello: {
    eyebrow: 'Eak Nanu Gift che tara mate',
    title: ['Hello', `${NAME} !!`],
    hint: 'Eak Vat kav tane ?? Pella Earbuds Peri Leje !',
    cta: 'Bol ...',
  },

  reveal: {
    eyebrow: '21 October 2026 · ek special divas',
    lineOne: 'Happy',
    lineTwo: 'Birthday',
    name: NAME,
    sub: 'Yeahh !! 20 Years complete thay gaya tara 🎉',
    cta: 'Eak Question che tara mate ... ',
  },

  invite: {
    eyebrow: 'official invitation che tara mate',
    title: 'Bol Ice-Cream khava avis ? ?',
    sub: 'Tane Je Bhi Flavour game ee',
    yes: 'HAAAN 🍦',
    no: 'NAAAA',
    /** NAAAA's label, indexed by attempts so far (0–10). */
    dodgeLines: [
      'NAAAA',
      'pakku',
      'Fari thi vichari le ',
      'Aree Ice-Cream khava mate j kav chu',
      'Ubhi re tu ',
      'Are paisa mej dais ',
      'Bas ne avuj kavrvanu',
      'Heart Break kari didhu te 💔',
      'Last Chance dav chu have ',
      'Thik che bhai joie Lidhu me',
      'Chal Have Naaa j dabavi de ',
    ],
    /** Small caption under the arena, by attempts so far. */
    taunts: [
      '',
      'Button pan sharmai gayu 🙈',
      'Button pan nathi ichhtu ke tu Naa pade.',
      '“Naa” kevama atli mehnat? 😅',
      'Adhe sudhi pochi gai. Respect che!',
      'Ice-Cream pigli Jase 🍦',
      'Button thaki jase pan tu nai thaku ?',
      'Pakku ? Saru… 😢',
      'Haju be vaar…',
      'Bas eak vaar…',
      'Thik che bhai. Have e nai bhage. 🫠',
    ],
  },

  accepted: {
    /** The note in the message card under the title; \n starts a new line. */
    message: 'Mane to Vishvas nahi thato ke Mani gai tu\nbut tobhi Virtually j khavano che',
    /** Smaller line at the bottom of the message card. */
    note: 'if Sacche khava javu hoy to msg karje',
    cta: 'Eak Biji vastu che tara mate ...',
  },

  rejected: {
    title: 'Dil Tod diya mera',
    /** The note in the message card under the title. */
    message: 'Kn Chal have Virtually j khai laiye',
    change: 'saru chal jaisu !!!',
    cta: 'Kn Chal aa Letter Vachi le',
  },

  letter: {
    eyebrow: 'AA Khali tara mate j che atle eakla maj vachje',
    tapHint: 'Tap the seal to open',
    greeting: `Dear ${NAME},`,
    paragraphs: [
      'Happy birthday to you Prathu !! , Last year to kai special gift hati nai tara mate so a year try karyu che',
      'Ok to my one of the most Precious person.. This year bring you lots of happiness and Joy. Ane Always smile Karje bav mast lagu chu tu smile kare tyre.',
      'And me Bhagwan ne Pray karis ke tane ee badha milestones made jena mate tu try karu chu, Tu tara mummy papa ne Proud Feel karave ',
      'tari health sari re. And dayi to chuj atle ee nahi keto. Bas to have jo ice cream kahva javu hoy to keje and Enjoy Your Day. ',
    ],
    signoff: 'Me All time tara support maj chu ❤️',
    signature: 'Tirth ♥',
    cta: 'One last thing',
  },

  finale: {
    eyebrow: 'make a wish',
    hint: 'Chal Chal Akho bandh kar ane je bhi wish joie ee mangi ne candel par press karje',
    title: ['Happy Birthday', NAME],
    afterWish: 'Dada Tari Wish Puri karse. And Have Smile kar chal mast. ✨',
    restart: 'Replay from the start',
  },

  music: { on: 'Music on', off: 'Music off' },
};
