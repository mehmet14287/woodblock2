//
let BootState = {

    //
    init: function()
    {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = false;

        if(!game.device.desktop)
        {            
            game.scale.forceOrientation(false, true);
            game.scale.enterIncorrectOrientation.add(this.onEnterIncorrectOrientation, this);
            game.scale.leaveIncorrectOrientation.add(this.onLeaveIncorrectOrientation, this);            
        }

        game.scale.onSizeChange.add(this.onSizeChange, this);
        game.scale.setResizeCallback(this.onResize, this);

        game.input.maxPointers = 1;
        game.stage.disableVisibilityChange = true;

        //
        R.canAudio = game.device.canPlayAudio('ogg') || game.device.canPlayAudio('mp3');

        //
        this.additionalAudioCheck();
    },

    //
    onResize: function()
    {
        let ww = window.innerWidth;
        let wh = window.innerHeight;
        if(R.prevWindowHeight != wh) this.onSizeChange();

        let gameContainer = document.getElementById(game.parent);
        gameContainer.style.width = ww + 'px';
        gameContainer.style.height = wh + 'px';        
    },

    //
    onSizeChange: function()
    {
        this.resizeGame();
        game.state.resize(R.BASE_GAME_WIDTH, R.gameHeight);        
    },

    //
    resizeGame: function()
    {        
        let wh = window.innerHeight;    
        R.prevWindowHeight = wh;        

        let s = (R.BASE_GAME_HEIGHT + R.BANNER_HEIGHT) / parseInt(game.canvas.style.height);        

        R.gameHeight = R.BASE_GAME_HEIGHT + parseInt(R.BANNER_HEIGHT * s + 0.5);        

        game.scale.setGameSize(R.BASE_GAME_WIDTH, R.gameHeight);        
    },

    //
    preload: function()
    {
        // ====> DÜZELTME 1: OYUNUN ANA ADRESİNİ TANIMLAMA <====
        game.load.baseURL = 'https://mehmet14287.github.io/woodblock2/';

        // ====> DÜZELTME 2: YAZIM HATASINI DÜZELTME <====
        game.load.atlas('loading', 'assets/loading.png', 'assets/loading.json');
    },

    //
    create: function()
    {
        game.state.add('load', LoadState);
        game.state.add('menu', MenuState);
        game.state.add('play', PlayState);

        let fontFaceObserver = new FontFaceObserver(R.fontName);
        fontFaceObserver.load(null, 5000).then(function() { game.state.start('load'); }, this.fontLoadFailed);
    },

    fontLoadFailed: function()
    {
        R.fontName = 'Arial';
        game.state.start('load');
    },

    onEnterIncorrectOrientation: function()
    {
        if(game.scale.incorrectOrientation)
        {
            game.paused = true;
        }
    },

    onLeaveIncorrectOrientation: function()
    {
        game.paused = false;
    },

    additionalAudioCheck: function()
    {
        function isStock()
        {
            let matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
            return matches && matches[1] < 537;
        }

        let ua = navigator.userAgent;
        let isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock();
        let isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock();
        let isFujitsuStock = ((/F-01F/i).test(ua)) && isStock();

        if(isSharpStock || isXperiaAStock || isFujitsuStock) R.canAudio = false;
    }    
};
