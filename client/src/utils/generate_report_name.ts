// Generate a form ID based on the current date, time, and user ID
export const generateFormId = (userName: string, reportPrompt: string) => {
  const words = userName.trim().split(/\s+/);
  let userId = '';
  let spaces = 0;
  for (const word of words) {
    if (spaces === 2) {
      break;
    }
    if (word.length > 0) {
      if (word.length >= 3) {
        userId += word.slice(0, 3).toLowerCase();
      } else {
        userId += word.toLowerCase();
      }
      spaces++;
    }
  }
  userId = userId.padEnd(6, 'x');
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  return `${reportPrompt}_${year}-${month}-${day}_${hour}-${minute}-${second}-${userId}`;
};
