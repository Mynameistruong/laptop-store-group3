export function getImageUrl(src) {
  return src && src.startsWith('http') ? src : '/no-image.svg';
}
