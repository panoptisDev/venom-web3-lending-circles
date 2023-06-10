import NotFound from '@/pages/NotFound.vue';
import HomePage from '@/pages/HomePage';
// import AccountPage from '@/pages/account/AccountPage';
import AccountNew from '@/pages/account/AccountNew';
import AccountProfile from '@/pages/account/AccountProfile';
// import AccountCreate from '@/pages/account/AccountCreate';
import AccountSettings from '@/pages/account/AccountSettings';
import AccountContacts from '@/pages/account/AccountContacts';
import AccountCircles from '@/pages/account/AccountCircles';
import AccountCirclesCreate from '@/pages/account/AccountCirclesCreate.vue';

import TestPage from '@/pages/TestPage'

const routes = [
	{
		path: "/:pathMatch(.*)*",
		component: NotFound
	},
	{
		path: '/',
		name: 'HomePage',
		component: HomePage,
		meta: {
			title: "Web3 Lending Circles",
			auth: false,
		}
	},
	// Account Pages
	// {
	// 	path: '/account',
	// 	name: 'AccountPage',
	// 	component: AccountPage,
	// 	meta: {
	// 		title: "Piltonet | Account",
	// 		auth: true,
	// 		main: false,
	// 		chain: false
	// 	}
	// },
	{
		path: '/account',
		alias: '/account',
		name: 'AccountNew',
		component: AccountNew,
		meta: {
			title: "Piltonet | Welcome",
			auth: true,
			main: false,
			chain: false
		}
	},
	{
		path: '/account/:cid',
		alias: '/account/:cid',
		name: 'AccountNewCid',
		component: AccountNew,
		meta: {
			title: "Piltonet | Welcome",
			auth: true,
			main: false,
			chain: false
		}
	},


	// {
	// 	path: '/account/create',
	// 	name: 'AccountCreate',
	// 	component: AccountPage,
	// 	meta: {
	// 		title: "Piltonet | Create A NEW Account",
	// 		auth: true,
	// 		main: false,
	// 		chain: false
	// 	}
	// },



	{
		path: '/account/profile',
		name: 'AccountProfile',
		component: AccountProfile,
		meta: {
			title: "Piltonet | Profile",
			auth: true,
			main: true,
			chain: false
		}
	},
	{
		path: '/account/settings',
		name: 'AccountSettings',
		component: AccountSettings,
		meta: {
			title: "Piltonet | Settings",
			auth: true,
			main: true,
			chain: false
		}
	},
	{
		path: '/account/contacts',
		alias: '/account/contacts',
		name: 'AccountContacts',
		component: AccountContacts,
		meta: {
			title: "Piltonet | Contact List",
			auth: true,
			main: true,
			chain: false
		}
	},
	{
		path: '/account/circles',
		alias: '/account/circles',
		name: 'AccountCircles',
		component: AccountCircles,
		meta: {
			title: "Piltonet | Lending Circles",
			auth: true,
			main: true,
			chain: true
		}
	},
	{
		path: '/account/circles/create',
		alias: '/account/circles/create',
		name: 'AccountCirclesCreate',
		component: AccountCirclesCreate,
		meta: {
			title: "Piltonet | Lending Circles",
			auth: true,
			main: true,
			chain: true
		}
	},
	{
		path: '/account/circles/:cid',
		alias: '/account/circles/:cid',
		name: 'AccountCirclesCid',
		component: AccountCircles,
		meta: {
			title: "Piltonet | Lending Circles",
			auth: true,
			main: true,
			chain: true
		}
	},
	// {
	// 	path: '/account/circles/:cid',
	// 	alias: '/account/circles/:cid',
	// 	name: 'AccountCircles',
	// 	component: AccountCircles,
	// 	meta: {
	// 		title: "Piltonet | Lending Circles",
	// 		auth: true,
	// 		main: true,
	// 		chain: true
	// 	}
	// },
]


if(process.env.VUE_APP_NODE_ENV == 'development') {
	routes.push(
		{
			path: '/test',
			name: 'TestPage',
			component: TestPage,
			meta: {
				title: "Piltonet | Test",
				auth: false,
				main: false,
				chain: false
			}
		}
	)
}

export default routes;
