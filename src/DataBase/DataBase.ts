import {Item} from "../models/Item";
import {InfoType} from "../models/infoType";
import {Lang} from "../models/LangEnum";
import {Person} from "../models/Person";

export const AUTHOR_LIST : Person[] = [
  // {
  //   name : "ג'ון סטיוארט מיל",
  //   description : 'ג\'וֹן סְטְיוּאַרְט מִיל (באנגלית: John Stuart Mill;‏ 20 במאי 1806 – 8 במאי 1873) היה פילוסוף, כלכלן פוליטי, פמיניסט ועובד ציבור אנגלי, אשר נחשב להוגה הליברלי המשפיע ביותר במאה ה-19. הוא פיתח את תורת התועלתנות בתחום הפילוסופיה של המוסר, עסק בלוגיקה ובפילוסופיה מדינית ותמך בתאוריה האתית שהציג לראשונה מורו וחברו הטוב של אביו, ג\'רמי בנת\'ם. תפיסתו הליברלית תבעה את חירות האינדיבידואל על פני שליטה ממשלית חסרת גבולות.\n' +
  //   '\n',
  //   link : 'https://he.wikipedia.org/wiki/ג%27ון_סטיוארט_מיל',
  //   img : 'data:image/jpeg;base64,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'
  // },
  // {
  //   name : 'מוטי היינריך',
  //   description : 'מוטי (מרק) היינריך, בוגר הטכניון בחיפה (הנדסה) ואוניברסיטת תל אביב ( מנהל עסקים MBA ).\n' +
  //   '\n',
  //   link : '',
  //   img : 'https://lh5.googleusercontent.com/-m_OQU16YJls/WKx1BwV4B1I/AAAAAAAAABA/0twCfRTAW58_ePtc2MNAOTCf_j60ENqDACLIB/w160-h160-k-no/'
  // },
  // {
  //   name : 'קו ישר',
  //   description : '"קו ישר" מציג מבנה חלופי למדינת ישראל המבוסס על כלכלה חופשית וחירות הפרט – כך נהיה למדינה העשירה בעולם. מזעור בחישת המדינה בכלכלה ובחברה. קיצוץ הר חוקים מיותרים שליישומם נדרש מגזר ציבורי ענק ובזבזני. קץ ל"משטר החלוקה" של כסף וזכויות יתר לקבוצות לחץ ול"זכאים".',
  //   link : 'http://www.kav.org.il/'
  // },
  // {
  //   name : 'Learn Liberty',
  //   description : 'Learn Liberty is your resource for exploring the ideas of a free society. We tackle big questions about what makes a society free or prosperous and how we can improve the world we live in. We don’t have all the answers - but we’ve got a lot of ideas.\n',
  //   link : 'https://www.youtube.com/channel/UCFJNcE0iHj7P6dhp5iCZRLg',
  //   img : 'https://yt3.ggpht.com/-L54B9mqfqMk/AAAAAAAAAAI/AAAAAAAAAAA/AMoyNY-RMhg/s288-c-k-no-mo-rj-c0xffffff/photo.jpg'
  // }
];


