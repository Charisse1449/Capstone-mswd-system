const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL, fileURLToPath } = require('url');
const db = require('./db');
const pool = require('./db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1100,
    minHeight: 650,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'welcome.html'));
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(permission === 'media');
  });

  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    return permission === 'media';
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function toNull(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function toMoney(value) {
  if (value === undefined || value === null || value === '') return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

function cleanDate(value) {
  if (!value) return null;
  return String(value).slice(0, 10);
}


/* =========================
   PROFILE PHOTO FILE STORAGE
   - Captured camera photos are saved in an app folder.
   - Database residents.profile_photo stores the file:// URL.
   - Editing replaces the old saved photo.
   - Deleting a resident also removes its saved photo.
========================= */

function getResidentPhotoDirectory() {
  const photoDir = path.join(__dirname, 'resident-profile-photos');
  fs.mkdirSync(photoDir, { recursive: true });
  return photoDir;
}

function photoValueToLocalPath(value) {
  const text = String(value || '').trim();
  if (!text) return '';

  try {
    if (text.startsWith('file://')) return fileURLToPath(text);
  } catch {
    return '';
  }

  if (/^[a-zA-Z]:[\\/]/.test(text) || text.startsWith('/') || text.startsWith('\\\\')) {
    return text;
  }

  return '';
}

function isManagedResidentPhoto(value) {
  const filePath = photoValueToLocalPath(value);
  if (!filePath) return false;

  const photoDir = path.resolve(getResidentPhotoDirectory());
  const resolvedFile = path.resolve(filePath);

  return resolvedFile === photoDir || resolvedFile.startsWith(photoDir + path.sep);
}

async function removeManagedResidentPhoto(value) {
  try {
    if (!isManagedResidentPhoto(value)) return;

    const filePath = path.resolve(photoValueToLocalPath(value));
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Unable to remove resident photo:', error.message);
  }
}

function getDataImageParts(value) {
  const text = String(value || '').trim();
  const dataMatch = text.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/i);

  if (dataMatch) {
    const type = dataMatch[1].toLowerCase().replace('jpeg', 'jpg');
    return {
      extension: type === 'jpg' || type === 'jpeg' ? 'jpg' : type,
      base64: dataMatch[2]
    };
  }

  const compact = text.replace(/\s/g, '');
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(compact) && compact.length > 120) {
    return {
      extension: 'jpg',
      base64: compact
    };
  }

  return null;
}

async function saveResidentPhotoFile(photoValue, residentId, oldPhotoValue = '') {
  const text = String(photoValue || '').trim();

  if (!text) {
    await removeManagedResidentPhoto(oldPhotoValue);
    return null;
  }

  if (oldPhotoValue && text === String(oldPhotoValue).trim()) {
    return oldPhotoValue;
  }

  const imageParts = getDataImageParts(text);

  if (!imageParts) {
    if (oldPhotoValue && text !== String(oldPhotoValue).trim()) {
      await removeManagedResidentPhoto(oldPhotoValue);
    }
    return text;
  }

  const photoDir = getResidentPhotoDirectory();
  const filename = `resident-${residentId}-${Date.now()}.${imageParts.extension}`;
  const filePath = path.join(photoDir, filename);

  await fs.promises.writeFile(filePath, Buffer.from(imageParts.base64, 'base64'));
  await removeManagedResidentPhoto(oldPhotoValue);

  return pathToFileURL(filePath).href;
}

