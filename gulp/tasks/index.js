import gulp from 'gulp'
import { templates }  from './templates'

gulp.task('templates', templates);

export const defaultTask = (cb) => cb();

// // default task
export default defaultTask
