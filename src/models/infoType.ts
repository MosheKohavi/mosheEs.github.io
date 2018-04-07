export class InfoTypeObj {
  caption : string;
  icon : string;
  color : string;
}

export const InfoType = {
  article : {
    caption: "מאמרים",
    icon: 'ios-document-outline',
    color: '#000000',
  },
  website : {
    caption: "אתרים ובלוגים",
    icon: 'globe',
    color: '#079020',
  },
  video : {
    caption: "וידאו",
    icon: 'logo-youtube',
    color: '#E00000',
  },
  podcast : {
    caption: "פודקאסטים",
    icon: 'microphone',
    color: '#51B0BD',
  },
  post : {
    caption: "פוסטים",
    icon: 'logo-facebook',
    color: '#4267b2',
  },
  book : {
    caption: "ספרים",
    icon: 'ios-bookmarks',
    color: '#6B0F82',
  },
  document : {
    caption: "מסמכים",
    icon: 'ios-filing',
    color: 'blur',
  },
  meme : {
    caption: "ממים",
    icon: 'image',
    color: '#F58208',
  },
  term : {
    caption: "מונחים",
    icon: 'key',
    color: '#c3b900',
  },
}
