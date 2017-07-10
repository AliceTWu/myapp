'use strict';

import v2 from './v2'
// import status from './status'

export default app => {
	app.use('/2', v2);
/*	app.use('/statuses', status);*/
} 
