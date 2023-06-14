import { NgModule } from '@angular/core';

import { SharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { TranslateDirective } from './language/translate.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { DurationPipe } from './date/duration.pipe';
import { FormatMediumDatetimePipe } from './date/format-medium-datetime.pipe';
import { FormatMediumDatePipe } from './date/format-medium-date.pipe';
import { SortByDirective } from './sort/sort-by.directive';
import { SortDirective } from './sort/sort.directive';
import { ItemCountComponent } from './pagination/item-count.component';
import { FilterComponent } from './filter/filter.component';
import { ChatComponent } from './chat/chat.component';
import { FriendsListComponent } from './friends/list/list.component';
import { FriendsPageComponent } from './friends/page/page.component';
import { SocketIoModule } from 'ngx-socket-io';
import { ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from './countdown/countdown.component';
import { BgAnimationComponent } from './bg-animation/bg-animation.component';
import { LeagueJoinComponent } from './league/join-button/league-join.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  imports: [SharedLibsModule, SocketIoModule, CommonModule],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    FilterComponent,
    ChatComponent,
    CountdownComponent,
    BgAnimationComponent,
    FriendsListComponent,
    FriendsPageComponent,
    LeagueJoinComponent,
    ProgressBarComponent,
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    FilterComponent,
    ChatComponent,
    CountdownComponent,
    BgAnimationComponent,
    FriendsListComponent,
    FriendsPageComponent,
    LeagueJoinComponent,
    ProgressBarComponent,
  ],
  providers: [ChatService],
})
export class SharedModule {}
