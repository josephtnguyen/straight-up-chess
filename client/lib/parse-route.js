export default function parseRoute(hashRoute) {
  const path = hashRoute.replace('#', '');
  return path;
}
