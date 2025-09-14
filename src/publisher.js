//Publisher
let Publisher = {};

//Configurable Options

//Game languages
Publisher.languagesSupported = ["en"];

//The amount of time after the game loads before the first ad can be called, expressed in seconds
Publisher.firstAd = 0;

//The amount of time between ads being shown, expressed in seconds
Publisher.furtherAds = 60;

//Configuration to set whether or not ads are displayed at all.  Expressed as True / False
Publisher.enableAds = true;

//Rewarded video config
Publisher.rewardedVideoAd = true;

//
Publisher.channelID = "hallpass_0120-wood_block";

//Configuration to set whether or not the More Games button is displayed. Expressed as True/False
Publisher.enableMoreGames = false;

//Setting More Games URL
Publisher.moreGamesURL = "http://www.coolgames.com";

//Game settings
Publisher.gameOrientation = "portrait";

//
Publisher.gameName = "Wood Blocks";
//
Publisher.gameVersion = "1.0.2";
//
Publisher.gameCategory = "Puzzle";
//
Publisher.developerId = "0120";
//
Publisher.gameCode = "0120-wood_blocks";
//
Publisher.gameId = "0120-wood_blocks";
//
Publisher.gameAnalyticsId = "";

Publisher.banner = null;

Publisher.adBannerInterval = null;

Publisher.adBannerTimer = 145000

Publisher.bannerSlot = null;

//Boostermedia API
var Booster = window.Booster || {};

Booster.ready = function() {
  new Booster.Init({
    orientation: Publisher.gameOrientation,
    splash: true,
    minimalUI: true
  });

  Publisher.adSense = new Booster.Ad({
    type: "adsense",
    size: "300x250",
    channelID: Publisher.channelID
  });

  Publisher.community = new Booster.Community({
    position: 1,
    gameCode: Publisher.gameCode
  });

  Publisher.analytics = new Booster.Analytics({
    gameName: Publisher.gameName,
    gameId: Publisher.gameId,
    gameCategory: Publisher.gameCategory,
    developer: Publisher.developerId,
    gameAnalyticsId: Publisher.gameAnalyticsId
  });

  Publisher.moregames = new Booster.Moregames();

  Booster.onSplashFinishedEvent = startGame;

  Booster.onOpenTab = function() {
    if (game) game.paused = true;
  };

  Booster.onCloseTab = function() {
    if (game) game.paused = false;
  };

  Publisher.banner = new Booster.AdBanner({});
  Publisher.banner.show();
};

//wrapper

//ads
Publisher.timeAdShowed = -(Publisher.furtherAds - Publisher.firstAd);
Publisher.timeLoading = 0;

Publisher.showAdvertising = function() {
  if (Publisher.enableAds) {
    let now = game.time.totalElapsedSeconds() - Publisher.timeLoading;
    if (now - Publisher.timeAdShowed < Publisher.furtherAds) return;
    Publisher.timeAdShowed = now;

    if (game) game.paused = true;

    try {
      Publisher.adSense.showAdvertising({
        callback: function() {
          if (game) game.paused = false;
        }
      });
    } catch (e) {
      if (game) game.paused = false;
    }
  }
};

//Community Features
Publisher.submitScore = function(scoreValue) {
  try {
    Publisher.community.submitScore({
      score: scoreValue,
      callback: function() {
        Publisher.showAdvertising();
        Publisher.analyticsScore(scoreValue);
      }
    });
  } catch (e) {}
};

Publisher.submitSessionScore = function(scoreValue, level) {
  try {
    Publisher.community.submitSessionScore({
      score: scoreValue,
      level: level,
      callback: function() {
        Publisher.showAdvertising();
        Publisher.analyticsScore(scoreValue);
      }
    });
  } catch (e) {}
};

//Analytics
Publisher.analyticsMenu = function() {
  try {
    Publisher.analytics.menu();
  } catch (e) {}
};

Publisher.analyticsLevelFailed = function(currentLevel) {
  try {
    Publisher.analytics.levelFailed(currentLevel);
  } catch (e) {}
};

Publisher.analyticsScore = function(scoreValue) {
  try {
    Publisher.analytics.score(scoreValue);
  } catch (e) {}
};

//moregames
Publisher.moregamesRedirect = function() {
  if (Publisher.enableMoreGames) {
    try {
      Publisher.moregames.redirect();
    } catch (e) {
      window.open(Publisher.moreGamesURL, "_blank");
    }
  }
};

Publisher.resetTimerInterval = function() {
  clearInterval(Publisher.adBannerInterval);

  Publisher.adBannerInterval = setInterval(function() {
    Publisher.bannerRefresh();
  }, Publisher.adBannerTimer);
};

Publisher.bannerRefresh = function() {
  if(Publisher.bannerSlot) {
    window.googletag.pubads().refresh([Publisher.bannerSlot]);
  }
};

//AdVideoPlayer -> should be uncommented

Publisher.AdVideoPlayer = {
  overlay: null,
  onCompleteEvent: null,
  context: null,

  playVideo: function(onCompleteEvent, context) {
    window.Booster.RewardedVideo.play(
      onCompleteEvent,
      !!context ? context : this
    );
  }
};

//Init
Publisher.init = function() {
  let mode = (RegExp("bm.mode" + "=" + "(.+?)(&|$)").exec(location.search) || [
    ,
    null
  ])[1];

  let script = document.createElement("script");
  script.type = "text/javascript";
  script.setAttribute("id", "booster-api");

  if (mode == "test") {
    script.src = "http://games.bmmob.com/shared/booster/api.js";
  } else {
    script.src = "/shared/booster/api.js";
  }

  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(script, s);

  Publisher.resetTimerInterval();
};

Publisher.init();

window.RewardedVideoConfig = {
  AdTech: {
    adtechZones: {
      mobile: "4103", //test id
      desktop: "4102" //test id
    }
  },
  HyperMx: {
    descriptor: {
      frameClass: "adFrame",
      adClass: "hypermx",
      width: 800,
      height: 540
    },
    distId: "80801205", //test id
    siteId: "coolgames"
  }
};
