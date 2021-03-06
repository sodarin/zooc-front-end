import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TrialService} from '../../service/trial/trial.service';
import {Trial} from '../../model/Trial';
import {Course} from '../../model/Course';
import {CourseService} from '../../service/course/course.service';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.css']
})
export class HomeContentComponent implements OnInit {

  freeTrials: Trial[];
  elaborateCourses: Course[];

  constructor(private router: Router, private routeInfo: ActivatedRoute,
              private freeTrailService: TrialService, private elaborateCourseService: CourseService) { }

  ngOnInit() {
    // TODO The enterprise ID is hard coded
    this.freeTrailService.getLatest(1, 3).subscribe(result => {
      this.freeTrials = result;
    });
    // TODO The enterprise ID is hard coded
    this.elaborateCourseService.getLatest(1, 3).subscribe(result => {
      this.elaborateCourses = result;
    });
  }

  navToTrialListPage() {
    this.router.navigateByUrl('/home/trials');
  }

  navToCourseListPage() {
    this.router.navigateByUrl('/home/courses');
  }

  navToTrialDetailPage(item: Trial) {
    this.router.navigate([`trials/${item.trialId}`], { relativeTo: this.routeInfo });
  }

  navToCourseDetailPage(item: Course) {
    this.router.navigate([`courses/${item.courseId}`], { relativeTo: this.routeInfo });
  }
}
