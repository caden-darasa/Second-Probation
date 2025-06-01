import { _decorator, AudioClip, AudioSource, Component, director, sys } from "cc";
import { isNullOrEmpty } from "./Utils/Utils";

const { ccclass, property } = _decorator;

@ccclass
export default class AudioManager extends Component {
    private readonly BGM_VOLUME: string = "bgm_volume";
    private readonly SOUND_VOLUME: string = "sound_volume";
    public static instance: AudioManager = null;

    @property(AudioSource)
    bgMusic: AudioSource = null;
    @property([AudioSource])
    soundEffects: AudioSource[] = [];
    @property(AudioClip)
    clickButton: AudioClip = null;

    private bgmVolume: number = 1;
    private sfxVolume: number = 1;
    private sfxId: number = 0;

    //#region Public methods

    public playBgm(clip: AudioClip): void {
        this.bgMusic.clip = clip;
        this.bgMusic.volume = this.bgmVolume;
        this.bgMusic.play();
    }

    public playSfx(clip: AudioClip): void {
        if (this.sfxId >= this.soundEffects.length)
            this.sfxId = 0;

        const source = this.soundEffects[this.sfxId];

        if (source.playing)
            source.stop();

        source.clip = clip;
        source.volume = this.sfxVolume;
        source.play();
        this.sfxId++;
    }

    public setBgmVolume(volume: number): void {
        this.bgmVolume = volume;
        this.bgMusic.volume = volume;
        sys.localStorage.setItem(this.BGM_VOLUME, volume.toString());
    }

    public setSfxVolume(volume: number): void {
        this.sfxVolume = volume;
        for (let i = 0; i < this.soundEffects.length; i++) {
            this.soundEffects[i].volume = volume;
        }
        sys.localStorage.setItem(this.SOUND_VOLUME, volume.toString());
    }

    public getBgmVolume(): number {
        return this.bgmVolume;
    }

    public getSfxVolume(): number {
        return this.sfxVolume;
    }

    public playClickButton(): void {
        this.playSfx(this.clickButton);
    }

    //#endregion

    //#region Life-cycle callbacks

    onLoad(): void {
        if (AudioManager.instance === null) {
            AudioManager.instance = this;
            director.addPersistRootNode(this.node);
        }
        else {
            this.node.destroy();
        }
    }

    start(): void {
        if (isNullOrEmpty(sys.localStorage.getItem(this.BGM_VOLUME))) {
            this.bgmVolume = 1;
        }
        else {
            this.bgmVolume = Number(sys.localStorage.getItem(this.BGM_VOLUME));
        }

        if (isNullOrEmpty(sys.localStorage.getItem(this.SOUND_VOLUME))) {
            this.sfxVolume = 1;
        }
        else {
            this.sfxVolume = Number(sys.localStorage.getItem(this.SOUND_VOLUME));
        }

        this.setBgmVolume(this.bgmVolume);
        this.setSfxVolume(this.sfxVolume);
    }

    //#endregion
}
