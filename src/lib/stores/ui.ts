import { writable } from 'svelte/store';

/**
 * UI関連のストア管理
 */

// ローディング状態
export const isLoading = writable(false);

// モーダル表示状態
export const popupFetchErrorModal = writable(false);
export const popupUrlErrorModal = writable(false);
export const popupRegionErrorModal = writable(false);

/**
 * ローディング状態をトグル
 */
export const toggleLoadingState = () => {
	isLoading.update((value) => !value);
};

/**
 * フェッチエラーモーダルをトグル
 */
export const toggleFetchErrorModal = () => {
	popupFetchErrorModal.update((value) => !value);
};

/**
 * URLエラーモーダルを開く
 */
export const openUrlErrorModal = () => {
	popupUrlErrorModal.set(true);
};

/**
 * URLエラーモーダルを閉じる
 */
export const closeUrlErrorModal = () => {
	popupUrlErrorModal.set(false);
};

/**
 * 地域エラーモーダルをトグル
 */
export const toggleRegionErrorModal = () => {
	popupRegionErrorModal.update((value) => !value);
};