import { withPluginApi } from "discourse/lib/plugin-api";
import { startPageTracking } from "discourse/lib/page-tracker";
import { viewTrackingRequired } from "discourse/lib/ajax";
import GuestGateModal from "../components/modal/guest-gate";
import { cleanupLightboxes } from "discourse/lib/lightbox";

const botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";

export default {
  name: "guest-gate",
  after: "inject-objects",

  initialize(container) {
    withPluginApi("0.8", api => {
      const user = container.lookup("service:current-user");
      const modal = container.lookup("service:modal");
      this.siteSettings = container.lookup("service:site-settings");

      if (user) {
        return;
      } // must not be logged in
      
      if (settings.gate_show_when_thumbnail_clicked) {
        if (this.siteSettings.enable_experimental_lightbox) {
          // New lightbox
          api.onAppEvent('lightbox:opened', () => {            
            modal.show(GuestGateModal);
            cleanupLightboxes();
          });
        } else {
          // Old lightbox
          $("body").on("click", "a.lightbox", function() {
            modal.show(GuestGateModal);
            $.magnificPopup.instance.close();
          });
        }
      } else {
        let pageView = 0;
        // Tell our AJAX system to track a page transition
        const router = container.lookup("router:main");
        router.on("routeWillChange", viewTrackingRequired);

        const appEvents = container.lookup("service:app-events");
        startPageTracking(router, appEvents);
        let gateShownOnce = false;


        appEvents.on("page:changed", data => {
          
          const path = router.currentURL;
          
          let urlShowMatch;
          let urlHideMatch;

          let isBot = false;
          let re = new RegExp(botPattern, "i");
          if (re.test(navigator.userAgent)) {
            isBot = true;
          }
          
          if (settings.url_for_show.length) {
            const allowedPaths = settings.url_for_show.split("|");
            urlShowMatch = allowedPaths.some((allowedPath) => {
              if(allowedPath.slice(-1) === "*") {
                return path.indexOf(allowedPath.slice(0, -1)) === 0;
              }
              return path === allowedPath;
            });
          }
          
          if (settings.url_for_hide.length) {
            const disallowedPaths = settings.url_for_hide.split("|");
            urlHideMatch = disallowedPaths.some((disallowedPaths) => {
              if(disallowedPaths.slice(-1) === "*") {
                return path.indexOf(disallowedPaths.slice(0, -1)) === 0;
              }
              return path === disallowedPaths;
            });
          }
            
          const maxViews = parseInt(settings.max_guest_topic_views);
          pageView++;     
          const hitMaxViews = pageView >= maxViews;
          const showGateBool = urlShowMatch && !urlHideMatch && hitMaxViews && !isBot && !gateShownOnce;
            
          if (showGateBool) {
            if (settings.gate_show_only_once) {
              gateShownOnce = true;
            }
            pageView = getRandomInt(0, maxViews + 1);
                
            modal.show(GuestGateModal);
          }
        });
      }
    });
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
