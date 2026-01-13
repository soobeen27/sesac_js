import bcrypt from 'bcryptjs';
import { openDb, run } from './src/db.js';
import { uid } from './src/utils.js';

const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
const db = openDb(dbPath);

const USERS = [
  { email: 'test_manager@example.com', name: '이팀장', password: 'password123' },
  { email: 'test_dev@example.com', name: '김개발', password: 'password123' },
  { email: 'test_designer@example.com', name: '박디자이너', password: 'password123' },
];

const TASKS = [
  { title: '요구사항 분석', desc: '고객사 미팅 및 문서화', start: '2026-01-01', end: '2026-01-05', status: 'Done' },
  { title: 'DB 스키마 설계', desc: 'ERD 작성 및 정규화', start: '2026-01-06', end: '2026-01-10', status: 'Done' },
  { title: 'API 개발 (인증)', desc: 'JWT 로그인 구현', start: '2026-01-11', end: '2026-01-15', status: 'Doing' },
  { title: '프론트엔드 구축', desc: 'React, Tailwind 설정', start: '2026-01-12', end: '2026-01-20', status: 'Doing' },
  { title: 'Gantt 차트 구현', desc: '라이브러리 검토', start: '2026-01-16', end: '2026-01-25', status: 'Todo' },
  { title: '배포 및 테스트', desc: 'AWS 환경 구성', start: '2026-01-26', end: '2026-01-31', status: 'Todo' },
];

async function seed() {
  console.log('🌱 Seeding data...');

  for (const u of USERS) {
    console.log(`Creating user: ${u.name} (${u.email})`);
    const userId = uid('u');
    const hash = await bcrypt.hash(u.password, 10);

    // Check if exists
    // We'll just try insert and ignore error if dup or handle it simply?
    // Better to be robust: delete old potentially? No, just skip if exists.
    try {
      await run(db, 'INSERT INTO users(id,email,password_hash,name) VALUES (?,?,?,?)', [userId, u.email, hash, u.name]);
    } catch (e) {
      console.log(`User ${u.email} already exists or error:`, e.message);
      continue;
    }

    // Workspace
    const wsId = uid('w');
    await run(db, 'INSERT INTO workspaces(id,name) VALUES (?,?)', [wsId, `${u.name}의 워크스페이스`]);
    await run(db, 'INSERT INTO memberships(id,workspace_id,user_id,role) VALUES (?,?,?,?)', [
      uid('m'),
      wsId,
      userId,
      'owner',
    ]);

    // Project
    const projId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)', [
      projId,
      wsId,
      'TaskFlow 리팩토링 프로젝트',
      '테스트용 샘플 프로젝트입니다.',
      userId,
    ]);

    // Columns
    const colIds = {};
    const colNames = ['Todo', 'Doing', 'Done'];
    let i = 1;
    for (const name of colNames) {
      const cId = uid('c');
      colIds[name] = cId;
      await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [cId, projId, name, i++]);
    }

    // Tasks
    // Distribute tasks across status columns
    let tCount = 0;
    for (const t of TASKS) {
      tCount++;
      const targetCol = colIds[t.status] || colIds['Todo'];
      const tId = uid('t');
      await run(
        db,
        `INSERT INTO tasks(id, project_id, column_id, title, description, start_date, end_date, ord, created_by) 
             VALUES (?,?,?,?,?,?,?,?,?)`,
        [tId, projId, targetCol, t.title, t.desc, t.start, t.end, tCount, userId]
      );
    }
    console.log(`Created project and ${tCount} tasks for ${u.name}`);
  }

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
