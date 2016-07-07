import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Load layouts
// const layouts = '/imports/ui/layouts/';

import '/imports/ui/layouts/landing.js';

function render() {
  BlazeLayout.render(this.name);
}

FlowRouter.route('/landing', {
  name: 'landing',
  action: render,
});
