import multer from 'multer';
import fs from 'fs';

const deleteTemp = async () => {
  const dir = 'public/uploads/Temp';
  try {
    await fs.rmSync(dir, { recursive: true });
    console.log('successful removal directory');
  } catch (err) {
    console.error(err);
  }
  if (!fs.existsSync(dir)) {
    await fs.mkdirSync(dir);
    console.log('successful create directory ');
  }
};
export const uploadFile = async () => {
  const dir = 'public/uploads/Temp';
  await deleteTemp();
  const Storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, dir);
    },
    filename(req, file, cb) {
      cb(null, `${file.originalname}`);
    }
  });
  return multer({ storage: Storage }).single('file');
};

export const moveFile = async (nameFile, newName, dir) => {
  fs.copyFileSync(`public/uploads/Temp/${nameFile}`, `public/uploads/${dir}/${newName}`);
};

export const removeFile = async (name) => {
  fs.unlink(`public/uploads/${name}`, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
