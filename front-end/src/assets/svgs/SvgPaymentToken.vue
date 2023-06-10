<template>
	<!-- TomoChain -->
	<div v-if="chainId == 88 || chainId == 89">
		<!-- TOMO -->
		<div v-if="paymentToken == this.defaultchain.nativeToken.address">
			<el-tooltip :content="this.defaultchain.nativeToken.symbol" :placement="tooltip ? 'top' : ''" :hide-after="0">
				<SvgTomoIcon
					:style="`height: ${height}px; margin-bottom:  ${(24-height)/2}px;`"
					:class="customClass"
				/>
			</el-tooltip>
		</div>
	</div>
	
	<!-- VenomNetwork -->
	<div v-else-if="chainId == 1000 || chainId == 1002">
		<!-- Venom -->
		<el-tooltip :content="this.defaultchain.nativeToken.symbol" :placement="tooltip ? 'top' : ''" :hide-after="0">
			<SvgVenomIcon
				:style="`height: ${height}px; margin-bottom:  ${(24-height)/2}px;`"
				:class="customClass"
			/>
		</el-tooltip>
	</div>
	

	<!-- Undefined -->
	<div v-else>
		<el-tooltip content="Undefined Token" :placement="tooltip ? 'top' : ''" :hide-after="0">
			<div :class="customClass">
				<i class="far fa-exclamation-circle" aria-hidden="true"></i>
			</div>
		</el-tooltip>
	</div>
</template>

<script>
import { SvgTomoIcon, SvgVenomIcon } from "@/assets/svgs";

export default {
  name: "SvgPaymentToken",
  components: {
    SvgTomoIcon,
		SvgVenomIcon
  },
  props: {
    chainId: String,
		paymentToken: String,
		tooltip: {
			type: Boolean,
			default: true,
		},
		height: {
			type: Number,
			default: 16,
		},
    customClass: String
  }
};
</script>
