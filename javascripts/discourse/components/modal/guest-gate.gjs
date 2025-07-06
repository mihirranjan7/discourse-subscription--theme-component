// discourse-guest-gate-theme-component/javascripts/discourse/components/modal/guest-gate.gjs
import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import concatClass from "discourse/helpers/concat-class";
import themePrefix from "discourse/lib/theme-prefix"; // Ensure this is imported for themePrefix
import replaceEmoji from "discourse/helpers/replace-emoji";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import I18n from "discourse-i18n";

export default class SubscriptionGateModal extends Component { // Renamed class
  @service siteSettings;
  // @service login; // Removed: No longer needed for login actions

  get subscriptionGateModalTitle() {
    return I18n.t(themePrefix("subscription_gate.title"));
  }

  get customBigText() {
    return htmlSafe(I18n.t(themePrefix("custom_gate.big_text")));
  }

  get customLittleText() {
    return htmlSafe(I18n.t(themePrefix("custom_gate.little_text")));
  }

  get subscriptionCtaIntro() {
    return replaceEmoji(I18n.t(themePrefix("subscription_cta.intro")));
  }

  get subscriptionCtaValueProp() {
    return replaceEmoji(I118n.t(themePrefix("subscription_cta.value_prop")));
  }

  get subscriptionGateSubscribe() {
    return I18n.t(themePrefix("subscription_gate.subscribe"));
  }

  get subscriptionGateMaybeLater() {
    return I18n.t(themePrefix("subscription_gate.maybe_later"));
  }

  // @action // Removed: No longer needed for external login
  // externalLogin(provider) {
  //   this.login.externalLogin(provider, { signup: true });
  // }

  @action
  goToSubscriptionPage() {
    window.location.href = settings.subscription_gate_url;
  }

  <template>
    <DModal
      @closeModal={{@closeModal}}
      @title={{this.subscriptionGateModalTitle}}
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
            <p>{{this.subscriptionCtaIntro}}</p>
            <p>{{this.subscriptionCtaValueProp}}</p>
          </div>
        {{/if}}

        {{!-- <LoginButtons @externalLogin={{this.externalLogin}} @context="create-account" /> --}}
        {{!-- Removed: LoginButtons are not relevant for subscription --}}
      </:body>
      
      <:footer>
        {{#if settings.use_gate_buttons}}
          <DButton
            @class={{settings.subscribe_button_style}}
            @icon={{settings.subscribe_icon}}
            @translatedLabel={{this.subscriptionGateSubscribe}}
            @action={{this.goToSubscriptionPage}}
          />
          {{#unless settings.dismissable_false}}
            <DButton
              @class="btn-transparent"
              @icon={{settings.maybe_later_icon}}
              @translatedLabel={{this.subscriptionGateMaybeLater}}
              @action={{@closeModal}}
            />
          {{/unless}}
        {{else}}
          <DButton
            @class="btn-transparent"
            @translatedLabel={{this.subscriptionGateSubscribe}}
            @action={{this.goToSubscriptionPage}}
          />
          {{#unless settings.dismissable_false}}
            <DButton
              @class="btn-transparent"
              @translatedLabel={{this.subscriptionGateMaybeLater}}
              @action={{@closeModal}}
            />
          {{/unless}}
        {{/if}}
      </:footer>
    </DModal>
  </template>
}
