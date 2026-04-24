require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('./db');
const User = require('./models/User');
const Service = require('./models/Service');
const Project = require('./models/Project');
const CompanyInfo = require('./models/CompanyInfo');
const { DEFAULTS: COMPANY_DEFAULTS } = require('./routes/companyInfo');

const services = [
  {
    title: 'נגרות לבניין',
    slug: 'carpentry',
    icon: '🪚',
    shortDescription: 'פתרונות נגרות מותאמים אישית לפרויקטים מסחריים ופרטיים.',
    description:
      'החברה מתמחה בנגרות לבניין ברמת גימור גבוהה – ייצור והתקנה של דלתות, ארונות, חיפויי עץ, מטבחים, ספריות ורהיטים מותאמים. אנו עובדים עם אדריכלים, קבלנים ומזמינים פרטיים החל משלב התכנון ועד ההתקנה באתר.',
    order: 1,
  },
  {
    title: 'חיפוי HPL – פנים וחוץ',
    slug: 'hpl-cladding',
    icon: '🏢',
    shortDescription: 'חיפויי HPL עמידים ואיכותיים לקירות חוץ ולמרחבים פנימיים.',
    description:
      'ביצוע עבודות חיפוי ב-HPL (High Pressure Laminate) על חזיתות בניינים, לובאים ומשרדים. חומרי גמר עמידים בפני לחות, קרינת UV ושריטות, עם מגוון רחב של גוונים ומרקמים בהתאם לתכנון האדריכלי.',
    order: 2,
  },
  {
    title: 'חיפוי לובי',
    slug: 'lobby-cladding',
    icon: '🏛️',
    shortDescription: 'עיצוב וביצוע חיפויי לובי בחומרים מגוונים – עץ, HPL, קוריאן ועוד.',
    description:
      'אנו מעצבים ומבצעים חיפויי לובי מרשימים בבנייני מגורים ומסחר. שילוב של חומרים – עץ מלא, פורניר, HPL, קוריאן, אבן ומתכת – להשגת מראה ייחודי התואם את אופי הבניין ואת דרישות המזמין.',
    order: 3,
  },
  {
    title: 'ייצור מוצרי עץ',
    slug: 'wood-products',
    icon: '🪵',
    shortDescription: 'ייצור רהיטים ומוצרי עץ מותאמים אישית במפעל שלנו.',
    description:
      'המפעל שלנו בגבעת אלה מצויד במכונות CNC ובטכנולוגיות ייצור מתקדמות. אנו מייצרים רהיטים ומוצרי עץ מותאמים אישית לפרויקטים מורכבים, תוך שמירה על לוחות זמנים ותקני איכות.',
    order: 4,
  },
  {
    title: 'ייעוץ וליווי פרויקטים',
    slug: 'consulting',
    icon: '📐',
    shortDescription: 'ליווי הנדסי מקצועי משלב התכנון ועד המסירה.',
    description:
      'צוות המהנדסים שלנו מלווה פרויקטים מורכבים משלב הסקיצה, דרך בחירת חומרים, תכנון ייצור, לוגיסטיקה והתקנה. אנו מציעים פתרונות יעילים שמתחשבים בעלות, בזמן ובאיכות הגמר.',
    order: 5,
  },
];

