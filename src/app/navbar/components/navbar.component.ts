import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavBarComponent implements OnInit, OnDestroy {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isSideBarOpen = false
  private navbar: HTMLElement | null = null
  private observer: IntersectionObserver | null = null

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.navbar = document.querySelector('#navbar-sticky')

      const sections = document.querySelectorAll('section')
      const navItems = document.querySelectorAll('li a')

      const callback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navItems.forEach((navItem) => {
              if (navItem.getAttribute('aria-label') === entry.target.id) {
                navItem.classList.add('text-cyan-500')
              } else {
                navItem.classList.remove('text-cyan-500')
              }
            })
          }
        })
      }

      this.observer = new IntersectionObserver(callback, {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
      })

      sections.forEach((section) => {
        this.observer?.observe(section)
      })

      document.onvisibilitychange = () => {
        if (document.visibilityState === 'hidden') {
          this.observer?.disconnect()
        } else {
          sections.forEach((section) => {
            this.observer?.observe(section)
          })
        }
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.observer?.disconnect()
    }
  }

  animateSidebar() {
    if (isPlatformBrowser(this.platformId) && this.navbar) {
      this.navbar.classList.toggle('hidden', this.isSideBarOpen)
      this.navbar.classList.toggle('flex', !this.isSideBarOpen)
      this.navbar.classList.toggle('animate-slide-in-top', !this.isSideBarOpen)
      this.navbar.classList.toggle('order-1', !this.isSideBarOpen)
      this.isSideBarOpen = !this.isSideBarOpen
    }
  }
}
