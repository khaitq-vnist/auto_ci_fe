import axios from 'axios';

export const fetchFileFromGitHub = async (
  owner: string,
  repo: string,
  path: string,
  branch: string = 'master'
): Promise<string> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const response = await axios.get(url, {
    headers: { Accept: 'application/vnd.github+json',
    'Authorization': `Bearer ` 
     },
  });
  if (response.status!== 200) {
    throw new Error('Failed to fetch file from GitHub');
  }
  return response.data;
};
