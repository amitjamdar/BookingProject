import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NestedTitlePipe } from './title.pipe';
import { ProjectFeedbackComponent } from './project/project-feedback/project-feedback.component';
import { LogoutComponent } from './logout/logout.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './modal/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectComponent,
    ProjectListComponent,
    PageNotFoundComponent,
    // Pipes
    NestedTitlePipe,
    ProjectFeedbackComponent,
    LogoutComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule 
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
