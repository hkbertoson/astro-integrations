import type {DotLottie} from '@lottiefiles/dotlottie-web';

export interface LottieAnimationConfig {
	id?: string;
	src: string;
	player?: 'light' | 'full';
	loop?: boolean;
	autoplay?: boolean | 'visible';
	visibleThreshold?: number;
}

export type LottieAnimation = Readonly<
	{
		id: string;
		config: LottieAnimationConfig;
		container: HTMLElement;
	} & (
		| {
				isLoaded: true;
				player: DotLottie;
		  }
		| {
				isLoaded: false;
				player: undefined;
		  }
	)
>;

export type AstroDotLottie = {
	/**
	 * Get a LottieAnimation by the configured id
	 */
	getAnimation(id: string): LottieAnimation | undefined;

	/**
	 * Get a LottieAnimation from the hosting element containerhttps://docs.astro.build/en/guides/server-side-rendering/#astroresponseheaders
	 */
	getAnimation(from: {container: HTMLElement}): LottieAnimation | undefined;

	/**
	 * Get a LottieAnimation from the hosting element container
	 */
	getAnimation(from: {elementId: string}): LottieAnimation | undefined;

	/**
	 * Get all the LottieAnimation for the current page
	 */
	getAllAnimations(): LottieAnimation[];
};
