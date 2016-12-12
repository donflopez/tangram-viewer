import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts/landing/landing.js';
import '/imports/ui/layouts/main/main';

function render() {
  BlazeLayout.render( this.name );
}

FlowRouter.route( '/', {
  name: 'main',
  action: render,
});

FlowRouter.route( '/landing', {
  name: 'landing',
  action: render,
});
