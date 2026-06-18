import { _decorator, Component, game } from 'cc';

const { ccclass } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    onStartGame() {
        console.log('[StartMenu] start game');
    }

    onAchievements() {
        console.log('[StartMenu] achievements');
    }

    onSettings() {
        console.log('[StartMenu] settings');
    }

    onHelp() {
        console.log('[StartMenu] help');
    }

    onQuit() {
        game.end();
    }
}
