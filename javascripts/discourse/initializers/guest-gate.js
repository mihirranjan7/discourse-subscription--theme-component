// discourse-guest-gate-theme-component/javascripts/discourse/initializers/guest-gate.js
import { withPluginApi } from "discourse/lib/plugin-api";
import { startPageTracking } from "discourse/lib/page-tracker";
import { viewTrackingRequired } from "discourse/lib/ajax";
import SubscriptionGateModal from "../components/modal/guest-gate"; // Renamed import
import { cleanupLightboxes } from "discourse/lib/lightbox";

const botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";

export default {
  name: "subscription-gate", // Renamed initializer
  after: "inject-objects",

  initialize(container) {
    withPluginApi("0.8", (api) => {
      const user = container.lookup("service:current-user");
      const modal = container.lookup("service:modal");
      const siteSettings = container.lookup("service:site-settings");
      const appEvents = container.lookup("service:app-events");
      const router = container.lookup("router:main");

      // Only proceed if the subscription gate is enabled
      if (!settings.enable_subscription_gate) {
        return;
      }

      // Crucial change: Gate now shows ONLY for logged-in users
      if (!user) {
        return;
      }

      // Initialize user preferences for topic views and last shown timestamp
      let topicViewCount = user.preferences.subscription_gate_topic_view_count || 0;
      let lastShownTimestamp = user.preferences.subscription_gate_last_shown_timestamp || 0;

      // Logic for showing gate on thumbnail click
      if (settings.gate_show_when_thumbnail_clicked) {
        if (siteSettings.enable_experimental_lightbox) {
          api.onAppEvent("lightbox:opened", () => {
            modal.show(SubscriptionGateModal);
            cleanupLightboxes();
          });
        } else {
          $("body").on("click", "a.lightbox", function () {
            modal.show(SubscriptionGateModal);
            $.magnificPopup.instance.close();
          });
        }
      } else {
        // Start page tracking for topic views
        router.on("routeWillChange", viewTrackingRequired);
        startPageTracking(router, appEvents);

        let gateShownOnceThisSession = false; // Reset per session

        appEvents.on("page:changed", (data) => {
          const path = router.currentURL;

          let urlShowMatch = false;
          let urlHideMatch = false;

          let isBot = new RegExp(botPattern, "i").test(navigator.userAgent);

          // Check URL for showing gate
          if (settings.url_for_show && settings.url_for_show.length) {
            const allowedPaths = settings.url_for_show.split("|");
            urlShowMatch = allowedPaths.some((allowedPath) => {
              if (allowedPath.slice(-1) === "*") {
                return path.indexOf(allowedPath.slice(0, -1)) === 0;
              }
              return path === allowedPath;
            });
          }

          // Check URL for hiding gate
          if (settings.url_for_hide && settings.url_for_hide.length) {
            // Ensure /subscription* is always in url_for_hide to avoid infinite loops
            const disallowedPaths = (settings.url_for_hide + "|/subscription*").split("|");
            urlHideMatch = disallowedPaths.some((disallowedPath) => {
              if (disallowedPath.slice(-1) === "*") {
                return path.indexOf(disallowedPath.slice(0, -1)) === 0;
              }
              return path === disallowedPath;
            });
          }

          // --- Topic View Logic ---
          if (settings.subscription_gate_topic_views_enabled) {
            topicViewCount++;
            user.setPreference("subscription_gate_topic_view_count", topicViewCount); // Save preference
          }
          const maxViews = parseInt(settings.max_subscription_topic_views, 10);
          const hitMaxViews = settings.subscription_gate_topic_views_enabled && topicViewCount >= maxViews;

          // --- Random Daily/Bi-Daily Logic ---
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          const daysSinceLastShow = (now - lastShownTimestamp) / oneDay;
          const requiredDays = parseInt(settings.subscription_gate_random_frequency_days, 10);
          const shouldRandomlyShow =
            settings.subscription_gate_random_daily_enabled &&
            daysSinceLastShow >= requiredDays &&
            Math.random() < 0.5; // 50% chance if enough days have passed

          // --- Combined Gate Display Condition ---
          const showGateBool =
            urlShowMatch &&
            !urlHideMatch &&
            !isBot &&
            (hitMaxViews || shouldRandomlyShow) &&
            !(settings.gate_show_only_once && gateShownOnceThisSession);

          if (showGateBool) {
            // Update user preferences
            if (settings.subscription_gate_topic_views_enabled) {
              // Reset topic view count randomly so it's not always on the same topic number
              topicViewCount = getRandomInt(0, maxViews + 1);
              user.setPreference("subscription_gate_topic_view_count", topicViewCount);
            }

            if (settings.subscription_gate_random_daily_enabled) {
              lastShownTimestamp = now;
              user.setPreference("subscription_gate_last_shown_timestamp", lastShownTimestamp);
            }

            if (settings.gate_show_only_once) {
              gateShownOnceThisSession = true;
            }

            modal.show(SubscriptionGateModal);
          }
        });
      }
    });
  },
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

