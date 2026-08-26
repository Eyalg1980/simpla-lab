// localStorage מזויף, כדי לבדוק את ההמרה בלי דפדפן
function FakeLS(seed) {
  this.m = seed || {};
}
FakeLS.prototype.getItem = function (k) { return k in this.m ? this.m[k] : null; };
FakeLS.prototype.setItem = function (k, v) { this.m[k] = String(v); };
FakeLS.prototype.removeItem = function (k) { delete this.m[k]; };

function load(seed) {
  delete require.cache[require.resolve('/home/claude/site-for-upload/astro.js')];
  global.window = { localStorage: new FakeLS(seed) };
  return require('/home/claude/site-for-upload/astro.js');
}

var pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? '  ' + JSON.stringify(extra) : '')); }
}

console.log('\n-- משתמשת קיימת, מפתח ישן בלבד --');
var M = load({ 'mazag.profile': JSON.stringify({ name: 'עינת', birth: '1990-04-02' }) });
var list = M.listProfiles();
ok('הפרופיל הישן שרד ההמרה', list.length === 1 && list[0].birth === '1990-04-02', list);
ok('קיבל מזהה', !!list[0].id);
ok('loadProfile מחזיר אותו', (M.loadProfile() || {}).birth === '1990-04-02');
ok('המפתח הישן לא נמחק', !!global.window.localStorage.getItem('mazag.profile'));

console.log('\n-- מפתח ישן בלי תאריך ובלי שם --');
M = load({ 'mazag.profile': JSON.stringify({}) });
ok('לא נוצר פרופיל ריק', M.listProfiles().length === 0);
ok('loadProfile מחזיר null', M.loadProfile() === null);

console.log('\n-- אחסון ריק לגמרי --');
M = load({});
ok('רשימה ריקה', M.listProfiles().length === 0);
ok('activeId הוא null', M.activeId() === null);
var id1 = M.addProfile({ name: 'גיל', birth: '1988-07-15' });
ok('הוספה עובדת', !!id1);
ok('נעשה פעיל', M.activeId() === id1);
ok('loadProfile מחזיר אותו', M.loadProfile().name === 'גיל');

console.log('\n-- saveProfile שומר על הפעיל ולא יוצר כפילות --');
M.saveProfile({ name: 'גיל כהן', birth: '1988-07-15' });
ok('עדיין פרופיל אחד', M.listProfiles().length === 1, M.listProfiles());
ok('השם עודכן', M.loadProfile().name === 'גיל כהן');
ok('המזהה נשמר', M.loadProfile().id === id1);

console.log('\n-- תקרה של חמישה --');
for (var i = 2; i <= 5; i++) M.addProfile({ name: 'מס ' + i });
ok('חמישה נשמרו', M.listProfiles().length === 5);
ok('השישי נדחה', M.addProfile({ name: 'שישי' }) === null);
ok('עדיין חמישה', M.listProfiles().length === 5);

console.log('\n-- מחיקה --');
var all = M.listProfiles();
M.setActive(all[2].id);
ok('הפעיל השתנה', M.activeId() === all[2].id);
M.removeProfile(all[2].id);
ok('נמחק', M.listProfiles().length === 4);
ok('הפעיל לא נשאר מזהה מת', M.activeId() === M.listProfiles()[0].id);
M.listProfiles().forEach(function (p) { M.removeProfile(p.id); });
ok('אפשר לרוקן הכל', M.listProfiles().length === 0);
ok('אין פעיל', M.activeId() === null);

console.log('\n-- מזהה פעיל שהצביע על פרופיל שנמחק ידנית --');
M = load({ 'mazag.profiles': JSON.stringify([{ id: 'a', name: 'א' }, { id: 'b', name: 'ב' }]),
           'mazag.activeId': 'missing' });
ok('נופל חזרה לראשון', M.activeId() === 'a');
ok('loadProfile לא מחזיר null', (M.loadProfile() || {}).name === 'א');

console.log('\n-- ערך פגום ברשימה --');
M = load({ 'mazag.profiles': '{{{' });
ok('לא קורס', M.listProfiles().length === 0);

console.log('\n-- לשון הפנייה --');
M = load({});
var t = '{{תרגישי|תרגיש|תרגיש/י}} ש{{את|אתה|את/ה}} {{מוכנה|מוכן|מוכן/ה}}';
ok('נקבה',  M.gender(t, 'f') === 'תרגישי שאת מוכנה', M.gender(t, 'f'));
ok('זכר',   M.gender(t, 'm') === 'תרגיש שאתה מוכן', M.gender(t, 'm'));
ok('כללית', M.gender(t, 'n') === 'תרגיש/י שאת/ה מוכן/ה', M.gender(t, 'n'));
ok('ברירת מחדל כללית', M.gender(t) === M.gender(t, 'n'));
ok('טקסט בלי סימונים לא משתנה', M.gender('שלום', 'f') === 'שלום');
ok('שלישייה חסרה נופלת לאחרון', M.gender('{{א|ב}}', 'n') === 'ב');
ok('genderOf ללא בחירה', M.genderOf({}) === 'n');
ok('genderOf נקבה', M.genderOf({ gender: 'f' }) === 'f');
ok('genderOf ערך זבל', M.genderOf({ gender: 'x' }) === 'n');

console.log('\n' + pass + ' עברו, ' + fail + ' נכשלו');
process.exit(fail ? 1 : 0);
