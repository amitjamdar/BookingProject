import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { project } from './project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projectsURL = 'http://localhost:3000/projects';
  projectFeedbackURL = 'http://localhost:3000/projectFeedback';
  usersFeedbackObj: any;
  httpOptions: { headers?: HttpHeaders | { [header: string]: string | string[]; }; observe: "events"; responseType?: "json"; withCredentials?: boolean; };
  handleError: any;

  constructor(private http: HttpClient, private router: Router) {}

  getProjects(): Observable<Array<project>> {
    return this.http.get<Array<project>>(this.projectsURL, {
      observe: 'body',
    });
  }

  getAllProjectFeedback() {
    return this.http.get(this.projectFeedbackURL);
  }

  getProjectFeedbackById(id) {
    return this.http.get(`${this.projectFeedbackURL}/${id}`);
  }

  getProjectFeedbackUserId(userId) {
    return this.http.get(`${this.projectFeedbackURL}/${userId}`);
  }

  getFeebackByUserAndProject(userId, projectId) {
    return this.http.get(`${this.projectFeedbackURL}`, {
      params: {
        userId: userId,
        projectId: projectId,
      },
    });
  }

  editProjectFeedback(feedbackId, feedback){
    return this.http.patch(
      `${this.projectFeedbackURL}/${feedbackId}`,
      feedback
    );
  }
  addEditProjectFeedback(feedback) {
    const user = JSON.parse(sessionStorage.getItem('loginUser'));
    const userId = user[0].id;
    // this.getFeebackByUserAndProject(userId, feedback.projectId).subscribe(
    //   (feebackObj) => (this.usersFeedbackObj = feebackObj)
    // );

    
    if (this.usersFeedbackObj) {
      const feedbackId = this.usersFeedbackObj.id;
      return this.http.patch(
        `${this.projectFeedbackURL}/${feedbackId}`,
        feedback
      );
    } else {
      return this.http.post(`${this.projectFeedbackURL}`, feedback);
    }
  }

  editFeedback(feedbackId) {
    return this.router.navigate(['/project/projectFeedback', feedbackId]);
  }

  deleteFeedback(feedbackId) {
    return this.http.delete(`${this.projectFeedbackURL}/${feedbackId}`, {
      observe: 'response',
    });
  }

  updateEmployee(id: string, feedback: any): Observable<project> {
    return this.http.put<project>(this.projectFeedbackURL +  id, JSON.stringify(feedback), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
 
}