export const ITEMS : Item[] = [
  // {
  //   title : 'כניסת שירותי אובר לישראל',
  //   author : "רודנה גולץ",
  //   group : 'התנועה הליברלית החדשה',
  //   type : InfoType.article,
  //   topic : 'תחבורה שיתופית',
  //   abstract : 'קרטל המוניות זה חבורה של מאפיונרים, מה שהעיתונאי גיא רולניק קורא לו "מיליציות מיסוי", מספקים שלל תירוצים חסרי ביסוס נגד "אובר" כדי לשכנע את אזרחי ישראל לתמוך בקרטל שמהווה עוד נתבך ביוקר המחיה בישראל, ולטעמי אין שום סיבה טובה למנוע מ"אובר" מלהכנס לשוק.',
  //   keywords : ['אובר','מוניות'],
  //   image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACXCAMAAAAvQTlLAAAAY1BMVEUBAQEAAAD////8/PxbW1v09PTv7+9NTU0xMTHe3t739/c7Ozuurq6VlZVzc3Pr6+scHBzIyMh6enqnp6ednZ0hISGJiYlVVVUSEhK2tra8vLzY2Njk5ORGRkbS0tIrKytlZWXgCJ8CAAADYUlEQVR4nO2W3daaMBBFDX9a1A9BRUQB3/8pS0IgCQrtcZVVLs72RggDk81kyEZs4N/yAe1vrdAXBn1h0BcGfWHQFwZ9YdAXBn1h0BcGfWHQFwZ9YdAXBn1h0BcGfWHQFwZ9YdAXBn1h0BcGfWHQFwZ9YazV11rzWiv0hUFfGPSFQV8Y9IXxrS+bv/QlkKDphLto91D0B82+Z/fxOicDPbAbYho3BvK1TaIorMxcL2EUlmqeLannG8I0MGFFGbn4Wy048u2Y8jXvbDLfIPY8b9tfIMShPUy7SYrdL8/lMFhRYTahjtmOznv3WWOTGeu8Bl86L/Vf5dVPXT0k7y8MQmtIjubai8rLiTnMGfvaV3z8UWRH+YynnnyXlx5SXPWAzCvKNMenTHI3V97f+gqDvq4v8okn29fWXXiDr2Q4uZd3/1nCV5uXHrrJvK62r9v7ffu8+tslUutCvvRQoJ9ofN1cEY4vfUq+yMsivm79OynV4urDRu/xo6/2fKQWywK+4vu5Q67NZOf4Olw0+WmivjL/Xeu/719xIBxfA+UgTOUV66mcU5nW87qELzexzPE1ULn15Tbcn0X6lxeXB8Vd9aLAXo+eHjpb381RXnH9Wqjf532tNKkqfGF8DUNi5Cuq7y2JvtW0rRlfldOI5Kd6KJdRXxW5KZahT7irUfvyu83HqyvJGVszvtRKvhhfUt9Z/3f610Zk0kRj+ZrvX90c6/l97HTCtazNnf2xkWX8yZf8QibNJ19Gmt2/uneazQqb9iVte8/gVIhN0ZzVQb9VVXm9imvHTdZLXVi+guJkKN77vWrFz9O0rdn9aqkWTlKX6cP37JJQeflR0tE1hlxYvpKnIamMo6Hf70NVFd/0r3brWTsr2+/7zYf+pTZ5xpdNJD74EtK/v/+ifylj+cN0wbIyvfv6sJ/sR2k29PtqvF89WvUVDpdt5KqqZ4TNvWMhrrf8ntZ1eX5VZm5y+xRY3KrCGnwdHfJGOyrkgdlPBJf2+Jv60sredwaj0+M+NTU2uvDtnoivCYuLB/zR1/+DvjDoC4O+MOgLg74w1uprrXmtFfrCoC8M+sKgLwz6wqAvDPrCoC8M+sKgLwz6wqAvDPrCoC8M+sKgLwz6wqAvDPrCoC8M+sKgLwz6wqAvjJX6+g2YfDuTrFNgNQAAAABJRU5ErkJggg==',
  //   language : Lang.he,
  //   link : 'https://liberal.co.il/uber/',
  //   dateOfCreation : new Date(2014,0,1,0,0,0,1),
  // },
  // {
  //   title : 'על החירות',
  //   author : "ג'ון סטיוארט מיל",
  //   group : '',
  //   type :InfoType.book,
  //   topic : 'פילוסופיה',
  //   abstract : 'ספרו הידוע',
  //   keywords : ['ספר','חירות'],
  //   image : 'data:image/jpeg;base64,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',
  //   language : Lang.he,
  //   link : 'http://www.shalempress.co.il/catalog/product.asp?id=84',
  //   dateOfCreation : new Date(1859,0,1,0,0,0,2),
  // },
  // {
  //   title : 'הכשל ופתרונו - צבא',
  //   author : "מוטי היינריך",
  //   group : 'קו ישר',
  //   type :InfoType.article,
  //   topic : 'צבא מקצועי',
  //   abstract : 'הצבא לכאורה לא שייך למסגרת הדיון באתר קו ישר. צה"ל אינו גוף כלכלי שמועמד להפרטה, ושרותי הגנה צריכים, גם להשקפתנו, להינתן על ידי המדינה. העלאת הדיון על צה"ל ל"קו ישר" נובעת מהשפעתו הכלכלית והחברתית על תחומי חיים רבים במדינה. השפעה מהותית. גודל הצבא מבחינת כוח אדם ותקציב אינו מאפשר להתעלם.',
  //   keywords : ['צה"ל','גיוס חובה','בטחון'],
  //   image : '',
  //   language : Lang.he,
  //   link : 'http://www.kav.org.il/%D7%94%D7%9B%D7%A9%D7%9C-%D7%95%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95/%D7%A6%D7%91%D7%90',
  //   recommended : true,
  // },
  // {
  //   title : 'אטטיזם',
  //   author : "",
  //   group : '',
  //   type :InfoType.term,
  //   topic : 'פילוסופיה',
  //   abstract : 'אטטיזם (מצרפתית, Étatisme) היא האמונה שהמדינה ובכך הממשלה צריכה להתערב או במערכת פוליטית או במערכת כלכלית, או בשתיהן. בנוסף, ישנה התערבות שאמורה להיות מוגבלת, בחיי הפרט, או מקיימת רמה גבוהה של תכנון כלכלי ריכוזי. המונח מתייחס למספר אידאולוגיות שונות, שהמשותף להן הוא ההעדפה לתכנון ריכוזי המבוצע על ידי המדינה. הגישה המנוגדת לאטטיזם בכלכלה היא מערכת של כלכלת שוק שבה המדינה נמנעת מהתערבות ומאפשרת ביזור של התכנון הכלכלי על ידי גורמים פרטיים או בלתי-ממשלתיים.\n' +
  //   '\n',
  //   keywords : [],
  //   image : '',
  //   language : Lang.he,
  //   link : '',
  // },
  // {
  //   title : `What do prices "know" that you don't`,
  //   author : "Michael Munger",
  //   group : 'Learn Liberty',
  //   type :InfoType.video,
  //   topic : 'מחירים',
  //   abstract : 'If you want to do good for the world, Prof.  Michael Munger has a piece of advice: Listen to the price system. He compares prices to a genie that knows everything in the world and tell you exactly what goods and services humanity needs most.\n',
  //   keywords : ['כלכלת שוק','יד נעלמה','פיקוח מחירים'],
  //   image : '',
  //   language : Lang.en,
  //   link : 'https://www.youtube.com/watch?v=WPy-QKXofQs',
  //   dateOfCreation : new Date(2013,0,3,0,0,0,1)
  // },
];


