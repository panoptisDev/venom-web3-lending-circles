<template>
  
  <div v-if="accountCircleProps" id="account-circles-card">
    
    <!-- Whitelisted -->
    <div v-if="accountRoleProps == 'whitelisted'"
      role="button"
      @click="$router.push({path: '/account/circles/invited', query: {circle_id: accountCircleProps.circle_id}})"
    >
      <div class="account-circles-card-main">
        <div class="d-flex flex-column justify-content-center align-items-center pt-3 pb-2">
          <p>
            <span class="account-circles-card-title-icon red-btn">
              <i class="far fa-envelope fa-shake" style="--fa-animation-duration: 2s;" aria-hidden="true"></i>
              <span class="account-circles-card-title ms-1">
                You are invited
              </span>
            </span>
          </p>
        </div>
        
        <div class="d-flex flex-column justify-content-center align-items-center">
          <!-- Circle Name -->
          <div>
            <span class="account-circles-card-name">
              {{ accountCircleProps.circle_name }}
            </span>
          </div>

          <!-- Circle Creator -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">By:</span>
            <span class="account-circles-card-creator-fullname ps-2">
              {{ accountCircleProps.circle_creator.account_fullname || accountCircleProps.circle_creator.account_username }}
            </span>
          </div>

          <!-- Circle Members -->
          <div
            v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"
            class="d-flex flex-row justify-content-start align-items-center pt-2"
          >
            <span class="account-circles-card-note">Participants:</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_max_members }}
            </span>
            <span class="account-circles-card-unit ps-2">people</span>
          </div>
          <div v-else class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Participants:</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_min_members }}
            </span>
            <span class="account-circles-card-unit ps-2">to</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_max_members }}
            </span>
            <span class="account-circles-card-unit ps-2">people</span>
          </div>

          <!-- Circle Monthly Payments & Loan Amount -->
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_pay'">
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
            <div
              v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_max_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div
              v-else  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_min_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-2">to</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_max_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
          </div>
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_loan'">
            <div
              v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div
              v-else  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-2">to</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_min_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
          </div>

          <!-- Circle Start Date -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Start Date:</span>
            <span class="account-circles-card-text ps-2">
              {{ utils.formatDate(accountCircleProps.circle_start_date, 'DD Month YYYY') || 'Open' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Joined -->
    <div v-else-if="accountRoleProps == 'joined'"
      role="button"
      @click="$router.push({path: '/account/circles/joined', query: {circle_id: accountCircleProps.circle_id}})"
    >
      <div class="account-circles-card-main">
        <div class="d-flex flex-column justify-content-center align-items-center pt-3 pb-2">
          <p>
            <span class="account-circles-card-title-icon green-btn">
              <i class="far fa-calendar" aria-hidden="true"></i>
              <span class="account-circles-card-title ms-1">
                You have joined
              </span>
            </span>
          </p>
        </div>
        
        <div class="d-flex flex-column justify-content-center align-items-center">
          <!-- Circle Name -->
          <div>
            <span class="account-circles-card-name">
              {{ accountCircleProps.circle_name }}
            </span>
          </div>

          <!-- Circle Creator -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">By:</span>
            <span class="account-circles-card-creator-fullname ps-2">
              {{ accountCircleProps.circle_creator.account_fullname || accountCircleProps.circle_creator.account_username }}
            </span>
          </div>

          <!-- Circle Members -->
          <div
            v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"
            class="d-flex flex-row justify-content-start align-items-center pt-2"
          >
            <span class="account-circles-card-note">Participants:</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_max_members }}
            </span>
            <span class="account-circles-card-unit ps-2">people</span>
          </div>
          <div v-else class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Participants:</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_min_members }}
            </span>
            <span class="account-circles-card-unit ps-2">to</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_max_members }}
            </span>
            <span class="account-circles-card-unit ps-2">people</span>
          </div>

          <!-- Circle Monthly Payments & Loan Amount -->
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_pay'">
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
            <div
              v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_max_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div
              v-else  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_min_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-2">to</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_max_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
          </div>
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_loan'">
            <div
              v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div
              v-else  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-2">to</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_min_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
          </div>
          
          <!-- Circle Start Date -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Start Date:</span>
            <span class="account-circles-card-text ps-2">
              {{ utils.formatDate(accountCircleProps.circle_start_date, 'DD Month YYYY') || 'Open' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Creating - Deployed -->
    <div v-else-if="accountRoleProps == 'creating' && accountCircleProps.circle_status == 'deployed'"
      role="button"
      @click="$router.push({path: '/account/circles/create', query: {active_page: 'setup', circle_id: accountCircleProps.circle_id}})"
    >
      <div class="account-circles-card-main">
        <div class="d-flex flex-column justify-content-center align-items-center pt-3 pb-2">
          <p>
            <span class="account-circles-card-title-icon third-gray-btn">
              <i class="fa fa-gavel" aria-hidden="true"></i>
              <span class="account-circles-card-title ms-1">
                You are creating
              </span>
            </span>
          </p>
        </div>
        
        <div class="d-flex flex-column justify-content-center align-items-center">
          <!-- Circle Name -->
          <div>
            <span class="account-circles-card-name">
              New Circle
            </span>
          </div>

          <!-- Circle Status -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Status:</span>
            <span class="account-circles-card-creator-fullname ps-2">Deployed</span>
          </div>
          
          <!-- Blockchain -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Blockchain:</span>
            <span class="account-circles-card-creator-fullname ps-2">TomoChain</span>
          </div>
          
          <!-- Payment Token -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Payment Token:</span>
            <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            <span class="account-circles-card-creator-fullname ps-1">{{ defaultchain.nativeToken.symbol }}</span>
          </div>
          
          <!-- Round Period -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Round Period:</span>
            <span class="account-circles-card-creator-fullname ps-2">Monthly (30 days)</span>
          </div>
          
          <!-- Circle Payment Type -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Payment Type:</span>
            <span class="account-circles-card-creator-fullname ps-2">
              {{ accountCircleProps.circle_payment_type == 'fixed_pay' ? 'Fixed Payments' : 
               accountCircleProps.circle_payment_type == 'fixed_loan' ? 'Fixed Loan' : ''
              }}
            </span>
          </div>

        </div>
      </div>
    </div>
    
    <!-- Creating - Setuped -->
    <div v-else-if="accountRoleProps == 'creating' && (accountCircleProps.circle_status == 'setuped' || accountCircleProps.circle_status == 'launched')"
      role="button"
      @click="accountCircleProps.circle_total_whitelisted < accountCircleProps.circle_min_members ?
        $router.push({path: '/account/circles/create', query: {active_page: 'whitelist', circle_id: accountCircleProps.circle_id}}) :
        $router.push({path: '/account/circles/create', query: {active_page: 'launch', circle_id: accountCircleProps.circle_id}})"
    >
      <div class="account-circles-card-main">
        <div class="d-flex flex-column justify-content-center align-items-center pt-3 pb-2">
          <p v-if="accountCircleProps.circle_status == 'setuped'">
            <span class="account-circles-card-title-icon third-gray-btn">
              <i class="fa fa-cog fa-spin" style="--fa-animation-duration: 7s;"></i>
              <span class="account-circles-card-title ms-1">
                You are creating
              </span>
            </span>
          </p>
          <p v-if="accountCircleProps.circle_status == 'launched'">
            <span class="account-circles-card-title-icon third-gray-btn">
              <i class="fa fa-rocket"></i>
              <span class="account-circles-card-title ms-1">
                Launched
              </span>
            </span>
          </p>
        </div>
        
        <div class="d-flex flex-column justify-content-center align-items-center">
          <!-- Circle Name -->
          <div>
            <span class="account-circles-card-name">
              {{ accountCircleProps.circle_name }}
            </span>
          </div>

          <!-- Circle Payment Type -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Payment Type:</span>
            <span class="account-circles-card-creator-fullname ps-2">
              {{ accountCircleProps.circle_payment_type == 'fixed_pay' ? 'Fixed Payments' : 
               accountCircleProps.circle_payment_type == 'fixed_loan' ? 'Fixed Loan' : ''
              }}
            </span>
          </div>

          <!-- Circle Members -->
          <div
            v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"
            class="d-flex flex-row justify-content-start align-items-center pt-2"
          >
            <span class="account-circles-card-note">Participants:</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_max_members }}
            </span>
            <span class="account-circles-card-unit ps-2">people</span>
          </div>
          <div v-else class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Participants:</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_min_members }}
            </span>
            <span class="account-circles-card-unit ps-2">to</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_max_members }}
            </span>
            <span class="account-circles-card-unit ps-2">people</span>
          </div>

          <!-- Circle Monthly Payments & Loan Amount -->
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_pay'">
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
            <div
              v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_max_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div
              v-else  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_min_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-2">to</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount * accountCircleProps.circle_max_members }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
          </div>
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_loan'">
            <div
              v-if="accountCircleProps.circle_min_members == accountCircleProps.circle_max_members"  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div
              v-else  
              class="d-flex flex-row justify-content-start align-items-center pt-2"
            >
              <span class="account-circles-card-note">Monthly Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-2">to</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_fixed_amount / accountCircleProps.circle_min_members) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_fixed_amount }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
          </div>
          
          <!-- Circle Start Date -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Start Date:</span>
            <span class="account-circles-card-text ps-2">
              {{ utils.formatDate(accountCircleProps.circle_start_date, 'DD Month YYYY') || 'Open' }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: "AccountCirclesCard",
	props: {
    accountCircleProps: Object,
    accountRoleProps: String
  },
  mounted() {
    // console.log(this.accountCircleProps);
  }
}
</script>

<style scoped>
.account-circles-card-main {
  background: var(--ptn-second-bg);
  border-radius: 16px;
  width: calc(100% - 20px);
  max-width: 300px;
  height: 300px;
  text-align: center;
  margin: 20px auto;
}
.account-circles-card-title {
  font-size: 20px;
  font-weight: 400;
}
.account-circles-card-title-icon {
  font-size: 25px;
}
.account-circles-card-note {
  font-size: 14px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 0.7);
}
.account-circles-card-name {
  font-size: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
}
.account-circles-card-creator-fullname {
  font-size: 16px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
}
.account-circles-card-number {
  font-size: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
}
.account-circles-card-unit {
  font-size: 13px;
  font-weight: 400;
  color: rgba(var(--ptn-color-rgb), 0.5);
}
.account-circles-card-x {
  font-size: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 0.9);
  padding: 0 0 0 7px;
}
.account-circles-card-text {
  font-size: 16px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
