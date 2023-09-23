import { writable } from 'svelte/store';

export const isLoading = writable(false);
export const popupFetchErrorModal = writable(false);
export const popupUrlErrorModal = writable(false);

export const toggleLoadingState = () => {
	isLoading.update((value) => !value);
};

export const togglepopupFetchModal = () => {
	popupFetchErrorModal.update((value) => !value);
};

export const togglepopupUrlErrorModal = () => {
	popupUrlErrorModal.update((value) => !value);
};
