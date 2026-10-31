
  /* ================= media ================= */
  var HF = "https://d2ol7oe51mr4n9.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/";
  var HF2 = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/";
  var W = "https://simpla-clay.higgsfield.app/assets/work/";
  // one still per chapter of the clay take: lump, camera, phone, nodes, class, city, sphere
  var FR = ["d396ae11-d1d7-47cc-b720-8a9cd79aa75c", "3e04283c-ba96-4511-a1ef-63d29f7a94b0", "fa714d3d-fafb-4ca7-aa49-51945e830f08",
    "1239b154-f44f-41fc-ab16-f06d599875d1", "78a471b0-0c9e-41d8-b695-e442d7384a90", "37cbe2e7-0dd0-48e8-b7e3-0da175d9fae6",
    "85e5717d-67b8-41a7-9bfd-41a6d14b11de"].map(function (id) { return HF + id + ".jpg"; });
  var FILM = {
    // one continuous 30s take per aspect, keyframe every 4 frames so scrubbing stays smooth
    wide: HF + "404425f7-3224-4767-8e51-a1a4725c17e7.mp4",
    tall: HF + "7ada9d0a-e524-4256-9076-97ecc6d8fd3c.mp4",
    posterTall: HF + "d2640eea-1431-4367-8fc1-2fbfe8519e90.jpg",
    cutsWide: [4.1, 10.8, 14.9, 18.0, 21.2, 26.7, 30.0],
    cutsTall: [4.6, 9.4, 15.5, 19.6, 23.6, 27.4, 30.0],
    weights: [1.2, 1.9, 1.7, 1.7, 1.7, 1.8, 1.6],
    rail: ["רעיון", "סרטים", "מוצרים", "מערכות", "צוותים", "ארגונים", "אובייקט"]
  };
  // the night TV: one 4:3 reel with a 4s cut per channel, and the clay TV it plays inside
  var REEL = {
    src: HF + "0656125a-7d63-4c25-a6d3-c476c785ff0e.mp4",
    tv: HF + "670097f7-9370-434d-9298-ba4c5417a1c7.jpg",
    starts: [0, 3, 7, 11, 15, 19, 23],
    cuts: [3, 7, 11, 15, 19, 23, 27],
    stills: ["68442d0f-eb27-4cdf-ac40-f5169ff4669d", "d207f108-fa34-4f50-aef3-9c5e84f466b1", "a92b97dd-95cc-41b1-8dd5-ce2a3de87432",
      "556a7214-b5ea-4552-82eb-016ad1948689", "0e964e39-b00d-42c5-9b4e-bfadd522fb93", "e699a5d5-a266-44ca-a210-c590309390d2",
      "63a6d016-9d22-43c4-bf19-0863ce08d9c6"].map(function (id) { return HF + id + ".jpg"; }),
    glow: ["#F7636B", "#E8913A", "#8FB8FF", "#E040FB", "#F2C27A", "#3FD3C2", "#9ED8E6"]
  };

  /* ================= content ================= */
  // ch = chapter of the film and node on the canvas, reel = cut on the TV
  var SOL = {
    studio: { tag: "STUDIO", icon: "video", ch: 1, reel: 1, title: "סרטים ב-AI", name: "Simpla Studio", label: "סרטים",
      one: "סרטים שנבנים כמו מוצר.",
      text: "סרט מותג, פרסומת, מסביר מוצר, סדרה לרשתות או סרט לתחרות. מתסריט וסטוריבורד ועד עריכה וסאונד.",
      gets: ["תסריט וסטוריבורד", "סרט מותג", "מסביר מוצר", "מסקוט", "גרסאות לרשתות"],
      who: "צוותי שיווק, סטארטאפים לפני השקה, ומותגים שצריכים הרבה וידאו בלי הפקה כבדה." },
    spec: { tag: "SPEC", icon: "image", ch: 2, reel: 2, title: "אפיון UX ומוצר", name: "Simpla Spec", label: "אפיון",
      one: "מסמך מוצר שהפיתוח יכול לבנות ממנו.",
      text: "מחקר משתמשים, זרימות, Wireframes ואב-טיפוס ב-Figma. תשע שנים של הובלת UX ומוצר ב-TipRanks מאחור.",
      gets: ["PRD", "מפות זרימה", "Wireframes", "אב-טיפוס", "מחקר משתמשים"],
      who: "סטארטאפים לפני MVP, צוותי מוצר שצריכים עוד ראש, וארגונים שבונים כלי פנימי." },
    flows: { tag: "FLOWS", icon: "flow", ch: 3, reel: 3, title: "Figma Weave ואוטומציות", name: "Simpla Flows", label: "תהליכים",
      one: "מערכת שמייצרת תוכן עקבי, לא קובץ אחד.",
      text: "הטמעת Figma Weave: פרומפט טמפלט, LoRA של שפת המותג, Workflows ואפליקציות שהצוות מריץ בלחיצה. ועוד אוטומציות וכלים פנימיים.",
      gets: ["Workflows ב-Weave", "LoRA למותג", "Design Apps", "ספריית פרומפטים", "תיעוד"],
      who: "צוותי שיווק ותוכן, סוכנויות, וכל מי שמייצר הרבה ויזואל ורוצה שייראה אותו דבר בכל פעם." },
    lab: { tag: "LAB", icon: "users", ch: 4, reel: 4, title: "סדנאות לצוותים", name: "Simpla Lab", label: "הדרכה",
      one: "שלוש שעות, תוצר אחד לכל משתתף.",
      text: "סדנה, יום מרוכז או סדרת מפגשים. למעצבים, אנשי שיווק, עורכים ומנהלים, עם ערכת פרומפטים בעברית.",
      gets: ["סדנה מעשית", "יום מרוכז", "סדרת מפגשים", "ערכת פרומפטים", "תרגילים"],
      who: "מחלקות שיווק, עיצוב, הדרכה ו-HR. צוותים שכבר מנסים, ורוצים לעשות את זה נכון." },
    adopt: { tag: "ADOPT", icon: "city", ch: 5, reel: 5, title: "הטמעת AI בארגון", name: "Simpla Adopt", label: "הטמעה",
      one: "AI שהעובדים באמת משתמשים בו.",
      text: "אבחון, מפת הזדמנויות, בחירת כלים, כללי עבודה, פיילוט ומדידה. גם ברשויות מקומיות ובמגזר הציבורי.",
      gets: ["אבחון", "מפת הזדמנויות", "בחירת כלים", "מדיניות שימוש", "פיילוט", "מדידה"],
      who: "ארגונים, רשויות מקומיות ומגזר ציבורי שקיבלו הנחיה מלמעלה ומחפשים דרך מעשית." },
    guide: { tag: "GUIDE", reel: 6, extra: true, title: "ייעוץ ומנטורינג", name: "Simpla Guide", short: "ליווי חודשי",
      one: "מישהו מנוסה לצידכם, שעה בשבוע או כשצריך." },
    academy: { tag: "ACADEMY", reel: 4, extra: true, title: "תוכניות לימוד", name: "Simpla Academy", short: "תוכנית לימודים",
      one: "סילבוס, מערכי שיעור והכשרת מרצים." }
  };
  var CORE = ["studio", "spec", "flows", "lab", "adopt"];
  var ALL = CORE.concat(["guide", "academy"]);
  var NODES = [{ id: "in", kind: "input" }].concat(CORE.map(function (id) { return { id: id, kind: "sol" }; })).concat([{ id: "out", kind: "output" }]);

  var AUDIENCES = [
    { id: "startup", chip: "סטארטאפ", name: "מהשקה לסרט", problem: "יש לנו מוצר, או רעיון למוצר, ואין זמן לבזבז על ניחושים. צריך להבין מה בונים ולהראות אותו לעולם.",
      mods: ["spec", "studio", "flows"], outcome: "אפיון ל-MVP, סרט השקה, מסקוט ומערכת תוכן בסיסית ב-Figma Weave.", first: "שיחת אבחון, ואחריה אפיון MVP בתוך כמה שבועות." },
    { id: "marketing", chip: "צוות שיווק", name: "מפעל תוכן", problem: "הצוות צריך יותר ויזואל, יותר מהר, ובלי לאבד את המותג בדרך.",
      mods: ["flows", "lab", "guide"], outcome: "צינור תוכן ב-Figma Weave שבנוי על המותג שלכם, סדנה לצוות, וליווי חודשי עד שזה רץ לבד.", first: "מיפוי סוגי התוכן שאתם מייצרים היום, ובחירת הראשון שהופך למערכת." },
    { id: "agency", chip: "סוכנות או סטודיו", name: "סוכנות AI-Native", problem: "הלקוחות כבר שואלים על AI, והצוות לומד תוך כדי פרויקט.",
      mods: ["lab", "flows", "guide"], outcome: "סדנה מתקדמת ב-Figma Weave וב-Higgsfield, ספריית Workflows משותפת, וליווי בפרויקט הראשון.", first: "סדנה לצוות הקריאייטיב על בריף אמיתי של לקוח." },
    { id: "public", chip: "רשות או מגזר ציבורי", name: "עיר שמסבירה את עצמה", problem: "יש הנחיה מלמעלה, ויש עובדים שעוד לא יודעים מאיפה להתחיל.",
      mods: ["adopt", "studio", "spec", "lab"], outcome: "תוכנית הטמעה, סרטי הסבר לתושבים, אפיון של שירות דיגיטלי, וסדנאות לעובדים.", first: "אבחון קצר עם הנהלה ושני צוותים, ומפת הזדמנויות כתובה." },
    { id: "edu", chip: "מוסד לימודים", name: "תוכנית AI יצירתי", problem: "הסטודנטים כבר משתמשים ב-AI. התוכנית עוד לא.",
      mods: ["academy", "lab"], outcome: "סילבוס מוכן להפעלה, הכשרת מרצים, וסדנאות לסטודנטים.", first: "פגישה עם רכזי התוכנית ובחירה של קורס אחד לפיילוט." }
  ];
  var DEFAULT_PROMPT = "יש לנו רעיון, צוות או תהליך שתקוע. אנחנו לא בטוחים מאיפה מתחילים.";

  var TOUR = [
    { img: "{{WEAVE_IMG}}wf-canvas.webp", tab: "Canvas", file: "product-shoot.weave", title: "Workflow על ה-Canvas",
      text: "פרומפט ותמונת מוצר מזינים שלושה Nodes, וכל אחד מחזיר וריאציה אחרת. הבקבוק והלוגו נשארים כמו שהם, הדמות זזה בין מקומות ותנוחות." },
    { img: "{{WEAVE_IMG}}wf-lora.webp", tab: "LoRA", file: "brand-language.weave", title: "חיבור מודל מאומן",
      text: "פרומפט טמפלט ו-LoRA של שפת המותג נכנסים יחד למודל התמונה. את השפה לא מסבירים מחדש בכל פעם, היא כבר בפנים." },
    { img: "{{WEAVE_IMG}}wf-screens.webp", tab: "סדרה", file: "app-screens.weave", title: "שכפול לתוצרים",
      text: "אותה LoRA, ופרומפט אחר לכל מסך: סדרה שלמה של מסכי אפליקציה, כולם באותה שפה ויזואלית." },
    { img: "{{WEAVE_IMG}}wf-app.webp", tab: "Design App", file: "product-shoot.app", title: "אפליקציה לצוות",
      text: "הצוות רואה רק את שדות הקלט, מחליף תמונה או פרומפט, ומקבל תוצר בלחיצה. גם מי שמעולם לא פתח את Weave מריץ אותה." }
  ];
  var PIPE = [
    ["מיפוי", "אילו נכסים הצוות מייצר שוב ושוב, ואיפה AI חוסך הכי הרבה."],
    ["Visual Brainstorming", "ממערכי המותג לקטלוג של מוטיבים, טקסטורות וצבעים."],
    ["Prompt Template ו-Crafting", "שפה ויזואלית מדויקת, בצמוד לצוות העיצוב."],
    ["Model Training", "אימון LoRA על השפה שנבנתה."],
    ["Workflows ואפליקציות", "תהליך קבוע לכל משימה חוזרת, וממשק פשוט לצוות."],
    ["הכשרה והעברה", "הצוות לומד לבנות ולתחזק בעצמו, בלי תלות חיצונית."]
  ];
  var WV_GETS = [
    "ספריית Workflows מסודרת ומתועדת, לכל משימה שחוזרת",
    "LoRA או Style System שלמד את שפת המותג שלכם",
    "Prompt Templates לכל סוג של נכס, עם משתנים",
    "אפליקציות Design App, שגם מי שלא נגע ב-Weave מריץ",
    "Character Sheet לדמות או לפרזנטור של המותג",
    "הכשרה לצוות, כדי שימשיך לבנות ולתחזק לבד"
  ];

  var WORKS = [
    { id: "savior", nodes: ["studio"], kind: "סרט", title: "תסמונת המושיע", sub: "סרט לפסטיבל הסרטים של Higgsfield", len: "3:16",
      src: HF + "5056b375-f0d0-446e-bed9-bbfa21314504.mp4", preview: HF + "2e34e853-6cd5-4ddd-bd03-74b3b0c5e87e.mp4",
      poster: HF + "4d8b91e4-2d4a-4c3d-8f73-15b6a5d7215a.jpg",
      text: "סרט קצר על הצורך להיות זה שמציל את כולם. נכתב, בוים ונערך אצלנו לפסטיבל הסרטים של Higgsfield.",
      gets: ["תסריט", "בימוי", "עקביות דמויות", "עריכה וסאונד"] },
    { id: "wolt", nodes: ["studio"], kind: "ספוט", title: "העיר שקפאה", sub: "ספוט ספק לוולט, לאדתון של Higgsfield ו-ADWEEK", len: "1:00",
      src: HF + "ad33e834-3c7c-4d93-b707-eabf7a6dc344.mp4", preview: HF + "bf99884f-039d-4461-a77a-729665ea7c11.mp4",
      poster: HF + "c3e02351-94b7-4279-a5d5-26ccb244a80d.jpg",
      text: "עיר שלמה מחימר קפאה, ושליח אחד על קטנוע צובע אותה מחדש רחוב אחרי רחוב, עד שהוא דופק בדלת הנכונה. ספוט ספק בקליי, לא בהזמנת וולט.",
      gets: ["קונספט ותסריט", "עולם קליי", "15 שוטים", "קריינות וסאונד"] },
    { id: "askcity", nodes: ["studio","spec"], kind: "סרט מוצר", client: "Juganu", title: "Ask the City", sub: "קונספט מוצר ל-Juganu, בחימר", len: "0:53",
      src: HF + "afccf922-4257-4ee1-9786-46f6f1cfe853.mp4", preview: HF + "06aedb44-94b9-4be1-8bba-1d665110a3b0.mp4",
      poster: HF + "46fc5455-207b-4db5-bb14-123e1769f446.jpg",
      text: "כל עמוד תאורה בעיר כבר רואה. מה אם הוא גם יכול לענות? שלושה אנשים בעירייה שואלים שאלה במילים פשוטות, ומקבלים בחזרה תשובה, כלל קבוע והחלטה. עולם שלם מחימר.",
      gets: ["קונספט מוצר", "תסריט", "עולם חימר", "ממשק בתוך הסרט", "עריכה וסאונד"] },
    { id: "concert", nodes: ["studio","spec"], kind: "סרט מוצר", client: "Juganu", title: "Concert Night", sub: "קונספט להשקת Juganu AI, ריאליסטי", len: "1:34",
      src: HF + "da264730-b996-4900-a122-76803f83cb37.mp4", preview: HF + "0e3c56c0-1295-47c6-a27a-e5ba82bc77d9.mp4",
      poster: HF + "b2f7076a-e27c-4893-b9b6-f1d214053fe7.jpg",
      text: "ערב הופעה של 12,000 איש בפארק העירוני. דניאל ממחלקת התפעול שואל שאלות פשוטות, והתשובות מגיעות מהפנסים שברחוב: תאורה, תנועה, ביטחון ואינטרנט אלחוטי. כל המספרים בסרט הם נתוני דוגמה.",
      gets: ["קונספט להשקה", "תסריט", "מסכי מוצר בתוך הסרט", "עקביות דמויות", "קריינות ומוזיקה"] },
    { id: "instructions", nodes: ["studio"], kind: "סרט", title: "ההוראות", sub: "סרט קצר", len: "4:01",
      src: HF + "4159fe62-25df-4f2e-9017-7b08e492e7f6.mp4", preview: HF + "5205d1e0-f3b5-4f16-a6eb-4b2e0e9a8bf2.mp4",
      poster: HF + "393d0e8e-577f-41f2-a79a-729c93e4fe56.jpg",
      text: "איש בן שמונים ושתיים מרכיב לבד רהיט מארגז, והקול הדיגיטלי שקורא לו את ההוראות מתחיל להוסיף דברים שלא כתובים במדריך.",
      gets: ["תסריט", "בימוי", "דמות אחת לאורך כל הסרט", "קריינות וסאונד"] },
    { id: "tipranks", nodes: ["spec"], kind: "מוצר", client: "TipRanks", title: "דף הבית של האתר", loop: true,
      src: W + "tipranks.mp4", preview: W + "tipranks.mp4", poster: W + "tipranks-poster.jpg",
      text: "להפוך כמות עצומה של דאטה פיננסי לחוויה ידידותית, ממותגת ומובנת במבט אחד.",
      gets: ["אידיאציה", "Wireframes", "עיצוב קונספט", "מחקר UX", "גישת MVP"] },
    { id: "juganu", nodes: ["spec","adopt"], kind: "מוצר", client: "Juganu", title: "דשבורד לעיר חכמה", loop: true,
      src: W + "juganu.mp4", preview: W + "juganu.mp4", poster: W + "juganu-poster.jpg",
      text: "מערכת שמאפשרת לרשויות לראות מה קורה בעיר 24/7, ולשפר בעזרתה את חיי התושבים.",
      gets: ["מחקר מוצר", "אב-טיפוס", "מחקר UX", "עיצוב UI ו-UX", "Style guide"] },
    { id: "night", nodes: ["studio"], kind: "סרט", title: "שידורי לילה", sub: "סוף השידורים: מונטאז׳ מכל הסרטים שלנו", len: "1:51",
      src: HF + "43db6f2b-0b62-4cde-bf8c-76dd27f6d68b.mp4", preview: HF + "021c4623-13fd-4b8f-919a-3fd841a1322b.mp4",
      poster: HF + "594c3ea7-650b-4f9e-bb90-293de8d0a907.jpg",
      text: "מישהו מזפזפ בשתיים בלילה. כל ערוץ הוא רסיס מאחד הסרטים שלנו, וכל דמות בו מנסה שיבינו אותה.",
      gets: ["קונספט", "מונטאז׳", "עריכה", "סאונד"] },
    { id: "whofor", nodes: ["studio","flows"], kind: "סרט", title: "בשביל מי זה", sub: "אנתולוגיה מהמנוע היומי", len: "2:53",
      src: HF + "b1b4150d-d826-4789-bd3c-c12357b868f2.mp4", preview: HF + "ffc80726-b6ff-49fd-bee3-e333874b144c.mp4",
      poster: HF + "31744d12-2f0e-4477-84ac-1a44bbde17f2.jpg",
      text: "עולמות של חימר וניאון שנולדו במנוע הסרטים היומי שלנו, ונערכו לסרט אחד.",
      gets: ["מנוע יומי", "Workflows", "עולם ודמויות", "עריכה"] },
    { id: "burger", nodes: ["studio"], kind: "סדרה", title: "ההמבורגר מניו", sub: "ביוגרפיה של אובייקט, פרק 1", len: "1:00", shape: "v",
      src: HF + "948e857c-c826-478d-8f5e-c9a6e71e3748.mp4", preview: HF + "19b426d0-72b0-4d5b-8ab8-6eab47abf955.mp4",
      poster: HF + "a0171652-f00b-4ba8-bb88-2510cc9f6433.jpg",
      text: "הפרק הראשון בסדרה שמספרת את הביוגרפיה של חפצים יומיומיים. אנכי, לרשתות.",
      gets: ["סדרה", "פורמט אנכי", "עולם ויזואלי"] },
    { id: "undo", nodes: ["studio"], kind: "סדרה", title: "Undo", sub: "ביוגרפיה של אובייקט, פרק 2", len: "1:03", shape: "v",
      src: HF + "f1e27d1a-e2f1-4845-87b3-631bb5ec03f0.mp4", preview: HF + "b07a8153-1f81-49d5-b3fe-2313f10f4809.mp4",
      poster: HF + "459a3cf6-f74c-4445-9f2b-92d4bafa71c7.jpg",
      text: "בדצמבר 1976 שני חוקרים ב-IBM כתבו משפט אחד על האפשרות לקחת פקודה בחזרה. דקה בחימר על הכפתור שנבנה כדי להרגיע אותנו.",
      gets: ["סדרה", "פורמט אנכי", "מחקר היסטורי"] },
    { id: "magnifier", nodes: ["studio"], kind: "סדרה", title: "הזכוכית המגדלת", sub: "ביוגרפיה של אובייקט, פרק 3", len: "0:40", shape: "v",
      src: HF + "53e43201-9175-4088-bc8c-847f04513ffe.mp4", preview: HF + "117e6c54-72c3-4d99-952f-f9aa707d9871.mp4",
      poster: HF + "522e5361-9e89-4e09-a3ef-57bcf28e7222.jpg",
      text: "ב-1987 נבחרה ב-NeXT זכוכית מגדלת לאייקון החיפוש, כי חיפוש הוא מחט בערימת שחת. האייקון שרד ארבעה עשורים, והתיבה שמתחתיו הולכת ונעלמת.",
      gets: ["סדרה", "פורמט אנכי", "מחקר היסטורי"] },
    { id: "darkmode", nodes: ["studio"], kind: "סדרה", title: "דארק מוד", sub: "ביוגרפיה של אובייקט, פרק 5", len: "0:59", shape: "v",
      src: HF + "79bf80b7-7750-4d1a-8e12-378a4255322c.mp4", preview: HF + "17832f35-4a63-4de6-b8e5-80b89aba6953.mp4",
      poster: HF + "e99eaefb-c320-4fda-9188-4e165e3f5828.jpg",
      text: "המסך נולד חשוך. ב-1973 זירוקס הלבינו אותו, ובין 2016 ל-2019 כולנו החזרנו את השחור. 59 שניות בחימר.",
      gets: ["סדרה", "פורמט אנכי", "מחקר היסטורי"] },
    { id: "frame", nodes: ["studio"], kind: "סדרה", title: "הפריים", sub: "ביוגרפיה של אובייקט, פרק 6", len: "1:06", shape: "s",
      src: HF + "a960e971-3998-4480-a93d-76350b26344e.mp4", preview: HF + "40c0cbd1-fc41-4c84-8863-ca49432f98ac.mp4",
      poster: HF + "9a682b61-8caa-4cac-b102-be6a9e86a492.jpg",
      text: "פרק נוסף בסדרת הביוגרפיות של חפצים. ריבועי, לפיד.",
      gets: ["סדרה", "פורמט ריבועי", "סאונד"] },
    { id: "tease", nodes: ["spec"], kind: "מוצר", client: "Tease", title: "ערכת השראה ל-UX", loop: true,
      src: W + "tease.mp4", preview: W + "tease.mp4", poster: W + "tease-poster.jpg",
      text: "להראות את תהליך ה-UX שמאחורי מוצרים גמורים, בצורה ברורה וסוחפת, ללמידה עצמית.",
      gets: ["אידיאציה", "מחקר UX", "עיצוב", "אנימציה", "HTML5 canvas", "סיפור"] },
    { id: "future", nodes: ["studio","lab"], kind: "סרט", title: "העתיד של ללמוד", sub: "סרט קצר", len: "1:00",
      src: HF + "d5cef077-7d70-4f33-8af3-3c0e441e24b8.mp4", preview: HF + "90a8dfc7-731f-4d15-947c-ee2d6da4e0af.mp4",
      poster: HF + "5a33bc46-4b7d-4f72-b3c2-7e5fa7d47c0f.jpg",
      text: "סרט קצר על כיתה שבה הידע נהיה משהו שאפשר להחזיק ביד.",
      gets: ["תסריט", "בימוי", "הפקה ב-AI"] },
    { id: "abstract", nodes: ["flows"], kind: "סרט אתר", title: "מאבסטרקט לאובייקט", sub: "הסרט של האתר הזה, טייק אחד", len: "0:30",
      src: HF2 + "hf_20261016_180938_5d71d29f-22e3-485e-95d9-b3e4f1e827ba.mp4", preview: HF + "518c25f6-7b80-4483-93bb-0e43f2fc0154.mp4",
      poster: FR[6],
      text: "שלושים שניות של חימר בטייק אחד. בראש העמוד הגלילה מריצה אותו קדימה ואחורה.",
      gets: ["טייק אחד", "פריימי מפתח", "וידאו לגלילה"] },
    { id: "toolkit", nodes: ["flows"], kind: "סרט אתר", title: "ערכת הכלים", sub: "סרט אתר בטייק אחד", len: "0:25",
      src: HF2 + "hf_20261016_133904_4d891e10-0a24-4425-9774-ddecfdb03021.mp4", preview: HF + "37cb15dc-34a7-416a-bd5d-6f2939979813.mp4",
      poster: HF + "5aaab9d4-184b-4e1a-be46-0cbd77ae3393.jpg",
      text: "סרט אתר בטייק אחד, שנבנה כדי שהגלילה תריץ אותו.",
      gets: ["טייק אחד", "וידאו לגלילה"] },
    { id: "paper", nodes: ["flows"], kind: "סרט אתר", title: "סימפלה בנייר", sub: "סרט אתר בטייק אחד", len: "0:25",
      src: HF2 + "hf_20261016_090903_1c9acbc6-5ddc-4157-968c-12e20ea7061d.mp4", preview: HF + "f70d21ea-3855-415e-8181-e60e50009c17.mp4",
      poster: HF + "475904ce-4564-49ec-90aa-14afa3a5f4c8.jpg",
      text: "סרט אתר בטייק אחד, בעולם של נייר.",
      gets: ["טייק אחד", "וידאו לגלילה"] }
  ];

  /* ================= interface strings ================= */
  var T = {
    lang: "he",
    mailHello: "שלום,\nבנינו מסלול באתר וזה מה שאנחנו צריכים:\n",
    mailAbout: "\n\nקצת עלינו:\n",
    mailSubjectRoute: "מסלול מהאתר",
    mailSubjectBroadcast: "השידור שלנו",
    routeAria: function (n) { return "המסלול שלכם, " + n + " צמתים"; },
    chapter: "פרק ",
    node: "צומת ",
    channel: "ערוץ ",
    addToRoute: "הוסיפו למסלול",
    inYourRoute: "במסלול שלכם",
    inRoute: "במסלול",
    inRouteRemove: "במסלול. לחצו להסרה",
    watch: "לצפות: ",
    inputTitle: "הקלט שלכם",
    inputOne: "בחרו למעלה מאיפה אתם מגיעים, והמסלול יסומן לבד.",
    outputTitle: "האובייקט",
    outputOne: "מה שנשאר אצלכם: צוות שמפעיל הכול לבד.",
    detailsSuffix: ", פרטים",
    details: "פרטים",
    works: "עבודות",
    toAir: "לשידור",
    changeInput: "שינוי הקלט",
    yourRoute: "המסלול שלכם",
    emptyRoute: "עוד לא בחרתם צמתים. סמנו ״הוסיפו למסלול״ על צומת, או בחרו למעלה מאיפה אתם מגיעים.",
    remove: "להסיר: ",
    extras: "תוספות לכל מסלול:",
    sendUs: "שלחו לנו",
    clear: "ניקוי",
    inspInput: "כל פרויקט מתחיל במשפט אחד: מה יש לכם, ומה תקוע. בחרו מאיפה אתם מגיעים, והמסלול יסומן על הקנבס.",
    inspOutput: "אותו חומר שנכנס כרעיון, יוצא כסרט, מוצר, מערכת וצוות שמפעיל הכול לבד. מה שבחרתם עולה בסוף העמוד לשידור, ערוץ לכל צומת.",
    noNodes: "עוד לא נבחרו צמתים",
    toWeave: "לאזור Figma Weave",
    all: "הכול",
    tvWatch: function (t) { return "לצפות בעבודות של " + t + ", עם סאונד"; },
    zapAria: "לזפזף לערוץ הבא",
    zap: "זפזפו",
    endSlot: "סוף השידורים: שידורי לילה",
    leadBuilt: function (n) {
      return (n === 1 ? "בניתם ערוץ אחד." : "בניתם " + n + " ערוצים.") +
        " כל צומת שבחרתם משודר כאן. זפזפו בשלט, ולחצו על המסך כדי לצפות בעבודות עם סאונד.";
    },
    leadEmpty: ["עוד לא בניתם מסלול, אז הערב משודרים כל הערוצים. ", "בנו מסלול בקנבס", ", והשידור יתחלף לשלכם."],
    menu: [["#film", "הסרט", "FILM"], ["#canvas", "המסלול שלכם", "FLOW"], ["#weave", "Figma Weave", "WEAVE"], ["#work", "עבודות", "WORK"],
      ["#clients", "לקוחות", "CLIENTS"], ["#teaching", "הוראה", "TEACHING"], ["#about", "אודות", "ABOUT"], ["#onair", "בשידור", "ON AIR"], ["#contact", "קשר", "CONTACT"]]
  };
