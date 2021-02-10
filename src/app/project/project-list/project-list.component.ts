import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';
import { User } from 'src/app/login/user.interface';
import { UtilService } from 'src/app/utils.service';
import { project } from '../project.interface';
import { ProjectService } from '../project.service';
import { take } from 'rxjs/operators';
import { ModalService } from 'src/app/modal/modal.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  
  confirmedResult: boolean;
  inputResult: string;
  messageResult: boolean;
  projectFeedbackList = [];
  projectFeedbackCols: string[];
  page = 1;
  pageSize: number;
  currentPage = 1;
  itemsPerPage = 5;
  stars: number[] = [1, 2, 3, 4, 5];
  genderList:string[] = ['Male', 'Female'];
  gradeList:string[] = ['3.x','4.x','5.x'];
  odcList:string[] = ['ODC','NON-ODC'];
  buList:string[] = ['BU','TECH','HEALTH'];
  selectedValue: number;
  allProjects;
  allUsers;
  mySubscription: any;
  showModal : any;
  feedbackForm: FormGroup;
  projectList: any;
  submitted: boolean = false;
  editMode:boolean = false;
  feedbackId: any;
  projectFeedbackdata: any;
  constructor(
    private projectService: ProjectService,
    private utilService: UtilService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {}

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage*(pageNum - 1);
  }
  
  public changePagesize(num: number): void {
  this.itemsPerPage = this.pageSize + num;
}
  ngOnInit(): void {
    this.projectService.getAllProjectFeedback().subscribe(
      (feedbacks: any) => {
        forkJoin([
          this.authService.getAllUsers(),
          this.projectService.getProjects(),
        ]).subscribe((data) => {
          this.allUsers = data[0];
          this.allProjects = data[1];

          feedbacks.map((feedback) => {
            // show current user type wise records
            const user = JSON.parse(sessionStorage.getItem('loginUser'));
            const usertype = user ? user[0]?.type : '';
            // const userName = this.allUsers.filter(
            //   (e) => e.id === feedback.userId
            // )[0]?.name;
            // const projectName = this.allProjects.filter(
            //   (e) => e.id === feedback.projectId
            // )[0]?.name;

            this.projectFeedbackList.push({
              fname: feedback.fname,
              lname: feedback.lname,
              eid: feedback.eid,
              grade:feedback.grade,
              gender:feedback.gender,
              odc:feedback.odc,
              project:feedback.project,
              bu:feedback.bu,
              id:feedback.id
            });
            if (usertype === 'manager') {
            } else {
            }
          });

          this.projectFeedbackCols = this.utilService.nestedObjectKeys(
            this.projectFeedbackList[0]
          );
        });
      },
      (error) => console.error('getAllProjectFeedback', error),
      () => console.info('getAllProjectFeedback completed')
    );

    this.feedbackForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      eid: ['', Validators.required],
      grade:['',Validators.required],
      gender:['', Validators.required],
      odc: ['', Validators.required],
      bu:['', Validators.required],
      project: ['', Validators.required],
    });

    this.activatedRoute.params.subscribe((params) => {
      this.feedbackId = params['id'];
    });
    
    this.getProjectList();
  }
  get f() { return this.feedbackForm.controls; }

  feedbackEdit(feedbackId) {
    this.showModal = true;
    this.editMode = true;
    this.projectService.getProjectFeedbackById(feedbackId).subscribe(data=>{
      this.projectFeedbackdata = data;
      console.log(this.projectFeedbackdata);
      this.feedbackForm = this.formBuilder.group({
        fname: [this.projectFeedbackdata.fname, Validators.required],
        lname: [this.projectFeedbackdata.lname, Validators.required],
        eid: [this.projectFeedbackdata.eid, Validators.required],
        grade: [this.projectFeedbackdata.grade, Validators.required],
        gender: [this.projectFeedbackdata.gender, Validators.required],
        odc: [this.projectFeedbackdata.odc, Validators.required],
        project: [this.projectFeedbackdata.project, Validators.required],
        bu: [this.projectFeedbackdata.bu, Validators.required],
        id:[this.projectFeedbackdata.id]
      });
    });
  }

  feedbackDelete(feedbackId) {
    this.modalService.confirm(
      'Are you sure want to delete ? This action cananot be undone'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
        this.confirmedResult = result;
        if(this.confirmedResult){
          this.projectService.deleteFeedback(feedbackId).subscribe((data) => {
            if (data?.status === 200 && data?.ok === true) {
              this.router.navigate([this.router.url]);
            }
          });
        }
      });
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  onClick(event: any){
    this.showModal = true; // Show-Hide Modal Check
    this.submitted = false;
    this.feedbackForm.reset();
    this.editMode = false;
  }
  hide()
  {
    this.showModal = false;
  }
  addNewEmp(){
    this.submitted = true;
    if (this.feedbackForm.invalid) {
      return;
    }
    if(this.editMode){
      const feedbackId = this.feedbackForm.value.id;
      this.projectService.editProjectFeedback(feedbackId, this.feedbackForm.value).subscribe(data=>console.log(data))
      this.router.navigate(['/project/projectList']);
    }else{
        this.projectService.addEditProjectFeedback( this.feedbackForm.value).subscribe((data) => {
        console.info('Feedback creation status :', data);
        this.router.navigate(['/project/projectList']);
      });
    }
  }
  getProjectList() {
    this.projectService.getProjects().subscribe(
      (projects: any) => {
        console.log('Projects data--->', projects);
        this.projectList = projects;
      },
      (error) => {
        console.error('Error in projects service', error);
      },
      () => {
        console.info('All projects get getched');
      }
    );
  }
}
