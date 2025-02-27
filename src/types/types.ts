import { Href } from "expo-router";

export interface ISocialMedia {
  id: string;
  url: string;
  icon: string;
  color: string;
}

export interface INameWithSlug {
  arabicName: string;
  englishName: string;
  slug: string;
}

export interface IDynamicSearchParams {
  [key: string]: string | number | undefined;
}

export interface ITabLink {
  label: string;
  routeName: Href<string>;
  icon: string;
}

export interface ITopBarLink {
  label: string;
  routeName: Href<string>;
  params: Record<string, string>;
}

export enum RepeatModeOptions {
  OFF = "OFF",
  ONE = "ONE",
  ALL = "ALL",
}

export interface IPlayerReciter extends INameWithSlug {
  photo: string;
}

export interface IPlayerState {
  audioFiles: IAudioFile[];
  currentAudio: IAudioFile;
  isPlaying: boolean;
  surahIndex: number;
  repeatMode: RepeatModeOptions;
  isModalVisible: boolean;
  isModalExpanded: boolean;
  audioHasEnded: boolean;
  reciter: IPlayerReciter;
  recitation: IPlayerRecitation;
  modalHeight: number;
  playLoading: boolean;
  loadingNextPrev: boolean;
  isPlaylist: boolean;
}

export interface IReciter extends INameWithSlug {
  number: number;
  photo: string;
  recitations: IReciterRecitation[];
  isTopReciter: boolean;
  totalViewers: number;
}

export interface IReciterRecitation {
  recitationInfo: IPlayerRecitation;
  audioFiles: IAudioFile[];
  isCompleted: boolean;
  downloadURL: string;
}

export interface IAudioFile {
  url: string;
  downloadUrl: string;
  surahNumber: number;
  surahInfo: ISurah;
}

export interface IPlayerRecitation extends INameWithSlug {}

export interface ISurah extends INameWithSlug {
  surahNumber: number;
  pageNumber: number;
}

export interface IPrayerTimes {
  [key: string]: string;
}

export interface INextPrayer {
  name: string;
  time: string;
}

export interface IRemainingTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface IFavouriteBookmark {
  type: string;
  arabicName: string;
  englishName: string;
  photo: string;
  reciterSlug: string;
  recitationSlug: string;
}

export interface IPlaylistBookmark {
  reciter: IPlayerReciter;
  recitation: IPlayerRecitation;
  audioFiles: IAudioFile[];
  key: string;
}