const projects = [
  {
    title: 'חיפוי לובי – מגדל מגורים, חיפה',
    slug: 'lobby-haifa-tower',
    category: 'חיפוי לובי',
    location: 'חיפה',
    year: 2023,
    summary: 'חיפוי לובי משולב עץ אלון ו-HPL בגוון גרפיט, מגדל מגורים יוקרתי.',
    description:
      'פרויקט חיפוי לובי במגדל מגורים חדש בחיפה. שילוב של פורניר אלון מוברש עם פאנלי HPL בגוון גרפיט, תאורה אינטגרלית ושילוב מתכת בגוון זהב מט.',
    imageUrl: '',
    order: 1,
    isFeatured: true,
  },
  {
    title: 'חזית HPL – מבנה משרדים, עפולה',
    slug: 'hpl-facade-afula',
    category: 'חיפוי חוץ',
    location: 'עפולה',
    year: 2022,
    summary: 'חזית חיצונית בחיפוי HPL עמיד לתנאי חוץ, מבנה משרדים בן 4 קומות.',
    description:
      'חיפוי חזית חיצונית של בניין משרדים בעפולה בלוחות HPL ייעודיים לחוץ. כולל מערכת תליה מאווררת, פרטי גמר סביב חלונות ופתרונות איטום.',
    imageUrl: '',
    order: 2,
    isFeatured: true,
  },
  {
    title: 'נגרות פנים – וילה פרטית, עמק יזרעאל',
    slug: 'private-villa-carpentry',
    category: 'נגרות לבניין',
    location: 'עמק יזרעאל',
    year: 2023,
    summary: 'ייצור והתקנת כל עבודות הנגרות בוילה פרטית – מטבח, ארונות, ספריות ודלתות.',
    description:
      'ליווי מלא של פרויקט נגרות בווילה פרטית בעמק יזרעאל. מטבח עם איי עבודה, ארונות חדר רחצה, ספריה מעץ מלא ודלתות פנים בעיצוב ייחודי.',
    imageUrl: '',
    order: 3,
    isFeatured: true,
  },
  {
    title: 'חיפוי קירות – בית חולים, צפון',
    slug: 'hospital-walls',
    category: 'חיפוי פנים',
    location: 'אזור הצפון',
    year: 2022,
    summary: 'חיפוי קירות במחלקות אשפוז בחומרים אנטי-בקטריאליים.',
    description:
      'עבודת חיפוי קירות במחלקות אשפוז בבית חולים באזור הצפון. שימוש בחומרים עמידים, קלים לניקוי ואנטי-בקטריאליים, בהתאם לתקני משרד הבריאות.',
    imageUrl: '',
    order: 4,
  },
  {
    title: 'פרויקט מסחרי – קניון, צפון',
    slug: 'mall-north',
    category: 'חיפוי מסחרי',
    location: 'אזור הצפון',
    year: 2021,
    summary: 'חיפויי חזיתות חנויות ומרכיבי עיצוב במרכז מסחרי.',
    description:
      'ביצוע חיפויי חזיתות חנויות ומרכיבי עיצוב פנים במרכז מסחרי באזור הצפון. פרויקט רב-שלבי שכלל תיאום עם דיירים, לוחות זמנים צפופים ושמירה על פעילות רציפה.',
    imageUrl: '',
    order: 5,
  },
  {
    title: 'לובי בניין מגורים – יוקנעם',
    slug: 'yokneam-residential',
    category: 'חיפוי לובי',
    location: 'יוקנעם',
    year: 2024,
    summary: 'עיצוב וביצוע לובי מודרני במגדל מגורים חדש.',
    description:
      'עיצוב וביצוע לובי במגדל מגורים חדש ביוקנעם. חיפוי קיר מרכזי בפורניר אגוז, תקרת עץ עם תאורה אינטגרלית ודלתות כניסה למתחמים משותפים.',
    imageUrl: '',
    order: 6,
  },
];

async function seed() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@ys-engineers.co.il').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 12);
  await User.updateOne(
    { email },
    { $set: { email, passwordHash, role: 'admin' } },
    { upsert: true }
  );
  console.log(`[seed] admin user ready: ${email}`);

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log(`[seed] inserted ${services.length} services`);

  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`[seed] inserted ${projects.length} projects`);

  await CompanyInfo.updateOne(
    { key: 'default' },
    { $set: { key: 'default' }, $setOnInsert: COMPANY_DEFAULTS },
    { upsert: true }
  );
  console.log('[seed] company info ready');

  await mongoose.disconnect();
  console.log('[seed] done');
}

seed().catch((err) => {
  console.error('[seed] failed', err);
  process.exit(1);
});
