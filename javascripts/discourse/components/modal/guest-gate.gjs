import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import concatClass from "discourse/helpers/concat-class";
import routeAction from "discourse/helpers/route-action";
import replaceEmoji from "discourse/helpers/replace-emoji";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import { and, eq, not, or } from "truth-helpers";
import I18n from "discourse-i18n";

export default class GuestGateModal extends Component {  
  @service siteSettings;

  get guestGateModalTitle() {
    return I18n.t(themePrefix("guest_gate.title"));
  }

  get customBigText() {
    return htmlSafe(I18n.t(themePrefix("custom_gate.big_text")));
  }

  get customLittleText() {
    return htmlSafe(I18n.t(themePrefix("custom_gate.little_text")));
  }

  get signupCtaIntro() {
    return replaceEmoji(I18n.t("signup_cta.intro"));
  }

  get signupCtaValueProp() {
    return replaceEmoji(I18n.t("signup_cta.value_prop"));
  }

  get guestGateLogin() {
    return I18n.t(themePrefix("guest_gate.log_in"));
  }

  get guestGateSignup() {
    return I18n.t(themePrefix("guest_gate.sign_up"));
  }

  get guestGateSsoSignup() {
    return I18n.t(themePrefix("guest_gate.sso_sign_up"));
  }

  get guestGateOr() {
    return I18n.t(themePrefix("guest_gate.or"));
  }

  @action
  externalLogin(provider) {
    // we will automatically redirect to the external auth service
    this.login.externalLogin(provider, { signup: true });
  }

  <template>
    <DModal
      @closeModal={{@closeModal}}
      @title={{this.guestGateModalTitle}}
      class={{concatClass
        "gate"
        (if settings.custom_gate_enabled "custom-gate")
      }}
      @dismissable={{if settings.dismissable_false false true}}
    >
      <:body>
        {{#if settings.custom_gate_enabled}}
          <div class="custom-gate-content">
            <img src="{{settings.custom_gate_image}}"/>
            <h2>{{this.customBigText}}</h2>
            <p>{{this.customLittleText}}</p>
          </div>
        
        {{else}}
        
          <div>
            <p>{{this.signupCtaIntro}}</p>
            <p>{{this.signupCtaValueProp}}</p>
          </div>
        {{/if}}

        {{this.externalLogin}}
      </:body>
      
      <:footer>
        {{#if this.siteSettings.enable_discourse_connect}}
          {{#if settings.use_gate_buttons}}
            <DButton
              @class={{settings.login_button_style}}
              @icon={{settings.login_icon}}
              @label={{this.guestGateSsoSignup}}
              @action={{routeAction "showLogin"}}
            />
            {{#if settings.enable_discourse_connect_signup}}
              <DButton
                @class={{settings.signup_button_style}}
                @icon={{settings.signup_icon}}
                @label={{this.guestGateSsoSignup}}
                @href={{settings.discourse_connect_signup_url}}
              />
            {{/if}}
            
          {{else}}
            
            <DButton
              @class="btn-transparent"
              @label={{this.guestGateSsoSignup}}
              @action={{routeAction "showLogin"}}
            />
    
            {{#if settings.enable_discourse_connect_signup}}
              {{this.guestGateOr}}
              <DButton
                @class="btn-transparent"
                @label={{this.guestGateSsoSignup}}
                @href={{settings.discourse_connect_signup_url}}
              />
            {{/if}}
          {{/if}}
                  
        {{else}}
                  
          {{#if settings.use_gate_buttons}}
            {{#if settings.custom_url_enabled}}
              <DButton
                @class={{settings.login_button_style}}
                @icon={{settings.login_icon}}
                @label={{this.guestGateLogin}}
                @href={{settings.custom_login_url}}
              />
              <DButton
                @class={{settings.signup_button_style}}
                @icon={{settings.signup_icon}}
                @label={{this.guestGateSignup}}
                @href={{settings.custom_signup_url}}
              />
              
            {{else}}
              
              <DButton
                @class={{settings.login_button_style}}
                @icon={{settings.login_icon}}
                @label={{this.guestGateLogin}}
                @action={{routeAction "showLogin"}}
              />
              <DButton
                @class={{settings.signup_button_style}}
                @icon={{settings.signup_icon}}
                @label={{this.guestGateSignup}}
                @action={{routeAction "showCreateAccount"}}
              />
            {{/if}}
                
          {{else}}
              
            {{#if settings.custom_url_enabled}}
              <DButton
                @class="btn-transparent"
                @label={{this.guestGateLogin}}
                @href={{settings.custom_login_url}}
              />
    
              {{this.guestGateOr}}
              
              <DButton
                @class="btn-transparent"
                @label={{this.guestGateSignup}}
                @href={{settings.custom_signup_url}}
              />
                  
            {{else}}
                
              <DButton
                @class="btn-transparent"
                @label={{this.guestGateLogin}}
                @action={{routeAction "showLogin"}}
              />
    
              {{this.guestGateOr}}
    
              <DButton
                @class="btn-transparent"
                @label={{this.guestGateSignup}}
                @action={{routeAction "showCreateAccount"}}
              />
            {{/if}}
          {{/if}}
        {{/if}}
      </:footer>
    </DModal>
  </template>
}
