'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navigation.module.css'

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className={styles.navigation}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={pathname === '/' ? styles.active : ''}>
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/test-api" className={pathname === '/test-api' ? styles.active : ''}>
            Test API
          </Link>
        </li>
      </ul>
    </nav>
  )
}