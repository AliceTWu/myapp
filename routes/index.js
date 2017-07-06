'use strict';

import v2 from './v2'

export default app => {
	app.use('/2', v2);
} 
