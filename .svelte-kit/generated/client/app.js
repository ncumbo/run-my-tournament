export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26')
];

export const server_loads = [2];

export const dictionary = {
		"/": [5],
		"/about": [7],
		"/admin/dashboard": [8],
		"/admin/login": [9],
		"/admin/register": [10],
		"/contact": [11],
		"/dashboard": [12,[4]],
		"/dashboard/analytics": [13,[4]],
		"/dashboard/customization": [14,[4]],
		"/dashboard/domains": [15,[4]],
		"/dashboard/payments": [16,[4]],
		"/dashboard/tournaments": [17,[4]],
		"/dashboard/tournaments/create": [18,[4]],
		"/history": [19],
		"/leaderboard": [20],
		"/login": [21],
		"/register": [22],
		"/signup": [23],
		"/sponsorship": [24],
		"/tournament-details": [25],
		"/volunteer": [26],
		"/[subdomain]": [6,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';