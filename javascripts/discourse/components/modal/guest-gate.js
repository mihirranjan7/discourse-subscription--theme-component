import Component from "@glimmer/component";
import { action } from "@ember/object";
import getURL from "discourse-common/lib/get-url";
import { getOwner } from "@ember/application";
import { inject as service } from "@ember/service";

export default class extends Component {
  @service modal;
  
  @action
  externalLogin(provider) {
    // we will automatically redirect to the external auth service
    this.modal.show(LoginModal, {
      model: {
        isExternalLogin: true,
        externalLoginMethod: provider,
        signup: true,
      },
    });
  }
}
