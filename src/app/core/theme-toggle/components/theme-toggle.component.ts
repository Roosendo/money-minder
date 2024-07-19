import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent implements OnInit {
  private readonly STORAGE_THEME_ITEM = 'theme'
  private readonly DARK_CLASS = 'dark'
  private readonly LIGHT_CLASS = 'light'
  private platformId

  constructor() {
    this.platformId = inject(PLATFORM_ID)
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this.setTheme()
  }

  private setTheme(): void {
    const triggerLightTheme = document.getElementById('light-theme')
    const triggerDarkTheme = document.getElementById('dark-theme')

    const theme = (() => {
      if (typeof localStorage !== 'undefined' && localStorage.getItem(this.STORAGE_THEME_ITEM)) {
        return localStorage.getItem(this.STORAGE_THEME_ITEM)
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return this.DARK_CLASS
      }
      return this.LIGHT_CLASS
    })()

    if (theme === this.DARK_CLASS) {
      document.documentElement.classList.add(this.DARK_CLASS)
    } else {
      document.documentElement.classList.remove(this.DARK_CLASS)
    }

    if (theme) localStorage.setItem(this.STORAGE_THEME_ITEM, theme)

    triggerLightTheme?.addEventListener('click', () => {
      document.documentElement.classList.remove(this.DARK_CLASS)
      localStorage.setItem(this.STORAGE_THEME_ITEM, this.LIGHT_CLASS)
    })

    triggerDarkTheme?.addEventListener('click', () => {
      document.documentElement.classList.add(this.DARK_CLASS)
      localStorage.setItem(this.STORAGE_THEME_ITEM, this.DARK_CLASS)
    })
  }
}
