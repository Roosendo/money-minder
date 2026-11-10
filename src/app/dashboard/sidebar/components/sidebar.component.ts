import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { BtnLoginComponent } from "@app/btn-login";
import { ThemeToggleComponent } from "@app/core";
import { AuthCacheService } from "@app/services";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    ThemeToggleComponent,
    BtnLoginComponent,
    CommonModule,
  ],
})
export class SidebarComponent {
  private readonly authCacheService;
  private readonly router;

  /** Match each router link exactly so only the current section is active. */
  readonly linkMatch = { exact: true } as const;

  isLogged;
  user;

  constructor() {
    this.authCacheService = inject(AuthCacheService);
    this.router = inject(Router);

    this.isLogged = this.authCacheService.isLoggedIn;
    this.user = this.authCacheService.user;
  }

  isSidebarOpen = false;

  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const separator = document.getElementById("separator-sidebar");

    sidebar?.classList.toggle("-translate-x-full", this.isSidebarOpen);
    separator?.classList.toggle("translate-x-64", !this.isSidebarOpen);

    this.isSidebarOpen = !this.isSidebarOpen;
  }

  async logOut() {
    await this.authCacheService.logout();
    await this.router.navigate(["/login"]);
  }

  getCurrentRoute() {
    return this.router.url;
  }

  onAvatarError(event: Event): void {
    (event.target as HTMLImageElement).style.visibility = "hidden";
  }
}
