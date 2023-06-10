// This file for Handel connection between front end and back end
import axios from "axios"
// import { ElMessage } from "element-plus";
import { ElLoading } from 'element-plus'
import store from "@/store";

// import NoInternet from "@/components"
// import { createApp } from 'vue'
// import router from "@/router";
// import { router } from '@/router'

function errorNetworkModal() {
	// function refreshPage() {
	//     router.go();
	// }
	document.getElementById("start-app").innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div>
            <h5 style="color: var(--ptn-color);font-size:25px;font-weight:bold;font-family: arial,sans-serif;margin:10% 0 3%">
                Something Went Wrong
            </h5>
        </div>
        <div>
            <p style="color: var(--ptn-color);font-size:20px;font-weight:normal;font-family:Tahoma,Arial,sans-serif;">
                An error has occurred. Please check your internet connection and reload the page.
            </p>
        </div>
				<button
					onclick="location.reload();"
					style="background: var(--ptn-btn-bg);color: var(--ptn-btn-color);border-radius:6px;border-width:0;box-sizing:border-box;padding:10px 25px;font-family:Tahoma,Arial,sans-serif;margin-top:5%;"
				>
					Reload Page
				</button>
    </div>
    `
}


class api {
	constructor() {
		this.endpoints = {
			waiting_list: `${process.env.VUE_APP_API_URL}v1/waiting_list`,
			account_connect: `${process.env.VUE_APP_API_URL}v1/account/connect`,
			account: `${process.env.VUE_APP_API_URL}v1/account`,
			account_create: `${process.env.VUE_APP_API_URL}v1/account/create`,
			account_link: `${process.env.VUE_APP_API_URL}v1/account/link`,
			account_link_cancel: `${process.env.VUE_APP_API_URL}v1/account/link/cancel`,
			account_profile: `${process.env.VUE_APP_API_URL}v1/account/profile`,
			account_profile_update: `${process.env.VUE_APP_API_URL}v1/account/profile/update`,
			account_wallets: `${process.env.VUE_APP_API_URL}v1/account/wallets`,
			account_link_accept: `${process.env.VUE_APP_API_URL}v1/account/link/accept`,
			account_link_reject: `${process.env.VUE_APP_API_URL}v1/account/link/reject`,
			account_link_remove: `${process.env.VUE_APP_API_URL}v1/account/link/remove`,
			account_contacts: `${process.env.VUE_APP_API_URL}v1/account/contacts`,
			account_contacts_create_invite_code: `${process.env.VUE_APP_API_URL}v1/account/contacts/create_invite_code`,
			account_contacts_fetch_invite_code: `${process.env.VUE_APP_API_URL}v1/account/contacts/fetch_invite_code`,
			account_contacts_accept_invite_code: `${process.env.VUE_APP_API_URL}v1/account/contacts/accept_invite_code`,
			account_contacts_accept_waiting_contact: `${process.env.VUE_APP_API_URL}v1/account/contacts/accept_waiting_contact`,
			account_contacts_reject_waiting_contact: `${process.env.VUE_APP_API_URL}v1/account/contacts/reject_waiting_contact`,
			account_circles: `${process.env.VUE_APP_API_URL}v1/account/circles`,
			account_circles_invited: `${process.env.VUE_APP_API_URL}v1/account/circles/invited`,
			account_circles_invited_accept: `${process.env.VUE_APP_API_URL}v1/account/circles/invited/accept`,
			account_circles_invited_reject: `${process.env.VUE_APP_API_URL}v1/account/circles/invited/reject`,
			account_circles_joined: `${process.env.VUE_APP_API_URL}v1/account/circles/joined`,
			account_circles_creator: `${process.env.VUE_APP_API_URL}v1/account/circles/creator`,
			account_circles_creator_create: `${process.env.VUE_APP_API_URL}v1/account/circles/creator/create`,
			account_circles_creator_update: `${process.env.VUE_APP_API_URL}v1/account/circles/creator/update`,
			account_circles_creator_whitelists_add: `${process.env.VUE_APP_API_URL}v1/account/circles/creator/whitelists/add`,
			account_circles_creator_whitelists_remove: `${process.env.VUE_APP_API_URL}v1/account/circles/creator/whitelists/remove`,
			account_circles_creator_launch: `${process.env.VUE_APP_API_URL}v1/account/circles/creator/launch`,
			account_circles_creator_members: `${process.env.VUE_APP_API_URL}v1/account/circles/creator/members`,
			account_circles_change_round: `${process.env.VUE_APP_API_URL}v1/account/circles/change_round`,
			account_circles_leave: `${process.env.VUE_APP_API_URL}v1/account/circles/leave`,
		}
	}
	async loadAPI(endPoint, options) {
		console.log(endPoint, options)
		// endPoint = "change_password"
		// options = {
		//     method: "post",
		//     data: {},
		//     query: {},
		// }
	}
	async postAPI(endpoint, formBE, headers = {}, show = true) {
		let loading = this.show_loading();
		try {
			let response = await axios.post(endpoint, formBE, headers);
			loading.close()
			return this.check_response(response, show);
		} catch (error) {
			loading.close();
			errorNetworkModal();
		}
	}
	async getAPI(endPoint, headers, show) {
		let loading = this.show_loading();
		try {
			let response = await axios.get(endPoint, headers);
			loading.close()
			return this.check_response(response, show);
		} catch (error) {
			console.log(error);
			loading.close();
			errorNetworkModal();
		}
	}
	show_loading() {
		let loading = ElLoading.service({
			lock: true,
			text: '',
			background: 'rgba(0, 0, 0, 0.7)',
			fullscreen: true,
		});
		return loading;
	}
	get_auth() {
		return {
			headers: {
				Authorization: `Bearer ${store.getters.getConnectionStoreByKey('access_token')}`,
			},
		};
	}
	get_headers(params) {
		if(params != null) {
			return {
				headers: {
					Authorization: `Bearer ${store.getters.getConnectionStoreByKey('access_token')}`,
				},
			};
		} else {
			return {
				headers: {
					Authorization: `Bearer ${store.getters.getConnectionStoreByKey('access_token')}`,
					params,
				},
			};
		}
	}
	get_auth_temp(token) {
		return {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
	}
	async check_response(response, show) {
		if(response.status != 200) {
			response.data = {};
			response.data.done = false;
			response.data.message = 'Default Front Message for status Code';
			response.data.status_code = response.status_code;
		} else if(store.getters.getConnectionStoreByKey('is_connected') && response.data.status_code == 401) {
			await store.dispatch('logoutAccount');
		}
		if(!show) {
			this.response_message(response.data.done.toString(), response.data.message);
		}
		return response;
	}
	async post_waiting_list(formBE, show = true) {
		return this.postAPI(this.endpoints.waiting_list, formBE, {}, show)
	}
	async post_account_connect(formBE, show = true) {
		return this.postAPI(this.endpoints.account_connect, formBE, {}, show)
	}
	async get_account(show = true) {
		return this.getAPI(this.endpoints.account, this.get_auth(), show)
	}
	async post_account_create(formBE, show = true) {
		return this.postAPI(this.endpoints.account_create, formBE, this.get_auth(), show)
	}
	async post_account_link(formBE, show = true) {
		return this.postAPI(this.endpoints.account_link, formBE, this.get_auth(), show)
	}
	async post_account_link_cancel(show = true) {
		return this.postAPI(this.endpoints.account_link_cancel, {}, this.get_auth(), show)
	}
	async get_account_profile(show = true) {
		return this.getAPI(this.endpoints.account_profile, this.get_auth(), show)
	}
	async post_account_profile_update(formBE, show = true) {
		return this.postAPI(this.endpoints.account_profile_update, formBE, this.get_auth(), show)
	}
	async get_account_wallets(show = true) {
		return this.getAPI(this.endpoints.account_wallets, this.get_auth(), show)
	}
	async post_account_link_accept(formBE, show = true) {
		return this.postAPI(this.endpoints.account_link_accept, formBE, this.get_auth(), show)
	}
	async post_account_link_reject(formBE, show = true) {
		return this.postAPI(this.endpoints.account_link_reject, formBE, this.get_auth(), show)
	}
	async post_account_link_remove(formBE, show = true) {
		return this.postAPI(this.endpoints.account_link_remove, formBE, this.get_auth(), show)
	}
	async get_account_contacts(show = true) {
		return this.getAPI(this.endpoints.account_contacts, this.get_auth(), show)
	}
	async post_account_contacts_create_invite_code(show = true) {
		return this.postAPI(this.endpoints.account_contacts_create_invite_code, {}, this.get_auth(), show)
	}
	async get_account_contacts_fetch_invite_code(params, show = true) {
		return this.getAPI(`${this.endpoints.account_contacts_fetch_invite_code}?${params}`, this.get_auth(), show)
	}
	async post_account_contacts_accept_invite_code(formBE, show = true) {
		return this.postAPI(this.endpoints.account_contacts_accept_invite_code, formBE, this.get_auth(), show)
	}
	async post_account_contacts_accept_waiting_contact(formBE, show = true) {
		return this.postAPI(this.endpoints.account_contacts_accept_waiting_contact, formBE, this.get_auth(), show)
	}
	async post_account_contacts_reject_waiting_contact(formBE, show = true) {
		return this.postAPI(this.endpoints.account_contacts_reject_waiting_contact, formBE, this.get_auth(), show)
	}
	async get_account_circles(show = true) {
		return this.getAPI(this.endpoints.account_circles, this.get_auth(), show)
	}
	async get_account_circles_invited(params, show = true) {
		return this.getAPI(`${this.endpoints.account_circles_invited}?${params}`, this.get_auth(), show)
	}
	async post_account_circles_invited_accept(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_invited_accept, formBE, this.get_auth(), show)
	}
	async post_account_circles_invited_reject(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_invited_reject, formBE, this.get_auth(), show)
	}
	async get_account_circles_joined(params, show = true) {
		return this.getAPI(`${this.endpoints.account_circles_joined}?${params}`, this.get_auth(), show)
	}
	async get_account_circles_creator(params, show = true) {
		return this.getAPI(`${this.endpoints.account_circles_creator}?${params}`, this.get_auth(), show)
	}
	async post_account_circles_creator_create(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_creator_create, formBE, this.get_auth(), show)
	}
	async post_account_circles_creator_update(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_creator_update, formBE, this.get_auth(), show)
	}
	async post_account_circles_creator_whitelists_add(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_creator_whitelists_add, formBE, this.get_auth(), show)
	}
	async post_account_circles_creator_whitelists_remove(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_creator_whitelists_remove, formBE, this.get_auth(), show)
	}
	async post_account_circles_creator_launch(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_creator_launch, formBE, this.get_auth(), show)
	}
	async get_account_circles_creator_members(params, show = true) {
		return this.getAPI(`${this.endpoints.account_circles_creator_members}?${params}`, this.get_auth(), show)
	}
	async post_account_circles_change_round(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_change_round, formBE, this.get_auth(), show)
	}
	async post_account_circles_leave(formBE, show = true) {
		return this.postAPI(this.endpoints.account_circles_leave, formBE, this.get_auth(), show)
	}
}

export default new api();
