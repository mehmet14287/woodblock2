//
let MenuState = {

    bg: null,    

    shutdown: function()
    {
        this.bg = null;
    },

    //
    create: function()
    {
        this.bg = game.add.image(0, 0, 'bg_home_' + R.playerData.theme);

        let label = R.createText(355, 45, 40, R.playerData.score.toString(), '#e0b45b');

        //
        R.ui.createBigPlayButton(320, 470, game.world, this.onPlayButton, this);        
        R.ui.createThemeButton(320, 680, game.world, true);

        //
        this.setTheme();

        //
        Publisher.analyticsMenu();
    },

    onPlayButton: function()
    {
        game.state.start('play');
    },

    setTheme: function()
    {
        this.bg.loadTexture('bg_home_' + R.playerData.theme);        
        game.stage.backgroundColor = game.canvas.parentElement.style.backgroundColor = (R.playerData.theme === 1 ? '#382237' : '#3e271f');

        game.stage.backgroundColor = document.body.style.backgroundColor = (R.playerData.theme === 1 ? '#382237' : '#3e271f');
    }
};