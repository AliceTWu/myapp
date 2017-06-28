'use strict';

import users from './users'
//import v1 from './v1'

export default app => {
	app.use('/users', users);
} 
