
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/admin" | "/admin/dashboard" | "/admin/login" | "/admin/register" | "/api" | "/api/admin" | "/api/admin/login" | "/api/admin/register" | "/api/tournament" | "/contact" | "/history" | "/leaderboard" | "/register" | "/sponsorship" | "/tournament-details" | "/volunteer";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/dashboard": Record<string, never>;
			"/admin/login": Record<string, never>;
			"/admin/register": Record<string, never>;
			"/api": Record<string, never>;
			"/api/admin": Record<string, never>;
			"/api/admin/login": Record<string, never>;
			"/api/admin/register": Record<string, never>;
			"/api/tournament": Record<string, never>;
			"/contact": Record<string, never>;
			"/history": Record<string, never>;
			"/leaderboard": Record<string, never>;
			"/register": Record<string, never>;
			"/sponsorship": Record<string, never>;
			"/tournament-details": Record<string, never>;
			"/volunteer": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/dashboard" | "/admin/dashboard/" | "/admin/login" | "/admin/login/" | "/admin/register" | "/admin/register/" | "/api" | "/api/" | "/api/admin" | "/api/admin/" | "/api/admin/login" | "/api/admin/login/" | "/api/admin/register" | "/api/admin/register/" | "/api/tournament" | "/api/tournament/" | "/contact" | "/contact/" | "/history" | "/history/" | "/leaderboard" | "/leaderboard/" | "/register" | "/register/" | "/sponsorship" | "/sponsorship/" | "/tournament-details" | "/tournament-details/" | "/volunteer" | "/volunteer/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/2024-ibm-golf-basket-raffle.png" | "/2024-ibm-golf-champions.png" | "/2024-ibm-golf-runner-ups.png" | "/2024-ibm-golf-team-1.png" | "/2024-ibm-golf-team-2.png" | "/2024-sponsors-thankyou-card.jpg" | "/action-shots/WHITE6487-R1-00-00A.JPG" | "/action-shots/WHITE6487-R1-01-0A.JPG" | "/action-shots/WHITE6487-R1-02-1A.JPG" | "/action-shots/WHITE6487-R1-03-2A.JPG" | "/action-shots/WHITE6487-R1-04-3A.JPG" | "/action-shots/WHITE6487-R1-05-4A.JPG" | "/action-shots/WHITE6487-R1-06-5A.JPG" | "/action-shots/WHITE6487-R1-07-6A.JPG" | "/action-shots/WHITE6487-R1-08-7A.JPG" | "/action-shots/WHITE6487-R1-09-8A.JPG" | "/action-shots/WHITE6487-R1-10-9A.JPG" | "/action-shots/WHITE6487-R1-11-10A.JPG" | "/action-shots/WHITE6487-R1-12-11A.JPG" | "/action-shots/WHITE6487-R1-13-12A.JPG" | "/action-shots/WHITE6487-R1-14-13A.JPG" | "/action-shots/WHITE6487-R1-15-14A.JPG" | "/action-shots/WHITE6487-R1-16-15A.JPG" | "/action-shots/WHITE6487-R1-17-16A.JPG" | "/action-shots/WHITE6487-R1-18-17A.JPG" | "/action-shots/WHITE6487-R1-19-18A.JPG" | "/action-shots/WHITE6487-R1-20-19A.JPG" | "/action-shots/WHITE6487-R1-21-20A.JPG" | "/circular-ibm-buffalo-logo.jpg" | "/horizontal-ibm-buffalo-logo.jpg" | string & {};
	}
}