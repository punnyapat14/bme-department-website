// ==========================================
// 1. ข้อมูลเกรดและเงื่อนไข
// ==========================================
export const GRADE_POINTS = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0, 'Fa': 0, 'Fe': 0, 'W': null, 'S': null, 'U': null, 'ยังไม่ระบุ': null };
export const PASSING_GRADES = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'S'];

// ==========================================
// 2. ฐานข้อมูลรายวิชาทั้งหมด (Course Database)
// ==========================================
export const COURSE_LIST = [
  // --- หมวดวิชาศึกษาทั่วไป ---
  { id: '080103001', nameTH: 'ภาษาอังกฤษ 1', nameEN: 'English I', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'gened' },
  { id: '080103002', nameTH: 'ภาษาอังกฤษ 2', nameEN: 'English II', credit: 3, creditText: '3(3-0-6)', prereq: ['080103001'], coreq: null, type: 'gened' },
  { id: '080203914', nameTH: 'ผู้ประกอบการนวัตกรรม', nameEN: 'Innovative Technopreneurs', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'gened' },
  { id: '080303701', nameTH: 'กระบวนการคิดเชิงออกแบบ', nameEN: 'Design Thinking', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'gened' },
  { id: '0803035XX', nameTH: 'วิชาเลือกกีฬาและนันทนาการ', nameEN: 'Sport and Recreation', credit: 1, creditText: '1(0-2-1)', prereq: [], coreq: null, type: 'gened' },
  { id: 'GENED-ELEC1', nameTH: 'วิชาเลือกศึกษาทั่วไป 1', nameEN: 'General Education Elective 1', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'gened' },
  { id: 'GENED-ELEC2', nameTH: 'วิชาเลือกศึกษาทั่วไป 2', nameEN: 'General Education Elective 2', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'gened' },
  { id: 'GENED-ELEC3', nameTH: 'วิชาเลือกศึกษาทั่วไป 3', nameEN: 'General Education Elective 3', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'gened' },
  { id: 'GENED-ELEC4', nameTH: 'วิชาเลือกศึกษาทั่วไป 4', nameEN: 'General Education Elective 4', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'gened' },

  // --- หมวดวิชาเฉพาะ: แกน ---
  { id: '040113001', nameTH: 'เคมีสำหรับวิศวกร', nameEN: 'Chemistry for Engineers', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'core' },
  { id: '040113002', nameTH: 'ปฏิบัติการเคมีสำหรับวิศวกร', nameEN: 'Chemistry Laboratory for Engineers', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040113001', type: 'core' },
  { id: '040203111', nameTH: 'คณิตศาสตร์วิศวกรรม 1', nameEN: 'Engineering Mathematics I', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'core' },
  { id: '040203112', nameTH: 'คณิตศาสตร์วิศวกรรม 2', nameEN: 'Engineering Mathematics II', credit: 3, creditText: '3(3-0-6)', prereq: ['040203111'], coreq: null, type: 'core' },
  { id: '040303005', nameTH: 'ฟิสิกส์ 1', nameEN: 'Physics I', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'core', isEng: true },
  { id: '040303006', nameTH: 'ปฏิบัติการฟิสิกส์ 1', nameEN: 'Physics Laboratory I', credit: 1, creditText: '1(0-2-1)', prereq: [], coreq: '040303005', type: 'core', isEng: true },
  { id: '040303007', nameTH: 'ฟิสิกส์ 2', nameEN: 'Physics II', credit: 3, creditText: '3(3-0-6)', prereq: ['040303005', '040303006'], coreq: null, type: 'core', isEng: true },
  { id: '040303008', nameTH: 'ปฏิบัติการฟิสิกส์ 2', nameEN: 'Physics Laboratory II', credit: 1, creditText: '1(0-2-1)', prereq: [], coreq: '040303007', type: 'core', isEng: true },
  { id: '040333101', nameTH: 'อิเล็กทรอนิกส์ 1', nameEN: 'Electronics I', credit: 3, creditText: '3(3-0-6)', prereq: ['040333113'], coreq: null, type: 'core' },
  { id: '040333102', nameTH: 'ปฏิบัติการอิเล็กทรอนิกส์ 1', nameEN: 'Electronics Laboratory I', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040333101', type: 'core' },
  { id: '040333103', nameTH: 'อิเล็กทรอนิกส์ 2', nameEN: 'Electronics II', credit: 3, creditText: '3(3-0-6)', prereq: ['040333101'], coreq: null, type: 'core' },
  { id: '040333104', nameTH: 'ปฏิบัติการอิเล็กทรอนิกส์ 2', nameEN: 'Electronics Laboratory II', credit: 1, creditText: '1(0-3-1)', prereq: ['040333102'], coreq: '040333103', type: 'core' },
  { id: '040333105', nameTH: 'คณิตศาสตร์วิศวกรรมชีวการแพทย์', nameEN: 'Biomedical Engineering Mathematics', credit: 3, creditText: '3(3-0-6)', prereq: ['040203112'], coreq: null, type: 'core', isEng: true },
  { id: '040333106', nameTH: 'กายวิภาคศาสตร์และสรีรวิทยาเบื้องต้น', nameEN: 'Introduction to Anatomy and Physiology', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'core' },
  { id: '040333107', nameTH: 'กายวิภาคศาสตร์และสรีรวิทยา', nameEN: 'Anatomy and Physiology', credit: 3, creditText: '3(3-0-6)', prereq: ['040333106'], coreq: null, type: 'core' },
  { id: '040333108', nameTH: 'ปฏิบัติการกายวิภาคศาสตร์และสรีรวิทยา', nameEN: 'Anatomy and Physiology Laboratory', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040333107', type: 'core' },
  { id: '040333109', nameTH: 'วิศวกรรมชีวการแพทย์เบื้องต้น', nameEN: 'Introduction to Biomedical Engineering', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'core' },
  { id: '040333110', nameTH: 'อิเล็กทรอนิกส์ชีวการแพทย์', nameEN: 'Biomedical Electronics', credit: 3, creditText: '3(3-0-6)', prereq: ['040333103'], coreq: null, type: 'core' },
  { id: '040333111', nameTH: 'การออกแบบระบบไมโครคอนโทรลเลอร์', nameEN: 'Microcontroller System Design', credit: 3, creditText: '3(3-0-6)', prereq: ['040333103'], coreq: null, type: 'core' },
  { id: '040333112', nameTH: 'ปฏิบัติการการออกแบบระบบไมโครคอนโทรลเลอร์', nameEN: 'Microcontroller System Design Laboratory', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040333111', type: 'core' },
  { id: '040333113', nameTH: 'วิศวกรรมไฟฟ้าเบื้องต้น', nameEN: 'Introduction to Electrical Engineering', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'core' },
  { id: '040333114', nameTH: 'ปฏิบัติการวิศวกรรมไฟฟ้าเบื้องต้น', nameEN: 'Introduction to Electrical Engineering Lab', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040333113', type: 'core' },
  { id: '040333115', nameTH: 'เขียนแบบวิศวกรรม', nameEN: 'Engineering Drawing', credit: 2, creditText: '2(1-2-3)', prereq: [], coreq: null, type: 'core' },
  { id: '040333116', nameTH: 'สัมมนา', nameEN: 'Seminar', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: null, type: 'core', isEng: true },

  // --- หมวดวิชาเฉพาะ: บังคับ ---
  { id: '040333201', nameTH: 'อุปกรณ์ชีวการแพทย์', nameEN: 'Biomedical Instrumentation', credit: 3, creditText: '3(3-0-6)', prereq: ['040333107'], coreq: null, type: 'prof' },
  { id: '040333202', nameTH: 'การวัดและเครื่องมือวัดทางชีวการแพทย์', nameEN: 'Biomedical Measurement and Instrumentation', credit: 3, creditText: '3(3-0-6)', prereq: ['040333201'], coreq: null, type: 'prof' },
  { id: '040333203', nameTH: 'วัสดุชีวภาพ', nameEN: 'Biomaterials', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof', isEng: true },
  { id: '040333204', nameTH: 'วิศวกรรมโรงพยาบาลและมาตรฐานโรงพยาบาล', nameEN: 'Hospital Engineering and Hospital Standards', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof', isEng: true },
  { id: '040333205', nameTH: 'ฟิสิกส์รังสีการแพทย์', nameEN: 'Medical Radiation Physics', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof' },
  { id: '040333206', nameTH: 'สัญญาณและระบบทางวิศวกรรมการแพทย์', nameEN: 'Signal and Systems in Biomedical Engineering', credit: 3, creditText: '3(3-0-6)', prereq: ['040333105'], coreq: null, type: 'prof' },
  { id: '040333207', nameTH: 'การสร้างภาพทางการแพทย์', nameEN: 'Medical Imaging', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof' },
  { id: '040333208', nameTH: 'สถิติสำหรับวิศวกรรมชีวการแพทย์', nameEN: 'Statistics for Biomedical Engineering', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof' },
  { id: '040333209', nameTH: 'การประยุกต์ใช้คอมพิวเตอร์ในงานวิศวกรรมชีวการแพทย์', nameEN: 'Computer Applications in Biomedical Engineering', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof' },
  { id: '040333210', nameTH: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 1', nameEN: 'Biomedical Engineering Laboratory I', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040333201', type: 'prof' },
  { id: '040333211', nameTH: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 2', nameEN: 'Biomedical Engineering Laboratory II', credit: 1, creditText: '1(0-3-1)', prereq: ['040333210'], coreq: null, type: 'prof' },
  { id: '040333212', nameTH: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 3', nameEN: 'Biomedical Engineering Laboratory III', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040333206', type: 'prof' },
  { id: '040333213', nameTH: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 4', nameEN: 'Biomedical Engineering Laboratory IV', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: '040333207', type: 'prof', isEng: true },
  { id: '040333214', nameTH: 'คลื่นเสียงความถี่สูงทางชีวการแพทย์', nameEN: 'Biomedical Ultrasound', credit: 3, creditText: '3(3-0-6)', prereq: ['040303005'], coreq: null, type: 'prof', isEng: true },
  { id: '040333215', nameTH: 'เทคโนโลยีอัจฉริยะสำหรับการประยุกต์ทางการแพทย์', nameEN: 'Smart Technology for Medical Engineering', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: '040333111', type: 'prof' },
  { id: '040333518', nameTH: 'นวัตกรรมทางการแพทย์', nameEN: 'Medical Innovation', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof', isEng: true },

  // --- หมวดฝึกประสบการณ์และโครงงาน ---
  { id: '040333220', nameTH: 'การฝึกทักษะเชิงช่าง (S/U)', nameEN: 'Practical Training', credit: 0, creditText: '2(90 ชม.)', prereq: [], coreq: null, type: 'training' },
  { id: '040333221', nameTH: 'การฝึกทักษะการซ่อมเครื่องมือแพทย์ (S/U)', nameEN: 'Maintenance Practices for Medical Instrument', credit: 0, creditText: '3(135 ชม.)', prereq: ['040333220'], coreq: null, type: 'training' },
  { id: '040333702', nameTH: 'การฝึกงาน (S/U)', nameEN: 'Training', credit: 0, creditText: '3(210 ชม.)', prereq: [], coreq: null, type: 'training' },
  { id: '040333801', nameTH: 'เตรียมสหกิจศึกษา (S/U)', nameEN: 'Pre Co-operative Education', credit: 1, creditText: '1(30 ชม.)', prereq: [], coreq: null, type: 'training' },
  { id: '040333802', nameTH: 'สหกิจศึกษา 1', nameEN: 'Co-operative Education I', credit: 3, creditText: '3(240 ชม.)', prereq: ['040333801'], coreq: null, type: 'training' },
  { id: '040333803', nameTH: 'สหกิจศึกษา 2', nameEN: 'Co-operative Education II', credit: 3, creditText: '3(240 ชม.)', prereq: ['040333802'], coreq: null, type: 'training' },
  { id: '040333804', nameTH: 'โครงงานสหกิจศึกษา', nameEN: 'Co-operative Project', credit: 2, creditText: '2(0-6-2)', prereq: ['040333803'], coreq: null, type: 'project' },
  { id: '040333703', nameTH: 'โครงงานพิเศษ', nameEN: 'Special Project', credit: 2, creditText: '2(0-6-2)', prereq: [], coreq: null, type: 'project' },

  // --- หมวดเลือกเสรี ---
  { id: 'FREE-ELEC', nameTH: 'วิชาเลือกเสรี', nameEN: 'Free Elective Course', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'free' },
  
  // --- หมวดวิชาชีพเลือก (ตัวแทนวิชาสำคัญๆ ไว้ให้เลือกลง) ---
  { id: '040333301', nameTH: 'อุปกรณ์หออภิบาล', nameEN: 'Intensive Care Unit Instrumentation', credit: 3, creditText: '3(3-0-6)', prereq: ['040333107'], coreq: null, type: 'prof_elec' },
  { id: '040333302', nameTH: 'อุปกรณ์วินิจฉัยโรค', nameEN: 'Diagnostic Medical Instrumentation', credit: 3, creditText: '3(3-0-6)', prereq: ['040333107'], coreq: null, type: 'prof_elec' },
  { id: '040333306', nameTH: 'การออกแบบอุปกรณ์การแพทย์', nameEN: 'Medical Instrumentation Design', credit: 3, creditText: '3(3-0-6)', prereq: ['040333201'], coreq: null, type: 'prof_elec' },
  { id: 'TECH-ELEC1', nameTH: 'วิชาเลือกในกลุ่มวิชาชีพ 1', nameEN: 'Technical Elective Course 1', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof_elec' },
  { id: 'TECH-ELEC2', nameTH: 'วิชาเลือกในกลุ่มวิชาชีพ 2', nameEN: 'Technical Elective Course 2', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof_elec' },
  { id: 'TECH-ELEC3', nameTH: 'วิชาเลือกในกลุ่มวิชาชีพ 3', nameEN: 'Technical Elective Course 3', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof_elec' },
  { id: 'TECH-ELEC4', nameTH: 'วิชาเลือกในกลุ่มวิชาชีพ 4', nameEN: 'Technical Elective Course 4', credit: 3, creditText: '3(3-0-6)', prereq: [], coreq: null, type: 'prof_elec' },
  { id: 'TECH-LAB1', nameTH: 'ปฏิบัติการวิชาเลือกในกลุ่มวิชาชีพ 1', nameEN: 'Technical Elective Lab I', credit: 1, creditText: '1(0-3-1)', prereq: [], coreq: null, type: 'prof_elec' },
];

export const SEMESTERS_CONFIG = [
  { id: 'y1s1', title: 'ปี 1 เทอม 1', isSummer: false, plan: 'all' },
  { id: 'y1s2', title: 'ปี 1 เทอม 2', isSummer: false, plan: 'all' },
  { id: 'y1s3', title: 'ปี 1 ฤดูร้อน', isSummer: true, plan: 'all' },
  { id: 'y2s1', title: 'ปี 2 เทอม 1', isSummer: false, plan: 'all' },
  { id: 'y2s2', title: 'ปี 2 เทอม 2', isSummer: false, plan: 'all' },
  { id: 'y2s3', title: 'ปี 2 ฤดูร้อน', isSummer: true, plan: 'all' },
  { id: 'y3s1', title: 'ปี 3 เทอม 1', isSummer: false, plan: 'all' },
  { id: 'y3s2-n', title: 'ปี 3 เทอม 2', isSummer: false, plan: 'normal' },
  { id: 'y3s3-n', title: 'ปี 3 ฤดูร้อน', isSummer: true, plan: 'normal' },
  { id: 'y4s1-n', title: 'ปี 4 เทอม 1', isSummer: false, plan: 'normal' },
  { id: 'y4s2-n', title: 'ปี 4 เทอม 2', isSummer: false, plan: 'normal' },
  { id: 'y3s2-c', title: 'ปี 3 เทอม 2', isSummer: false, plan: 'coop' },
  { id: 'y3s3-c', title: 'ปี 3 ฤดูร้อน', isSummer: true, plan: 'coop' },
  { id: 'y4s1-c', title: 'ปี 4 เทอม 1', isSummer: false, plan: 'coop' },
  { id: 'y4s2-c', title: 'ปี 4 เทอม 2', isSummer: false, plan: 'coop' },
];

// ==========================================
// 3. ข้อมูลแยกตามหมวดหมู่วิชา - สำหรับหน้า "แผนผังการเรียน (Curriculum Map)"
// ==========================================
// src/data/curriculumData.js

export const CURRICULUM_CATEGORIES = {
  totalCredits: 146,
  categories: [
    {
      id: 'gened', title: '1. หมวดวิชาศึกษาทั่วไป', totalCredits: 25, color: 'pink',
      subCategories: [
        {
          title: '1.1 วิชาบังคับ (13 หน่วยกิต)',
          courses: [
            { id: '080103001', name: 'ภาษาอังกฤษ 1 (English I)', credit: '3(3-0-6)' },
            { id: '080103002', name: 'ภาษาอังกฤษ 2 (English II)', credit: '3(3-0-6)' },
            { id: '080203914', name: 'ผู้ประกอบการนวัตกรรม (Innovative Technopreneurs)', credit: '3(3-0-6)' },
            { id: '080303701', name: 'กระบวนการคิดเชิงออกแบบ (Design Thinking)', credit: '3(3-0-6)' },
            { id: '0803035XX', name: 'กลุ่มกีฬาและนันทนาการ (เลือก 1 วิชา)', credit: '1(0-2-1)' },
          ]
        },
        {
          title: '1.2 วิชาเลือก (12 หน่วยกิต)',
          description: 'เลือกเรียนจากกลุ่มเสริมสร้างทักษะภาษา, กลุ่มสร้างนวัตกรรม, วิถีพลเมืองที่ดี หรือ ทักษะในศตวรรษที่ 21',
          courses: [
            { id: '080103018', name: 'ภาษาอังกฤษเพื่อการทำงาน', credit: '3(3-0-6)' },
            { id: '080103023', name: 'ภาษาอังกฤษเพื่อการสื่อสารสำหรับวิศวกร', credit: '3(3-0-6)' },
            { id: '080103034', name: 'การสนทนาภาษาอังกฤษ', credit: '3(3-0-6)' },
            { id: '040433001', name: 'อาหาร สุขภาพและคุณภาพชีวิต', credit: '3(3-0-6)' },
            { id: '080203905', name: 'เศรษฐศาสตร์ในชีวิตประจำวัน', credit: '3(3-0-6)' },
            { id: '080303103', name: 'จิตวิทยาเพื่อความสุขในการดำรงชีวิต', credit: '3(3-0-6)' },
            { id: '080303601', name: 'มนุษยสัมพันธ์', credit: '3(3-0-6)' },
            { id: '040713007', name: 'ยาจากธรรมชาติเพื่อสุขภาพ', credit: '3(3-0-6)' },
            { id: '040203103', name: 'วิทยาการข้อมูลสำหรับชีวิตประจำวัน', credit: '3(3-0-6)' },
            { id: '040313017', name: 'ทักษะการออกกำลังกายและกีฬา', credit: '3(3-0-6)' },
            { id: '040313018', name: 'ร่างกายมนุษย์และสุขภาพ', credit: '3(3-0-6)' },
            { id: '040603005', name: 'ปัญญาประดิษฐ์กับวิถีชีวิตใหม่', credit: '3(3-0-6)' },
          ]
        }
      ]
    },
    {
      id: 'core', title: '2. หมวดวิชาเฉพาะ: กลุ่มวิชาแกน', totalCredits: 53, color: 'orange',
      subCategories: [
        {
          title: 'วิชาคณิตศาสตร์ วิทยาศาสตร์ และพื้นฐานวิศวกรรม',
          courses: [
            { id: '040113001', name: 'เคมีสำหรับวิศวกร', credit: '3(3-0-6)' },
            { id: '040113002', name: 'ปฏิบัติการเคมีสำหรับวิศวกร', credit: '1(0-3-1)' },
            { id: '040203111', name: 'คณิตศาสตร์วิศวกรรม 1', credit: '3(3-0-6)' },
            { id: '040203112', name: 'คณิตศาสตร์วิศวกรรม 2', credit: '3(3-0-6)' },
            { id: '040303005', name: 'ฟิสิกส์ 1*', credit: '3(3-0-6)' },
            { id: '040303006', name: 'ปฏิบัติการฟิสิกส์ 1*', credit: '1(0-2-1)' },
            { id: '040303007', name: 'ฟิสิกส์ 2*', credit: '3(3-0-6)' },
            { id: '040303008', name: 'ปฏิบัติการฟิสิกส์ 2*', credit: '1(0-2-1)' },
            { id: '040333101', name: 'อิเล็กทรอนิกส์ 1', credit: '3(3-0-6)' },
            { id: '040333102', name: 'ปฏิบัติการอิเล็กทรอนิกส์ 1', credit: '1(0-3-1)' },
            { id: '040333103', name: 'อิเล็กทรอนิกส์ 2', credit: '3(3-0-6)' },
            { id: '040333104', name: 'ปฏิบัติการอิเล็กทรอนิกส์ 2', credit: '1(0-3-1)' },
            { id: '040333105', name: 'คณิตศาสตร์วิศวกรรมชีวการแพทย์*', credit: '3(3-0-6)' },
            { id: '040333106', name: 'กายวิภาคศาสตร์และสรีรวิทยาเบื้องต้น', credit: '3(3-0-6)' },
            { id: '040333107', name: 'กายวิภาคศาสตร์และสรีรวิทยา', credit: '3(3-0-6)' },
            { id: '040333108', name: 'ปฏิบัติการกายวิภาคศาสตร์และสรีรวิทยา', credit: '1(0-3-1)' },
            { id: '040333109', name: 'วิศวกรรมชีวการแพทย์เบื้องต้น', credit: '3(3-0-6)' },
            { id: '040333110', name: 'อิเล็กทรอนิกส์ชีวการแพทย์', credit: '3(3-0-6)' },
            { id: '040333111', name: 'การออกแบบระบบไมโครคอนโทรลเลอร์', credit: '3(3-0-6)' },
            { id: '040333112', name: 'ปฏิบัติการการออกแบบระบบไมโครคอนโทรลเลอร์', credit: '1(0-3-1)' },
            { id: '040333113', name: 'วิศวกรรมไฟฟ้าเบื้องต้น', credit: '3(3-0-6)' },
            { id: '040333114', name: 'ปฏิบัติการวิศวกรรมไฟฟ้าเบื้องต้น', credit: '1(0-3-1)' },
            { id: '040333115', name: 'เขียนแบบวิศวกรรม', credit: '2(1-2-3)' },
            { id: '040333116', name: 'สัมมนา*', credit: '1(0-3-1)' },
          ]
        }
      ]
    },
    {
      id: 'prof_required', title: '3. หมวดวิชาเฉพาะ: กลุ่มวิชาชีพบังคับ', totalCredits: 40, color: 'yellow',
      subCategories: [
        {
          title: 'วิชาบังคับทางวิศวกรรมชีวการแพทย์',
          courses: [
            { id: '040333201', name: 'อุปกรณ์ชีวการแพทย์', credit: '3(3-0-6)' },
            { id: '040333202', name: 'การวัดและเครื่องมือวัดทางชีวการแพทย์', credit: '3(3-0-6)' },
            { id: '040333203', name: 'วัสดุชีวภาพ*', credit: '3(3-0-6)' },
            { id: '040333204', name: 'วิศวกรรมโรงพยาบาลและมาตรฐานโรงพยาบาล*', credit: '3(3-0-6)' },
            { id: '040333205', name: 'ฟิสิกส์รังสีการแพทย์', credit: '3(3-0-6)' },
            { id: '040333206', name: 'สัญญาณและระบบทางวิศวกรรมการแพทย์', credit: '3(3-0-6)' },
            { id: '040333207', name: 'การสร้างภาพทางการแพทย์', credit: '3(3-0-6)' },
            { id: '040333208', name: 'สถิติสำหรับวิศวกรรมชีวการแพทย์', credit: '3(3-0-6)' },
            { id: '040333209', name: 'การประยุกต์ใช้คอมพิวเตอร์ในงานวิศวกรรมชีวการแพทย์', credit: '3(3-0-6)' },
            { id: '040333210', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 1', credit: '1(0-3-1)' },
            { id: '040333211', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 2', credit: '1(0-3-1)' },
            { id: '040333212', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 3', credit: '1(0-3-1)' },
            { id: '040333213', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 4*', credit: '1(0-3-1)' },
            { id: '040333214', name: 'คลื่นเสียงความถี่สูงทางชีวการแพทย์*', credit: '3(3-0-6)' },
            { id: '040333215', name: 'เทคโนโลยีอัจฉริยะสำหรับการประยุกต์ทางการแพทย์', credit: '3(3-0-6)' },
            { id: '040333518', name: 'นวัตกรรมทางการแพทย์*', credit: '3(3-0-6)' },
          ]
        }
      ]
    },
    {
      id: 'prof_elective', title: '4. หมวดวิชาเฉพาะ: กลุ่มวิชาชีพเลือก', totalCredits: 20, color: 'green',
      subCategories: [
        {
          title: 'โครงการปกติ เลือกเรียน 20 หน่วยกิต (โครงการสหกิจ เลือก 14 หน่วยกิต)',
          description: '*เลือกเรียนกลุ่มใดกลุ่มหนึ่งเพียงกลุ่มเดียวเท่านั้น และต้องเลือกเรียนวิชาที่มีดอกจัน (*) อย่างน้อย 2 วิชา',
          courses: []
        },
        {
          title: 'กลุ่มอุปกรณ์ชีวการแพทย์ (Biomedical Instrumentation)',
          courses: [
            { id: '040333301', name: 'อุปกรณ์หออภิบาล*', credit: '3(3-0-6)' },
            { id: '040333302', name: 'อุปกรณ์วินิจฉัยโรค*', credit: '3(3-0-6)' },
            { id: '040333303', name: 'อุปกรณ์รักษาโรค*', credit: '3(3-0-6)' },
            { id: '040333304', name: 'อุปกรณ์เวชศาสตร์นิวเคลียร์*', credit: '3(3-0-6)' },
            { id: '040333306', name: 'การออกแบบอุปกรณ์การแพทย์', credit: '3(3-0-6)' },
            { id: '040333307', name: 'การวัดและสอบเทียบอุปกรณ์การแพทย์', credit: '3(3-0-6)' },
            { id: '040333308', name: 'การบำรุงรักษาเครื่องมือแพทย์', credit: '3(3-0-6)' },
            { id: '040333309', name: 'ชีวกลศาสตร์', credit: '3(3-0-6)' },
            { id: '040333310', name: 'เวชศาสตร์ฟื้นฟูและอวัยวะเทียม', credit: '3(3-0-6)' },
            { id: '040333311', name: 'เรื่องคัดเฉพาะทางอุปกรณ์การแพทย์', credit: '3(3-0-6)' },
            { id: '040333312', name: 'ปฏิบัติการด้านอุปกรณ์ชีวการแพทย์ 1', credit: '1(0-3-1)' },
            { id: '040333313', name: 'ปฏิบัติการด้านอุปกรณ์ชีวการแพทย์ 2', credit: '1(0-3-1)' },
          ]
        },
        {
          title: 'กลุ่มวิศวกรรมโรงพยาบาล (Hospital Engineering)',
          courses: [
            { id: '040333401', name: 'การจัดการคุณภาพสถานพยาบาล*', credit: '3(3-0-6)' },
            { id: '040333402', name: 'วิศวกรรมการดูแลสุขภาพ*', credit: '3(3-0-6)' },
            { id: '040333403', name: 'การบริหารจัดการเครื่องมือแพทย์*', credit: '3(3-0-6)' },
            { id: '040333404', name: 'การบริหารจัดการสถานพยาบาล*', credit: '3(3-0-6)' },
            { id: '040333405', name: 'วิศวกรรมอาคารและสิ่งแวดล้อม*', credit: '3(3-0-6)' },
            { id: '040333406', name: 'วิศวกรรมของเสียและขยะอันตราย*', credit: '3(3-0-6)' },
            { id: '040333407', name: 'วิศวกรรมในภาวะภัยพิบัติ', credit: '3(3-0-6)' },
            { id: '040333408', name: 'กฎหมายทางวิศวกรรมชีวการแพทย์', credit: '3(3-0-6)' },
            { id: '040333409', name: 'การออกแบบห้องปฏิบัติการทางการแพทย์', credit: '3(3-0-6)' },
            { id: '040333410', name: 'การออกแบบระบบสารสนเทศทางการแพทย์', credit: '3(3-0-6)' },
            { id: '040333411', name: 'การจัดการธุรกิจการดูแลสุขภาพ', credit: '3(3-0-6)' },
            { id: '040333412', name: 'เรื่องคัดเฉพาะทางวิศวกรรมการดูแลสุขภาพและการจัดการ', credit: '3(3-0-6)' },
            { id: '040333413', name: 'ปฏิบัติการด้านวิศวกรรมโรงพยาบาล 1', credit: '1(0-3-1)' },
            { id: '040333414', name: 'ปฏิบัติการด้านวิศวกรรมโรงพยาบาล 2', credit: '1(0-3-1)' },
          ]
        },
        {
          title: 'กลุ่มนวัตกรรมและสารสนเทศทางการแพทย์ (Medical Innovation and Informatics)',
          courses: [
            { id: '040333309', name: 'ชีวกลศาสตร์*', credit: '3(3-0-6)' },
            { id: '040333410', name: 'การออกแบบระบบสารสนเทศทางการแพทย์', credit: '3(3-0-6)' },
            { id: '040333501', name: 'ไบโอฟิสิกส์*', credit: '3(3-0-6)' },
            { id: '040333502', name: 'ไบโอเซนเซอร์*', credit: '3(3-0-6)' },
            { id: '040333507', name: 'วิศวกรรมหุ่นยนต์ทางการแพทย์', credit: '3(3-0-6)' },
            { id: '040333513', name: 'ระบบควบคุมอัตโนมัติ', credit: '3(3-0-6)' },
            { id: '040333516', name: 'เรื่องคัดเฉพาะทางเทคโนโลยีวิศวกรรมชีวการแพทย์*', credit: '3(3-0-6)' },
            { id: '040333517', name: 'เทคโนโลยีของไหลทางการแพทย์', credit: '3(3-0-6)' },
            { id: '040333519', name: 'ระบบเครือข่ายคอมพิวเตอร์ทางการแพทย์และความมั่นคง', credit: '3(3-0-6)' },
            { id: '040333520', name: 'ระบบจัดการข้อมูลและประมวลผลข้อมูลทางการแพทย์*', credit: '3(3-0-6)' },
            { id: '040333521', name: 'การประยุกต์สรีรวิทยาสำหรับวิศวกรรมชีวการแพทย์*', credit: '3(3-0-6)' },
            { id: '040333522', name: 'ปฏิบัติการด้านนวัตกรรมและสารสนเทศทางการแพทย์ 1', credit: '1(0-3-1)' },
            { id: '040333523', name: 'ปฏิบัติการด้านนวัตกรรมและสารสนเทศทางการแพทย์ 2', credit: '1(0-3-1)' },
          ]
        },
        {
          title: 'กลุ่มวิศวกรรมคลินิก (Clinical Engineering)',
          courses: [
            { id: '040333601', name: 'ระบบไตและไตเทียม*', credit: '3(3-0-6)' },
            { id: '040333602', name: 'ระบบการหายใจและเครื่องช่วยหายใจ*', credit: '3(3-0-6)' },
            { id: '040333603', name: 'การตรวจคลื่นไฟฟ้าชีวภาพ*', credit: '3(3-0-6)' },
            { id: '040333604', name: 'อุปกรณ์กระดูกและข้อและกายภาพบำบัด', credit: '3(3-0-6)' },
            { id: '040333605', name: 'การตรวจและรักษาด้วยกล้องส่องตรวจ*', credit: '3(3-0-6)' },
            { id: '040333606', name: 'เวชศาสตร์ฉุกเฉินและอุปกรณ์สำหรับผู้ป่วยภาวะวิกฤต', credit: '3(3-0-6)' },
            { id: '040333607', name: 'อุปกรณ์ห้องผ่าตัด', credit: '3(3-0-6)' },
            { id: '040333608', name: 'อุปกรณ์วินิจฉัยและรักษา ตา หู คอ จมูก', credit: '3(3-0-6)' },
            { id: '040333609', name: 'เครื่องมือห้องปฏิบัติการ', credit: '3(3-0-6)' },
            { id: '040333610', name: 'อุปกรณ์ระบบหัวใจและหลอดเลือด*', credit: '3(3-0-6)' },
            { id: '040333611', name: 'เรื่องคัดเฉพาะทางวิศวกรรมคลินิก 1', credit: '3(3-0-6)' },
            { id: '040333612', name: 'เรื่องคัดเฉพาะทางวิศวกรรมคลินิก 2', credit: '3(3-0-6)' },
            { id: '040333613', name: 'ระบบไตและไตเทียมขั้นสูง', credit: '3(3-0-6)' },
            { id: '040333614', name: 'ปฏิบัติการด้านวิศวกรรมคลินิก 1', credit: '1(0-3-1)' },
            { id: '040333615', name: 'ปฏิบัติการด้านวิศวกรรมคลินิก 2', credit: '1(0-3-1)' },
          ]
        },
        {
          title: 'กลุ่มโฟโตนิกส์ชีวการแพทย์ (Biomedical Photonics)',
          courses: [
            { id: '040333901', name: 'โฟโตนิกส์*', credit: '3(3-0-6)' },
            { id: '040333902', name: 'วิศวกรรมเลเซอร์*', credit: '3(3-0-6)' },
            { id: '040333903', name: 'ทัศนศาสตร์ชีวการแพทย์ 1*', credit: '3(3-0-6)' },
            { id: '040333904', name: 'ทัศนศาสตร์ชีวการแพทย์ 2*', credit: '3(3-0-6)' },
            { id: '040333905', name: 'ทัศนอุปกรณ์และการออกแบบทัศนศาสตร์สำหรับการดูแลสุขภาพ', credit: '3(3-0-6)' },
            { id: '040333906', name: 'อุปกรณ์นำแสงการแพทย์', credit: '3(3-0-6)' },
            { id: '040333907', name: 'ระเบียบวิธีทางทัศนศาสตร์สำหรับการรักษาผู้ป่วย', credit: '3(3-0-6)' },
            { id: '040333908', name: 'เลเซอร์การแพทย์และแหล่งกำเนิดแสงไม่เป็นอาพันธ์', credit: '3(3-0-6)' },
            { id: '040333909', name: 'วิศวกรรมควบคุมและมาตรฐาน', credit: '3(3-0-6)' },
            { id: '040333910', name: 'เรื่องคัดเฉพาะทางโฟโตนิกส์ชีวการแพทย์ 1', credit: '3(3-0-6)' },
            { id: '040333911', name: 'เรื่องคัดเฉพาะทางโฟโตนิกส์ชีวการแพทย์ 2', credit: '3(3-0-6)' },
            { id: '040333912', name: 'ปฏิบัติการด้านโฟโตนิกส์ชีวการแพทย์ 1', credit: '1(0-3-1)' },
            { id: '040333913', name: 'ปฏิบัติการด้านโฟโตนิกส์ชีวการแพทย์ 2', credit: '1(0-3-1)' },
          ]
        },
      ]
    },
    {
      id: 'project_training', title: '5. หมวดฝึกประสบการณ์วิชาชีพ และ โครงงานพิเศษ', totalCredits: 2, color: 'gray',
      subCategories: [
        {
          title: 'กลุ่มวิชาปรับพื้นฐานและฝึกงาน (ประเมินเป็น S/U ไม่นับหน่วยกิตรวม)',
          courses: [
            { id: '040333220', name: 'การฝึกทักษะเชิงช่าง (Practical Training)', credit: '0 (90 ชม.)' },
            { id: '040333221', name: 'การฝึกทักษะการซ่อมเครื่องมือแพทย์', credit: '0 (135 ชม.)' },
            { id: '040333702', name: 'การฝึกงาน (Training)', credit: '0 (210 ชม.)' },
            { id: '040333801', name: 'เตรียมสหกิจศึกษา', credit: '1 (30 ชม.)' },
          ]
        },
        {
          title: 'โครงงานพิเศษ / สหกิจศึกษา (นับหน่วยกิต)',
          courses: [
            { id: '040333703', name: 'โครงงานพิเศษ (Special Project)', credit: '2(0-6-2)' },
            { id: '040333802', name: 'สหกิจศึกษา 1', credit: '3 (240 ชม.)' },
            { id: '040333803', name: 'สหกิจศึกษา 2', credit: '3 (240 ชม.)' },
            { id: '040333804', name: 'โครงงานสหกิจศึกษา', credit: '2(0-6-2)' },
          ]
        }
      ]
    },
    {
      id: 'free_elective', title: '6. หมวดวิชาเลือกเสรี', totalCredits: 6, color: 'white',
      subCategories: [
        {
          title: 'เลือกเรียนรายวิชาใดก็ได้ในหลักสูตรระดับปริญญาตรี',
          courses: [
            { id: 'XXXXXXXXX', name: 'วิชาเลือกเสรี (Free Elective Course)', credit: '3(3-0-6)' },
          ]
        }
      ]
    },
  ]
};

// ==========================================
// 4. ข้อมูลแผนการศึกษาแยกตามชั้นปี - สำหรับหน้า "แผนผังการเรียน (Curriculum Map)"
// ==========================================
export const YEARLY_PLAN = [
  {
    year: 'ปีที่ 1',
    terms: [
      {
        title: 'ภาคการศึกษาที่ 1', totalCredits: 22, plan: 'all',
        courses: [
          { id: '040203111', name: 'คณิตศาสตร์วิศวกรรม 1', credit: '3(3-0-6)' },
          { id: '040303005', name: 'ฟิสิกส์ 1*', credit: '3(3-0-6)' },
          { id: '040303006', name: 'ปฏิบัติการฟิสิกส์ 1*', credit: '1(0-2-1)' },
          { id: '040333106', name: 'กายวิภาคศาสตร์และสรีรวิทยาเบื้องต้น', credit: '3(3-0-6)' },
          { id: '040333115', name: 'เขียนแบบวิศวกรรม', credit: '2(1-2-3)' },
          { id: '080103001', name: 'ภาษาอังกฤษ 1', credit: '3(3-0-6)' },
          { id: '0803035XX', name: 'วิชาเลือกในชุดวิชากีฬาและนันทนาการ', credit: '1(0-2-1)' },
          { id: 'XXXXXXXXX', name: 'วิชาเลือกในหมวดวิชาศึกษาทั่วไป', credit: '3(3-0-6)' },
          { id: 'XXXXXXXXX', name: 'วิชาเลือกในหมวดวิชาศึกษาทั่วไป', credit: '3(3-0-6)' },
        ]
      },
      {
        title: 'ภาคการศึกษาที่ 2', totalCredits: 21, plan: 'all',
        courses: [
          { id: '040113001', name: 'เคมีสำหรับวิศวกร', credit: '3(3-0-6)' },
          { id: '040113002', name: 'ปฏิบัติการเคมีสำหรับวิศวกร', credit: '1(0-3-1)' },
          { id: '040203112', name: 'คณิตศาสตร์วิศวกรรม 2', credit: '3(3-0-6)' },
          { id: '040303007', name: 'ฟิสิกส์ 2*', credit: '3(3-0-6)' },
          { id: '040303008', name: 'ปฏิบัติการฟิสิกส์ 2*', credit: '1(0-2-1)' },
          { id: '040333113', name: 'วิศวกรรมไฟฟ้าเบื้องต้น', credit: '3(3-0-6)' },
          { id: '040333114', name: 'ปฏิบัติการวิศวกรรมไฟฟ้าเบื้องต้น', credit: '1(0-3-1)' },
          { id: '080103002', name: 'ภาษาอังกฤษ 2', credit: '3(3-0-6)' },
          { id: 'XXXXXXXXX', name: 'วิชาเลือกในหมวดวิชาศึกษาทั่วไป', credit: '3(3-0-6)' },
        ]
      },
      {
        title: 'ภาคการศึกษาฤดูร้อน', isSummer: true, plan: 'all',
        courses: [
          { id: '040333220', name: 'การฝึกทักษะเชิงช่าง**', credit: '2(90 ชั่วโมง)' },
        ]
      }
    ]
  },
  {
    year: 'ปีที่ 2',
    terms: [
      {
        title: 'ภาคการศึกษาที่ 1', totalCredits: 20, plan: 'all',
        courses: [
          { id: '040333101', name: 'อิเล็กทรอนิกส์ 1', credit: '3(3-0-6)' },
          { id: '040333102', name: 'ปฏิบัติการอิเล็กทรอนิกส์ 1', credit: '1(0-3-1)' },
          { id: '040333105', name: 'คณิตศาสตร์วิศวกรรมชีวการแพทย์*', credit: '3(3-0-6)' },
          { id: '040333107', name: 'กายวิภาคศาสตร์และสรีรวิทยา', credit: '3(3-0-6)' },
          { id: '040333108', name: 'ปฏิบัติการกายวิภาคศาสตร์และสรีรวิทยา', credit: '1(0-3-1)' },
          { id: '040333109', name: 'วิศวกรรมชีวการแพทย์เบื้องต้น', credit: '3(3-0-6)' },
          { id: '040333209', name: 'การประยุกต์ใช้คอมพิวเตอร์ในงานวิศวกรรมชีวการแพทย์', credit: '3(3-0-6)' },
          { id: 'XXXXXXXXX', name: 'วิชาเลือกเสรี', credit: '3(3-0-6)' },
        ]
      },
      {
        title: 'ภาคการศึกษาที่ 2', totalCredits: 20, plan: 'all',
        courses: [
          { id: '040333103', name: 'อิเล็กทรอนิกส์ 2', credit: '3(3-0-6)' },
          { id: '040333104', name: 'ปฏิบัติการอิเล็กทรอนิกส์ 2', credit: '1(0-3-1)' },
          { id: '040333201', name: 'อุปกรณ์ชีวการแพทย์', credit: '3(3-0-6)' },
          { id: '040333203', name: 'วัสดุชีวภาพ*', credit: '3(3-0-6)' },
          { id: '040333205', name: 'ฟิสิกส์รังสีการแพทย์', credit: '3(3-0-6)' },
          { id: '040333210', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 1', credit: '1(0-3-1)' },
          { id: '040333518', name: 'นวัตกรรมทางการแพทย์*', credit: '3(3-0-6)' },
          { id: '080303701', name: 'กระบวนการคิดเชิงออกแบบ', credit: '3(3-0-6)' },
        ]
      },
      {
        title: 'ภาคการศึกษาฤดูร้อน', isSummer: true, plan: 'all',
        courses: [
          { id: '040333221', name: 'การฝึกทักษะการซ่อมเครื่องมือแพทย์**', credit: '3(135 ชั่วโมง)' },
        ]
      }
    ]
  },
  {
    year: 'ปีที่ 3',
    terms: [
      {
        title: 'ภาคการศึกษาที่ 1', totalCredits: 22, plan: 'all',
        courses: [
          { id: '040333111', name: 'การออกแบบระบบไมโครคอนโทรลเลอร์', credit: '3(3-0-6)' },
          { id: '040333112', name: 'ปฏิบัติการการออกแบบระบบไมโครคอนโทรลเลอร์', credit: '1(0-3-1)' },
          { id: '040333202', name: 'การวัดและเครื่องมือวัดทางชีวการแพทย์', credit: '3(3-0-6)' },
          { id: '040333204', name: 'วิศวกรรมโรงพยาบาลและมาตรฐานโรงพยาบาล*', credit: '3(3-0-6)' },
          { id: '040333208', name: 'สถิติสำหรับวิศวกรรมชีวการแพทย์', credit: '3(3-0-6)' },
          { id: '040333215', name: 'เทคโนโลยีอัจฉริยะสำหรับการประยุกต์ทางการแพทย์', credit: '3(3-0-6)' },
          { id: '080203914', name: 'ผู้ประกอบการนวัตกรรม', credit: '3(3-0-6)' },
          { id: 'XXXXXXXXX', name: 'วิชาเลือกในหมวดวิชาศึกษาทั่วไป', credit: '3(3-0-6)' },
        ]
      },
      // ---- แยก แผนปกติ และ แผนสหกิจศึกษา ----
      {
        title: 'ภาคการศึกษาที่ 2 (โครงการปกติ)', totalCredits: 21, plan: 'normal',
        courses: [
          { id: '040333110', name: 'อิเล็กทรอนิกส์ชีวการแพทย์', credit: '3(3-0-6)' },
          { id: '040333206', name: 'สัญญาณและระบบทางวิศวกรรมการแพทย์', credit: '3(3-0-6)' },
          { id: '040333207', name: 'การสร้างภาพทางการแพทย์', credit: '3(3-0-6)' },
          { id: '040333211', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 2', credit: '1(0-3-1)' },
          { id: '040333212', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 3', credit: '1(0-3-1)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ (Lab)', credit: '1(0-3-1)' },
        ]
      },
      {
        title: 'ภาคการศึกษาที่ 2 (โครงการสหกิจศึกษา)', totalCredits: 21, plan: 'coop',
        courses: [
          { id: '040333110', name: 'อิเล็กทรอนิกส์ชีวการแพทย์', credit: '3(3-0-6)' },
          { id: '040333206', name: 'สัญญาณและระบบทางวิศวกรรมการแพทย์', credit: '3(3-0-6)' },
          { id: '040333207', name: 'การสร้างภาพทางการแพทย์', credit: '3(3-0-6)' },
          { id: '040333211', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 2', credit: '1(0-3-1)' },
          { id: '040333212', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 3', credit: '1(0-3-1)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333801', name: 'เตรียมสหกิจศึกษา**', credit: '1(30 ชั่วโมง)' },
        ]
      },
      {
        title: 'ภาคการศึกษาฤดูร้อน (โครงการปกติ)', isSummer: true, plan: 'normal',
        courses: [
          { id: '040333702', name: 'การฝึกงาน**', credit: '3(210 ชั่วโมง)' },
        ]
      },
      {
        title: 'ภาคการศึกษาฤดูร้อน (โครงการสหกิจศึกษา)', isSummer: true, plan: 'coop',
        courses: [
          { id: '040333802', name: 'สหกิจศึกษา 1', credit: '3(240 ชั่วโมง)' },
        ]
      }
    ]
  },
  {
    year: 'ปีที่ 4',
    terms: [
      {
        title: 'ภาคการศึกษาที่ 1 (โครงการปกติ)', totalCredits: 10, plan: 'normal',
        courses: [
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกในกลุ่มวิชาชีพ (Lab)', credit: '1(0-3-1)' },
        ]
      },
      {
        title: 'ภาคการศึกษาที่ 1 (โครงการสหกิจศึกษา)', totalCredits: 7, plan: 'coop',
        courses: [
          { id: '040333803', name: 'สหกิจศึกษา 2', credit: '3(240 ชั่วโมง)' },
          { id: '040333xxx', name: 'วิชาเลือกเฉพาะด้านในกลุ่มวิชาชีพ', credit: '3(3-0-6)' },
          { id: '040333xxx', name: 'วิชาเลือกเฉพาะด้านในกลุ่มวิชาชีพ (Lab)', credit: '1(0-3-1)' },
        ]
      },
      {
        title: 'ภาคการศึกษาที่ 2 (โครงการปกติ)', totalCredits: 10, plan: 'normal',
        courses: [
          { id: '040333116', name: 'สัมมนา*', credit: '1(0-3-1)' },
          { id: '040333213', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 4*', credit: '1(0-3-1)' },
          { id: '040333214', name: 'คลื่นเสียงความถี่สูงทางชีวการแพทย์*', credit: '3(3-0-6)' },
          { id: '040333703', name: 'โครงงานพิเศษ', credit: '2(0-6-2)' },
          { id: 'XXXXXXXXX', name: 'วิชาเลือกเสรี', credit: '3(3-0-6)' },
        ]
      },
      {
        title: 'ภาคการศึกษาที่ 2 (โครงการสหกิจศึกษา)', totalCredits: 10, plan: 'coop',
        courses: [
          { id: '040333116', name: 'สัมมนา*', credit: '1(0-3-1)' },
          { id: '040333213', name: 'ปฏิบัติการวิศวกรรมชีวการแพทย์ 4*', credit: '1(0-3-1)' },
          { id: '040333214', name: 'คลื่นเสียงความถี่สูงทางชีวการแพทย์*', credit: '3(3-0-6)' },
          { id: '040333804', name: 'โครงงานสหกิจศึกษา', credit: '2(0-6-2)' },
          { id: 'XXXXXXXXX', name: 'วิชาเลือกเสรี', credit: '3(3-0-6)' },
        ]
      }
    ]
  }
];