import { NgOptimizedImage } from "@angular/common";
import { Component, inject, signal } from "@angular/core";

import { NavigationBttnComponent } from "@app/core/navigation-bttn";
import { AuthCacheService } from "@app/services/auth-cache.service";

@Component({
  selector: "app-btn-login",
  templateUrl: "./btn-login.component.html",
  imports: [NgOptimizedImage, NavigationBttnComponent],
})
export class BtnLoginComponent {
  private readonly authCache = inject(AuthCacheService);

  readonly user = this.authCache.user;
  readonly isLogged = this.authCache.isLoggedIn;
  readonly loginError = signal(false);

  redirectTo(provider: "google" | "github"): void {
    this.loginError.set(false);
    try {
      this.authCache.login(provider);
    } catch {
      this.loginError.set(true);
    }
  }

  async logout(): Promise<void> {
    await this.authCache.logout();
  }

  onAvatarError(event: Event): void {
    (event.target as HTMLImageElement).style.visibility = "hidden";
  }
}
