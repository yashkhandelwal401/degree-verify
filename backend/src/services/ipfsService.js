import { v4 as uuidv4 } from 'uuid';

export async function uploadToIpfs(file) {
  const mockCid = `bafy-${uuidv4()}`;
  return {
    cid: mockCid,
    filename: file.originalname,
    mimetype: file.mimetype
  };
}
