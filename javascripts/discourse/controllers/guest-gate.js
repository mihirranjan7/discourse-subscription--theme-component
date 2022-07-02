import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { setting } from 'discourse/lib/computed';

export default Ember.Controller.extend(ModalFunctionality, {
  login: Ember.inject.controller(),

  ssoEnabled: setting('enable_discourse_connect'),

  actions: {
    externalLogin(provider) {
      this.get('login').send('externalLogin', provider);
    }
  }

});
