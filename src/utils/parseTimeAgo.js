export default function parseTimeAgo(unixSeconds) {
  const now = Math.floor(Date.now() / 1000); 
  const diff = now - unixSeconds; 

  if (diff < 60) return 'только что';

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  const weeks = Math.floor(diff / 604800);

  if (weeks > 0) return `${weeks} нед. назад`;
  if (days > 0) return `${days} дн. назад`;
  if (hours > 0) return `${hours} час. назад`;
  if (minutes > 0) return `${minutes} мин. назад`;
}