async function saveResidentFamilyMembers(conn, residentId, familyMembers = []) {
  await conn.execute(
    `
    DELETE FROM resident_family_members
    WHERE resident_id = ?
    `,
    [residentId]
  );

  if (!Array.isArray(familyMembers)) return;

  const cleanFamilyMembers = familyMembers.filter(member => {
    return String(member.full_name || '').trim() !== '';
  });

  for (const member of cleanFamilyMembers) {
    await conn.execute(
      `
      INSERT INTO resident_family_members (
        resident_id,
        full_name,
        relationship,
        birthdate,
        age,
        civil_status,
        educational_attainment,
        occupation
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        residentId,
        toNull(member.full_name),
        toNull(member.relationship),
        cleanDate(member.birthdate),
        toNumberOrNull(member.age),
        toNull(member.civil_status),
        toNull(member.educational_attainment),
        toNull(member.occupation)
      ]
    );
  }
}

const residentFields = [
  'first_name',
  'middle_name',
  'last_name',
  'suffix',
  'sex',
  'birthdate',
  'age',
  'birthplace',
  'civil_status',
  'contact_number',
  'address',
  'barangay_id',
  'category_id',
  'educational_attainment',
  'occupation',
  'monthly_income',
  'household_number',
  'type_of_beneficiary',
  'profile_photo',
  'family_composition_notes',
  'problem_presented',
  'brief_findings',
  'recommendation',
  'status',
  'intake_date'
];

function residentValues(data) {
  return [
    toNull(data.first_name),
    toNull(data.middle_name),
    toNull(data.last_name),
    toNull(data.suffix),

    toNull(data.sex),
    cleanDate(data.birthdate),
    toNumberOrNull(data.age),
    toNull(data.birthplace),
    toNull(data.civil_status),

    toNull(data.contact_number),
    toNull(data.address),
    toNumberOrNull(data.barangay_id),
    toNumberOrNull(data.category_id),

    toNull(data.educational_attainment),
    toNull(data.occupation),
    toMoney(data.monthly_income),
    toNull(data.household_number),
    toNull(data.type_of_beneficiary),

    toNull(data.profile_photo),

    toNull(data.family_composition_notes),
    toNull(data.problem_presented),
    toNull(data.brief_findings),
    toNull(data.recommendation),

    toNull(data.status) || 'Active',
    cleanDate(data.intake_date)
  ];
}

/* =========================
   MASTER DATA
========================= */

ipcMain.handle('master:categories', async () => {
  const [rows] = await db.execute(
    `
    SELECT
      category_id,
      category_name,
      description,
      status
    FROM categories
    WHERE status = 'Active'
    ORDER BY category_name ASC
    `
  );

  return rows;
});

ipcMain.handle('master:barangays', async () => {
  const [rows] = await pool.query(`
    SELECT 
      barangay_id AS id,
      barangay_name AS name,
      description,
      status,
      created_at
    FROM barangays
    ORDER BY barangay_name ASC
  `);

  return rows;
});

ipcMain.handle('barangays:create', async (event, data) => {
  const { name, description, status } = data;

  const [result] = await pool.query(
    `
    INSERT INTO barangays (barangay_name, description, status)
    VALUES (?, ?, ?)
    `,
    [name, description, status || 'Active']
  );

  return {
    success: true,
    id: result.insertId
  };
});

ipcMain.handle('barangays:update', async (event, payload) => {
  const { id, data } = payload;
  const { name, description, status } = data;

  await pool.query(
    `
    UPDATE barangays
    SET barangay_name = ?, description = ?, status = ?
    WHERE barangay_id = ?
    `,
    [name, description, status, id]
  );

  return {
    success: true
  };
});

ipcMain.handle('barangays:deactivate', async (event, id) => {
  await pool.query(
    `
    UPDATE barangays
    SET status = 'Inactive'
    WHERE barangay_id = ?
    `,
    [id]
  );

  return {
    success: true
  };
});

ipcMain.handle('barangays:activate', async (event, id) => {
  await pool.query(
    `
    UPDATE barangays
    SET status = 'Active'
    WHERE barangay_id = ?
    `,
    [id]
  );

  return {
    success: true
  };
});

/* =========================
   RESIDENTS
========================= */

ipcMain.handle('residents:list', async (event, search = '') => {
  const keyword = `%${String(search || '').trim()}%`;

  const [rows] = await db.execute(
    `
    SELECT
      r.resident_id,
      r.resident_code,
      r.first_name,
      r.middle_name,
      r.last_name,
      r.suffix,
      r.sex,
      r.birthdate,
      r.age,
      r.contact_number,
      r.address,
      r.barangay_id,
      r.category_id,
      r.educational_attainment,
      r.occupation,
      r.monthly_income,
      r.type_of_beneficiary,
      r.fingerprint_status,
      r.status,
      r.intake_date,
      c.category_name,
      b.barangay_name
    FROM residents r
    LEFT JOIN categories c ON r.category_id = c.category_id
    LEFT JOIN barangays b ON r.barangay_id = b.barangay_id
    WHERE
      r.resident_code LIKE ?
      OR r.first_name LIKE ?
      OR r.middle_name LIKE ?
      OR r.last_name LIKE ?
      OR r.contact_number LIKE ?
      OR c.category_name LIKE ?
      OR b.barangay_name LIKE ?
      OR r.status LIKE ?
    ORDER BY r.resident_id DESC
    `,
    [keyword, keyword, keyword, keyword, keyword, keyword, keyword, keyword]
  );

  return rows;
});

ipcMain.handle('residents:get', async (event, id) => {
  const [rows] = await db.execute(
    `
    SELECT
      r.resident_id,
      r.resident_code,
      r.first_name,
      r.middle_name,
      r.last_name,
      r.suffix,
      r.sex,
      DATE_FORMAT(r.birthdate, '%Y-%m-%d') AS birthdate,
      r.age,
      r.birthplace,
      r.civil_status,
      r.contact_number,
      r.address,
      r.barangay_id,
      r.category_id,
      r.educational_attainment,
      r.occupation,
      r.monthly_income,
      r.household_number,
      r.type_of_beneficiary,
      r.profile_photo,
      r.fingerprint_status,
      r.family_composition_notes,
      r.problem_presented,
      r.brief_findings,
      r.recommendation,
      r.status,
      DATE_FORMAT(r.intake_date, '%Y-%m-%d') AS intake_date,
      r.created_at,
      r.updated_at,
      c.category_name,
      b.barangay_name
    FROM residents r
    LEFT JOIN categories c ON r.category_id = c.category_id
    LEFT JOIN barangays b ON r.barangay_id = b.barangay_id
    WHERE r.resident_id = ?
    LIMIT 1
    `,
    [id]
  );

  if (!rows.length) return null;

  const resident = rows[0];

  const [familyRows] = await db.execute(
    `
    SELECT
      family_member_id,
      resident_id,
      full_name,
      relationship,
      DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate,
      age,
      civil_status,
      educational_attainment,
      occupation
    FROM resident_family_members
    WHERE resident_id = ?
    ORDER BY family_member_id ASC
    `,
    [id]
  );

  resident.family = familyRows;

  return resident;
});

ipcMain.handle('residents:create', async (event, data) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const placeholders = residentFields.map(() => '?').join(', ');
    const fields = residentFields.join(', ');

    // Insert first without photo so we can use the resident_id in the filename.
    const insertData = {
      ...data,
      profile_photo: null
    };

    const [result] = await conn.execute(
      `
      INSERT INTO residents (${fields})
      VALUES (${placeholders})
      `,
      residentValues(insertData)
    );

    const residentId = result.insertId;
    const residentCode = `RES-${String(residentId).padStart(4, '0')}`;
    const savedPhoto = await saveResidentPhotoFile(data.profile_photo, residentId, null);

    await conn.execute(
      `
      UPDATE residents
      SET resident_code = ?, profile_photo = ?
      WHERE resident_id = ?
      `,
      [residentCode, savedPhoto, residentId]
    );

    await saveResidentFamilyMembers(conn, residentId, data.family_members);

    await conn.commit();

    return {
      success: true,
      resident_id: residentId,
      resident_code: residentCode,
      profile_photo: savedPhoto
    };

  } catch (error) {
    await conn.rollback();
    console.error(error);

    return {
      success: false,
      message: error.message
    };

  } finally {
    conn.release();
  }
});

ipcMain.handle('residents:update', async (event, payload) => {
  const { id, data } = payload;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [oldRows] = await conn.execute(
      `
      SELECT profile_photo
      FROM residents
      WHERE resident_id = ?
      LIMIT 1
      `,
      [id]
    );

    const oldPhoto = oldRows[0]?.profile_photo || null;
    const savedPhoto = await saveResidentPhotoFile(data.profile_photo, id, oldPhoto);

    const updateData = {
      ...data,
      profile_photo: savedPhoto
    };

    const setClause = residentFields.map(field => `${field} = ?`).join(', ');

    await conn.execute(
      `
      UPDATE residents
      SET ${setClause}
      WHERE resident_id = ?
      `,
      [...residentValues(updateData), id]
    );

    await saveResidentFamilyMembers(conn, id, data.family_members);

    await conn.commit();

    return {
      success: true,
      profile_photo: savedPhoto
    };

  } catch (error) {
    await conn.rollback();
    console.error(error);

    return {
      success: false,
      message: error.message
    };

  } finally {
    conn.release();
  }
});

ipcMain.handle('residents:deactivate', async (event, id) => {
  try {
    await db.execute(
      `
      UPDATE residents
      SET status = 'Deactivated'
      WHERE resident_id = ?
      `,
      [id]
    );

    return {
      success: true
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message
    };
  }
});

ipcMain.handle('residents:delete', async (event, id) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      `
      SELECT profile_photo
      FROM residents
      WHERE resident_id = ?
      LIMIT 1
      `,
      [id]
    );

    const oldPhoto = rows[0]?.profile_photo || null;

    await conn.execute(
      `
      DELETE FROM resident_family_members
      WHERE resident_id = ?
      `,
      [id]
    );

    await conn.execute(
      `
      DELETE FROM residents
      WHERE resident_id = ?
      `,
      [id]
    );

    await conn.commit();
    await removeManagedResidentPhoto(oldPhoto);

    return {
      success: true
    };

  } catch (error) {
    await conn.rollback();
    console.error(error);

    return {
      success: false,
      message: error.message
    };

  } finally {
    conn.release();
  }
});