## Guest Gate Theme Component

**[See the theme component discussion here on Discourse](https://meta.discourse.org/t/guest-gate-theme-component/225107)**

### Short Description

Hello :wave: This theme component is created from https://meta.discourse.org/t/guest-gate-sign-up-popup-plugin/56625/. It can lock topics for anon visitors with a modal and force them to Sign Up or Login. The component can be use for an *alert* modal, encouraging visitors to sign up but allowing them to close the modal (for this, leave the `dismissable false` setting unchecked). Options include changing the number of topics that can be viewed before the modal is displayed.

### Screenshots

![Screenshot 2022-04-23 at 22 05 29](https://user-images.githubusercontent.com/71207900/164945247-04b20c10-51ba-4d63-a6d1-ace4ccdc6e7f.png)

**Tip:** If you use the "custom gate" option and want to hide the modal header (as on the image above) you have to delete the `guest_gate.title` field and hit a <kbd>space</kbd>. It will remove the modal title, so that you instead can use a title below the image.

![Screenshot 2022-04-23 at 22 03 16](https://user-images.githubusercontent.com/71207900/164945265-80af1181-2ab9-4a44-a1fb-73333b49d2ff.png)

![Screenshot 2022-04-23 at 21 36 30](https://user-images.githubusercontent.com/71207900/164945280-ea0cde9a-a7c3-44f5-b872-7bc9c843b213.png)

### Long Description

**You have two main gate options:**
1. Generic gate (default: it will use the Discourse Signup CTA text in modal). It uses these texts: `js.signup_cta.intro` and `js.signup_cta.value_prop`

2. Custom gate (you can customize the modal: add image, custom text and colors).

---

**And there are lot of other settings** 

**Guest Gate modal global settings**

![Screenshot 2022-05-18 at 10 44 48](https://user-images.githubusercontent.com/71207900/168998664-597cb9c9-167d-4b86-aba7-29e4ffe77bb7.png)

1. `max guest topic views`
*Number of topic views until gate displays. After the gate first appears, it appears randomly between 1 and this number.*
2. `dismissable false`
*Removes the close button, which prevents visitors from closing it.*
3. `use gate buttons`
*Use buttons on modal footer instead of links.*
4. `custom url enabled`
*Enable the custom login url and custom signup url options. The normal behaviour (if you leave this option unchecked) is for the Login or Sign Up modal to appear on the current topic page.*
5. `custom login url` 
*For example, /login is the home page with the “Login” modal displayed.*
6. `custom signup url`
*For example, /signup is the home page with the “Sign Up” modal displayed.*
7. `gate footer position`
*Footer buttons/links position.*
8. `gate show only once`
*Guest Gate modal show only once per session.*

---

**Custom Gate settings**

![Screenshot 2022-05-18 at 10 48 10](https://user-images.githubusercontent.com/71207900/168999137-9aaa1a9e-70e1-4596-8647-2877d9550e0d.png)

1. `custom gate enabled`
*Enable it if you want to customize the modal.*
2. `custom gate image`
*Upload an image to display at the top of the modal.*
3. `custom gate image width`
*The uploaded image width. You can use px, % etc, e.g. 100% will add a full modal width (minus padding) image.* 
4. `custom gate big text color`
*The "big text" appears below the image. You can set the color of the text.*
5. `custom gate little text color`
*The "little text" appears below the big text. You can set the color of the text.*
6. `custom gate background color`
*Change the modal background color.*
7. `custom gate link color`
*Change the footer link color. This applies if the `use gate buttons` setting is disabled and you have set up a custom gate.*

---

> **Credit** :heart: Huge thanks to the plugin authors, maintainers and contributors: @vinothkannans, @jgujgu and @michaeld 
