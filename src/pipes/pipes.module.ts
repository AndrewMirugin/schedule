import { NgModule } from '@angular/core';
import { CourseChoosingPipe } from './course-choosing/course-choosing';
import { SortByAlpPipe } from './sort-by-alp/sort-by-alp';
@NgModule({
	declarations: [CourseChoosingPipe,
    SortByAlpPipe],
	imports: [],
	exports: [CourseChoosingPipe,
    SortByAlpPipe]
})
export class PipesModule {}
