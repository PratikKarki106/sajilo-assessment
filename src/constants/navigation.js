export const SECTIONS = [
  {
    id: 'users',
    label: 'User Dashboard',
    path: '/users',
    match: (pathname) => pathname === '/' || pathname.startsWith('/users'),
    items: [{ label: 'User List', path: '/users' }],
  },
  {
    id: 'shop',
    label: 'E-Commerce Shop',
    path: '/products',
    match: (pathname) =>
      pathname.startsWith('/products') || pathname.startsWith('/cart'),
    items: [
      { label: 'Products', path: '/products', end: true },
      { label: 'Cart', path: '/cart', end: true },
    ],
  },
];

export function getActiveSection(pathname) {
  return SECTIONS.find((section) => section.match(pathname)) ?? SECTIONS[0];
}
