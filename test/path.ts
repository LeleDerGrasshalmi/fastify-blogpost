import path from 'path';

export const getDataDir = () => path.join(process.cwd(), 'test', 'data');
export const getAuthorsFile = () => path.join(getDataDir(), 'authors.json');
